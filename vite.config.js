import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { v4wp } from '@kucrut/vite-for-wp';
import { wp_scripts } from '@kucrut/vite-for-wp/plugins';
// import { wordpressPlugin } from '@roots/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Get all styles and scripts from blocks
const blockStylesEntries = [];
const blocksStyles = glob.sync(
  resolve(__dirname, 'resources/blocks/**/style.css'),
);
blocksStyles.forEach((style) => {
  blockStylesEntries[style.replace(`${__dirname}/`, '').replace('.css', '')] =
    style.replace(`${__dirname}/`, '');
});

const blockScriptsEntries = [];
const blocksScripts = glob.sync(
  resolve(__dirname, 'resources/blocks/**/script.ts'),
);
blocksScripts.forEach((js) => {
  blockScriptsEntries[js.replace(`${__dirname}/`, '').replace('.ts', '')] =
    js.replace(`${__dirname}/`, '');
});

export default defineConfig({
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

    // Handle WP external dependencies
    wp_scripts(),
    react({
      jsxRuntime: 'classic',
    }),

    // NOT USED as we use v4wp plugin
    // wordpressPlugin(),
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
