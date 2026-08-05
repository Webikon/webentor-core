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

/**
 * `@roots/vite-plugin` emits editor.deps.json from a Set, so its order follows
 * module-transform order — nondeterministic under Rolldown. That churned the
 * asset hash, filename and manifest on every rebuild, making `git diff` useless
 * for telling a real build change from noise.
 *
 * It also emits the file hashed under assets/, while app/setup-core.php reads a
 * fixed `public/build/editor.deps.json` — a path that never existed, so the
 * editor bundle silently enqueued with no wp-* dependencies at all.
 *
 * Re-emitting it sorted at that fixed path fixes both: stable bytes, and a file
 * PHP can actually find. Order is irrelevant to WordPress, which resolves script
 * load order from its own dependency graph.
 */
function stableEditorDeps() {
  return {
    name: 'webentor-stable-editor-deps',
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const key = Object.keys(bundle).find(
          (k) =>
            bundle[k].originalFileName === 'editor.deps.json' ||
            bundle[k].name === 'editor.deps.json',
        );
        if (!key) {
          this.warn(
            'editor.deps.json was not emitted — @roots/vite-plugin may have changed.',
          );
          return;
        }

        const deps = JSON.parse(bundle[key].source);
        delete bundle[key];

        this.emitFile({
          type: 'asset',
          // fileName (not name) opts out of hashing — PHP reads this exact path.
          fileName: 'editor.deps.json',
          source: `${JSON.stringify([...deps].sort(), null, 2)}\n`,
        });

        // The manifest still points at the hashed asset just dropped. Left alone
        // it would both dangle and keep churning, since its hash comes from the
        // unsorted source.
        const manifest = bundle['manifest.json'];
        if (!manifest) {
          this.warn('manifest.json not in bundle — editor.deps entry left stale.');
          return;
        }
        const entries = JSON.parse(manifest.source);
        if (entries['editor.deps.json']) {
          entries['editor.deps.json'].file = 'editor.deps.json';
          manifest.source = JSON.stringify(entries, null, 2);
        }
      },
    },
  };
}

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

    // Must come after wordpressExternals — it rewrites what roots' plugin emits.
    stableEditorDeps(),
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
