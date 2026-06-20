import { createHash } from 'node:crypto';
import { v4wp } from '@kucrut/vite-for-wp';
import { wordpressPlugin } from '@roots/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig, normalizePath } from 'vite';

// --- WordPress externals interop for Vite 8 / Rolldown ---------------------------------------
// (mirrors the consumer theme's vite.config.js)

// 1) react / react-dom / react/jsx-runtime — CJS virtual modules re-exporting the WP-provided
//    window globals. CJS so both require() and `import *` work via Rolldown's __toESM interop;
//    externalizing them breaks `import * as React` (React$NN = React$NN → undefined).
function reactGlobalsShim() {
  const shims = {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    'react/jsx-runtime': 'window.ReactJSXRuntime',
  };
  const PREFIX = '\0wp-react-shim:';
  return {
    name: 'wp-react-globals-shim',
    enforce: 'pre',
    resolveId(id) {
      if (Object.prototype.hasOwnProperty.call(shims, id)) {
        return `${PREFIX}${id}.cjs`;
      }
      return null;
    },
    load(id) {
      if (id.startsWith(PREFIX)) {
        const key = id.slice(PREFIX.length, -'.cjs'.length);
        return `module.exports = ${shims[key]};`;
      }
      return null;
    },
  };
}

// 2) Rolldown preserves CJS `require()` of externalized modules (@10up/block-components does
//    require('@wordpress/element')). The browser has no `require`, so its interop shim throws.
//    Prepend a module-scoped `require` resolving externals from WP globals, in generateBundle
//    (after Oxc minify, or the literal `require` gets mangled). Recompute the content hash and
//    rename entry chunks in place so filenames stay correct (Vite's manifest plugin is post).
function wpExternalRequireShim() {
  const shim =
    'var require=function(id){' +
    'if(id.indexOf("@wordpress/")===0){var n=id.slice(11).replace(/-([a-z])/g,function(m,c){return c.toUpperCase()});return window.wp[n];}' +
    'switch(id){' +
    'case"lodash":return window.lodash;' +
    'case"moment":return window.moment;' +
    'case"jquery":return window.jQuery;' +
    'case"backbone":return window.Backbone;' +
    '}throw new Error("Unmapped external require: "+id);};';
  const NEEDLE = "doesn't expose the `require`";
  return {
    name: 'wp-external-require-shim',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'chunk' || !file.code.includes(NEEDLE)) continue;
        file.code = shim + file.code;
        if (file.isEntry) {
          const hash = createHash('sha256')
            .update(file.code)
            .digest('base64url')
            .slice(0, 8);
          file.fileName = file.fileName.replace(/-[\w-]{8}\.js$/, `-${hash}.js`);
        }
      }
    },
  };
}

// Get all styles and scripts from blocks
const blockStylesEntries = [];
const blocksStyles = glob.sync('./resources/blocks/**/style.css');
blocksStyles.forEach((style) => {
  const normalizedPath = normalizePath(style.replace(`./`, ''));
  blockStylesEntries[normalizedPath.replace('.css', '')] = normalizedPath;
});

const blockScriptsEntries = [];
const blocksScripts = glob.sync('./resources/blocks/**/script.ts');
blocksScripts.forEach((js) => {
  const normalizedPath = normalizePath(js.replace(`./`, ''));
  blockScriptsEntries[normalizedPath.replace('.ts', '')] = normalizedPath;
});

export default defineConfig({
  publicDir: 'public-assets',
  plugins: [
    reactGlobalsShim(),
    tailwindcss(),

    v4wp({
      input: {
        // Core
        coreEditorJs: 'resources/scripts/editor.ts',
        coreEditorStyles: 'resources/styles/editor.css',
        coreAppStyles: 'resources/styles/app.css',

        // Components
        sliderJs: 'resources/core-components/slider/slider.script.ts',
        sliderStyles: 'resources/core-components/slider/slider.style.css',

        // Blocks
        ...blockStylesEntries,
        ...blockScriptsEntries,
      },
      outDir: 'public/build',
    }),

    // Handle WP external dependencies (@wordpress/* -> wp.*). Native Vite, replaces kucrut
    // wp_scripts(). jsx:false keeps JSX on @vitejs/plugin-react (classic). react/react-dom/
    // jsx-runtime are handled by reactGlobalsShim, not externalized here.
    wordpressPlugin({
      jsx: false,
      externalMappings: {
        lodash: { global: ['lodash'], handle: 'lodash' },
        moment: { global: ['moment'], handle: 'moment' },
        jquery: { global: ['jQuery'], handle: 'jquery' },
        backbone: { global: ['Backbone'], handle: 'backbone' },
      },
    }),
    react({
      jsxRuntime: 'classic',
    }),

    wpExternalRequireShim(),
  ],
  optimizeDeps: {
    // Fix imports from webpack built libraries
    include: ['@10up/block-components'],
  },
  server: {
    cors: true,
  },
  resolve: {
    alias: {
      '@scripts': '/resources/scripts',
      '@styles': '/resources/styles',
      '@fonts': '/resources/fonts',
      '@images': '/resources/images',
      '@blocks': '/resources/blocks',
      '@webentorCore': '/core-js',
    },
  },
});
