<?php

namespace Webentor\Core;

use Illuminate\Support\Facades\File;
use Kucrut\Vite;

/**
 * Fix CSS assets to be enqueued as styles
 * https://github.com/kucrut/vite-for-wp/issues/107
 *
 * @param  array  $assets   Registered assets.
 * @param  object $manifest Manifest object.
 * @param  string $entry    Entrypoint file.
 * @param  array  $options  Enqueue options.
 * @return array
 */
add_filter('vite_for_wp__production_assets', function ($assets, $manifest, $entry, $options) {
    $url = Vite\prepare_asset_url($manifest->dir);
    $item = $manifest->data->{$entry};
    $src = "{$url}/{$item->file}";

    if (str_ends_with($src, '.css')) {
        // Don't worry about browser caching as the version is embedded in the file name.
        if ($registered = wp_register_style($options['handle'], $src, $options['css-dependencies'], null)) {
            $assets['styles'][] = $options['handle'];
        }
    }

    return $assets;
}, 10, 4);

add_filter('vite_for_wp__development_assets', function ($assets, $manifest, $entry, $options) {
    $src = Vite\generate_development_asset_src($manifest, $entry);

    if (str_ends_with($src, '.css')) {
        // Don't worry about browser caching as the version is embedded in the file name.
        if ($registered = wp_register_style($options['handle'], $src, $options['css-dependencies'], null)) {
            $assets['styles'][] = $options['handle'];
        }
    }

    return $assets;
}, 10, 4);

/**
 * Enqueue core Gutenberg editor assets
 */
add_action('enqueue_block_editor_assets', function (): void {
    $dependencies = File::exists(WEBENTOR_CORE_PUBLIC_PATH . '/editor.deps.json') ? File::json(WEBENTOR_CORE_PUBLIC_PATH . '/editor.deps.json') : [];

    Vite\enqueue_asset(
        WEBENTOR_CORE_VITE_MANIFEST_DIR,
        'resources/scripts/editor.ts',
        [
            'handle' => 'webentor-core-editor-js',
            'dependencies' => [...$dependencies, 'react', 'react-dom'],
            'in-footer' => true,
        ]
    );

    Vite\enqueue_asset(
        WEBENTOR_CORE_VITE_MANIFEST_DIR,
        'resources/styles/editor.css',
        [
            'handle' => 'webentor-core-editor-styles',
            'css-only' => true,
        ]
    );
}, 5);

/**
 * Enqueue core frontend assets
 */
add_action('wp_enqueue_scripts', function () {
    // Core styles
    Vite\enqueue_asset(
        WEBENTOR_CORE_VITE_MANIFEST_DIR,
        'resources/styles/app.css',
        [
            'handle' => 'webentor-core-app-styles',
            'css-only' => true,
        ]
    );

    // Core components
    Vite\enqueue_asset(
        WEBENTOR_CORE_VITE_MANIFEST_DIR,
        'resources/core-components/slider/slider.script.ts',
        [
            'handle' => 'webentor-core-slider-scripts',
            'dependencies' => ['wp-i18n'], // Only WP dependency we could use on frontend
        ]
    );

    Vite\enqueue_asset(
        WEBENTOR_CORE_VITE_MANIFEST_DIR,
        'resources/core-components/slider/slider.style.css',
        [
            'handle' => 'webentor-core-slider-styles',
            'css-only' => true,
        ]
    );

    // $components = glob(WEBENTOR_CORE_RESOURCES_DIR . '/core-components/*/');
    // foreach ($components as $component) {
    //     $componentName = basename($component);
    //     if (File::exists(WEBENTOR_CORE_RESOURCES_DIR . "/core-components/{$componentName}/{$componentName}.script.ts")) {
    //         Vite\enqueue_asset(
    //             WEBENTOR_CORE_VITE_MANIFEST_DIR,
    //             "resources/core-components/{$componentName}/{$componentName}.script.ts",
    //             [
    //                 'handle' => "theme-{$componentName}-scripts",
    //                 'dependencies' => ['wp-i18n'], // Only WP dependency we could use on frontend
    //             ]
    //         );
    //     }

    //     if (File::exists(WEBENTOR_CORE_RESOURCES_DIR . "/core-components/{$componentName}/{$componentName}.style.css")) {
    //         Vite\enqueue_asset(
    //             WEBENTOR_CORE_VITE_MANIFEST_DIR,
    //             "resources/core-components/{$componentName}/{$componentName}.style.css",
    //             [
    //                 'handle' => "theme-{$componentName}-styles",
    //                 'css-only' => true,
    //             ]
    //         );
    //     }
    // }
}, 5);

/**
 * Add the WordPress AJAX URL to the window object.
 *
 * This allows JavaScript to make AJAX requests to the WordPress admin-ajax.php endpoint.
 */
add_action('wp_head', function () {
    if (!apply_filters('webentor/add_head_ajax_url', true)) {
        return;
    }

    echo '<script>window.wpAjaxUrl = "' . admin_url('admin-ajax.php') . '";</script>';
});
