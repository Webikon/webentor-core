import { v4wp } from '@kucrut/vite-for-wp';
import tailwindcss from '@tailwindcss/vite';
import { wordpressExternals } from '@webikon/webentor-configs/vite';
import { glob } from 'glob';
import { defineConfig, normalizePath } from 'vite';

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

export default defineConfig(({ command }) => ({
  publicDir: 'public-assets',
  plugins: [
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

    // WordPress externals (@wordpress/* -> wp.*, react -> window.React) — hybrid per command:
    // roots wordpressPlugin + interop shims for the build, kucrut wp_scripts() for the dev server.
    // See @webikon/webentor-configs/vite.
    ...wordpressExternals(command),
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
}));
