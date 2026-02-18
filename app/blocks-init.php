<?php

namespace Webentor\Core;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

/**
 * Register all frontend blocks assets from theme and core.
 * Needs to be run before register_block_type_from_metadata
 * @param null|mixed $block_json_files
 * @param null|mixed $manifest
 */
function register_frontend_blocks_assets($block_json_files = null, $manifest = null)
{
    if (!$block_json_files) {
        return;
    }

    $manifest_path = $manifest === 'webentor-core' ? WEBENTOR_CORE_MANIFEST_PATH : get_template_directory() . '/public/build/manifest.json';
    $public_path = $manifest === 'webentor-core' ? WEBENTOR_CORE_PUBLIC_PATH : get_template_directory() . '/public/build';

    // Auto register all blocks that were found.
    foreach ($block_json_files as $filename) {
        $block_folder = dirname($filename);

        // Get from folder path, slug would be the string after last occurence of "/"
        $block_slug = substr($block_folder, strrpos($block_folder, "/") + 1);

        // Handle Vite assets
        if (file_exists($manifest_path)) {
            $build_manifest = File::json($manifest_path) ?? [];
            $block_js = str_ends_with($filename, 'script.ts') || str_ends_with($filename, 'script.tsx') ? [$filename] : [];
            $block_css = str_ends_with($filename, 'style.css') ? [$filename] : [];

            foreach ($build_manifest as $manifest_src => $manifest_item) {
                if (!empty($block_js[0]) && strpos($block_js[0], $manifest_src) !== false) {
                    $assets = \Kucrut\Vite\register_asset(
                        $public_path,
                        "resources/blocks/{$block_slug}/script.ts",
                        [
                            'handle' => "{$block_slug}/js/frontend",
                        ]
                    );
                }

                if (!empty($block_css[0]) && strpos($block_css[0], $manifest_src) !== false) {
                    $assets = \Kucrut\Vite\register_asset(
                        $public_path,
                        "resources/blocks/{$block_slug}/style.css",
                        [
                            'handle' => "{$block_slug}/css/frontend",
                            'css-only' => true,
                        ]
                    );
                }
            }
        }
    }
}

/**
 * Add frontend block scripts handles to block metadata.
 *
 * @param array $metadata
 */
add_filter('block_type_metadata', function ($metadata) {
    if (strpos($metadata['name'], 'webentor/') !== false) {
        $block_slug = substr($metadata['name'], strrpos($metadata['name'], "/") + 1);

        // Check if scripts are registered in WP
        // Add metadata for FE block script
        if ($block_slug && wp_script_is("{$block_slug}/js/frontend", 'registered')) {
            $metadata['script'] = "{$block_slug}/js/frontend";
        }
        // Add metadata for block style
        if ($block_slug && wp_style_is("{$block_slug}/css/frontend", 'registered')) {
            $metadata['style'] = "{$block_slug}/css/frontend";
        }
    }

    return $metadata;
});

/**
 *  Register Native blocks
 */
add_action('init', function () {
    // Register all theme blocks assets
    $theme_block_assets_files = glob(get_template_directory() . '/resources/blocks/**/{script.ts,script.tsx,style.css}', GLOB_BRACE);
    if (!empty($theme_block_assets_files)) {
        register_frontend_blocks_assets($theme_block_assets_files, 'theme');
    }

    // Register all theme blocks that were found
    $theme_block_json_files = glob(get_template_directory() . '/resources/blocks/**/block.json');
    if (!empty($theme_block_json_files)) {
        foreach ($theme_block_json_files as $filename) {
            register_block_from_filename($filename);
        }
    }

    // Register all core blocks assets
    $core_block_assets_files = glob(WEBENTOR_CORE_RESOURCES_PATH . '/blocks/**/{script.ts,script.tsx,style.css}', GLOB_BRACE);
    if (!empty($core_block_assets_files)) {
        register_frontend_blocks_assets($core_block_assets_files, 'webentor-core');
    }

    // Register all core blocks that were found
    $core_block_json_files = glob(WEBENTOR_CORE_RESOURCES_PATH . '/blocks/**/block.json');
    if (!empty($core_block_json_files)) {
        foreach ($core_block_json_files as $filename) {
            register_block_from_filename($filename);
        }
    }
});

/**
 * Register block from filename, we need to modify render_callback and register scripts before actually registering block.
 *
 * @param  string $filename
 * @return void
 */
function register_block_from_filename($filename)
{
    $block_folder = dirname($filename);
    $block_options = [];

    // Get from folder path, slug would be the string after last occurence of "/"
    $block_slug = substr($block_folder, strrpos($block_folder, "/") + 1);

    // Let's have ability to skip block registration
    if (!apply_filters('webentor/register_block', true, $block_slug)) {
        return;
    }

    // Skip if block is already registerd, this is needed for child theme blocks override
    $registry = \WP_Block_Type_Registry::get_instance();

    if ($registry->get_registered("webentor/{$block_slug}")) {
        return;
    }

    // Only add the render callback if the block has a file called markdown.php in it's directory
    $block_options['render_callback'] = function ($attributes, $content, $block) {
        return render_block_blade($block);
    };

    $registered_block = register_block_type_from_metadata($block_folder, $block_options);

    // Add all custom blocks to allowed block types
    add_filter(
        'allowed_block_types_all',
        function ($block_list, $block_editor_context) use ($block_slug, $registered_block) {
            $should_add = false;

            // Check postType support and only register for defined post types
            if (isset($registered_block->supports['webentor']['postType']) && isset($block_editor_context->post->post_type) && in_array($block_editor_context->post->post_type, $registered_block->supports['webentor']['postType'])) {
                $should_add = true;
            } elseif (empty($registered_block->supports['webentor']['postType'])) {
                $should_add = true;
            }

            if ($should_add) {
                return is_array($block_list) ? array_merge($block_list, ["webentor/{$block_slug}"]) : ["webentor/{$block_slug}"];
            }

            return $block_list;
        },
        10,
        2
    );
}

/**
 * Render blade view from block object and also handle inner blocks.
 *
 * @param  \WP_Block $block
 * @param  \WP_Block $parent_block
 * @return string
 */
function render_block_blade($block, $parent_block = null)
{
    // We don't need to render blocks in admin or while saving, this will dramatically improve Gutenberg loading time
    if (is_admin() || wp_doing_ajax() || (!empty($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST' && defined('REST_REQUEST'))) {
        return;
    }

    if (apply_filters('webentor/skip_render_block_blade', false, $block)) {
        return;
    }

    $inner_blocks_html = '';

    // Handle inner blocks by recursively iterating through them and rendering them
    if (!empty($block->inner_blocks)) {
        foreach ($block->inner_blocks as $inner_block) {
            if (!empty($inner_block->inner_blocks)) {
                $inner_blocks_html .= render_block_blade($inner_block, $block);
            } else {
                $inner_blocks_html .= render_inner_block_blade($inner_block, $block);
            }
        }
    }

    // Create ID HTML attribute from anchor value
    $anchor = '';
    if (!empty($block->attributes['anchor'])) {
        $anchor = 'id="' . esc_attr($block->attributes['anchor']) . '" ';
    }

    $block_name = $block->parsed_block['blockName']; // in format "namespace/block-name"
    $block_slug = substr($block_name, strrpos($block_name, "/") + 1); // get only "block-name"

    $classes = prepareBlockClassesFromSettings($block->attributes, $block, $parent_block)['classes'];
    $classes_by_property = prepareBlockClassesFromSettings($block->attributes, $block, $parent_block)['classes_by_property'];
    $bg_classes = prepareBgBlockClassesFromSettings($block->attributes);

    $additional_data = [];

    // Set additional data for specific blocks
    if ($block_slug == 'e-tabs' && $block) {
        $additional_data['tabs_nav'] = get_tabs_nav_data($block);
    }

    // Let's have ability to modify classes and additional data for specific blocks
    $classes_by_property = apply_filters('webentor/block_classes_by_property', $classes_by_property, $block);
    $classes = apply_filters('webentor/block_classes', $classes, $block, $classes_by_property);
    $bg_classes = apply_filters('webentor/block_bg_classes', $bg_classes, $block);
    $custom_classes = apply_filters('webentor/block_custom_classes', [], $block, $classes_by_property);
    $additional_data = apply_filters('webentor/block_additional_data', $additional_data, $block);

    // Backward compatibility for old view.php config, where we defined path also for whole /resources folder
    $view_path = "{$block_slug}/view";
    if (!\Roots\view()->exists($view_path)) {
        $view_path = "blocks/{$block_slug}/view";
    }

    // Get the blade view and pass all necessary data
    // check if file exists
    if (\Roots\view()->exists($view_path)) {
        $block_content = \Roots\view($view_path, [
            'attributes' => $block->attributes,
            'innerBlocksContent' => $inner_blocks_html,
            'anchor' => $anchor,
            'block_classes' => $classes,
            'block_classes_by_property' => $classes_by_property,
            'bg_classes' => $bg_classes,
            'custom_classes' => $custom_classes,
            'block' => $block,
            'additional_data' => $additional_data,
        ]);

        /**
         * Filters the content of a single block.
         *
         * @since 5.0.0
         * @since 5.9.0 The `$instance` parameter was added.
         *
         * @param string   $block_content The block content.
         * @param array    $block         The full block, including name and attributes.
         * @param WP_Block $instance      The block instance.
         */
        $block_content = apply_filters('render_blade_block', $block_content, $block->parsed_block, $block);

        /**
         * Filters the content of a single block.
         *
         * The dynamic portion of the hook name, `$name`, refers to
         * the block name, e.g. "core/paragraph".
         *
         * @since 5.7.0
         * @since 5.9.0 The `$instance` parameter was added.
         *
         * @param string   $block_content The block content.
         * @param array    $block         The full block, including name and attributes.
         * @param WP_Block $instance      The block instance.
         */
        $block_content = apply_filters("render_blade_block_{$block->name}", $block_content, $block->parsed_block, $block);

        return $block_content;
    } else {
        return $block->render();
    }
}

/**
 * Render blade view from block object for children.
 *
 * @param  \WP_Block $block
 * @param  \WP_Block $parent_block
 * @return string
 */
function render_inner_block_blade($block, $parent_block = null)
{
    $is_custom = strpos($block->parsed_block['blockName'], 'webentor/') !== false;

    // Create ID HTML attribute from anchor value
    $anchor = '';
    if (!empty($block->parsed_block['anchor']) || !empty($block->parsed_block['attrs']['anchor'])) {
        $anchor = 'id="' . esc_attr($block->parsed_block['anchor'] ?? $block->parsed_block['attrs']['anchor']) . '" ';
    }

    $block_name = $block->parsed_block['blockName']; // in format "namespace/block-name"
    $block_slug = substr($block_name, strrpos($block_name, "/") + 1); // get only "block-name"

    $classes = prepareBlockClassesFromSettings($block->attributes, $block, $parent_block)['classes'];
    $classes_by_property = prepareBlockClassesFromSettings($block->attributes, $block, $parent_block)['classes_by_property'];
    $bg_classes = prepareBgBlockClassesFromSettings($block->attributes);

    // Let's have ability to modify classes and additional data for specific blocks
    $classes_by_property = apply_filters('webentor/block_classes_by_property', $classes_by_property, $block);
    $classes = apply_filters('webentor/block_classes', $classes, $block, $classes_by_property);
    $bg_classes = apply_filters('webentor/block_bg_classes', $bg_classes, $block);
    $custom_classes = apply_filters('webentor/block_custom_classes', [], $block, $classes_by_property);
    $additional_data = apply_filters('webentor/block_additional_data', [], $block);

    // Backward compatibility for old view.php config, where we defined path also for whole /resources folder
    $view_path = "{$block_slug}/view";
    if (!\Roots\view()->exists($view_path)) {
        $view_path = "blocks/{$block_slug}/view";
    }

    if ($is_custom && \Roots\view()->exists($view_path)) {
        $block_content = \Roots\view($view_path, [
            'attributes' => $block->attributes,
            'anchor' => $anchor,
            'block_classes' => $classes,
            'block_classes_by_property' => $classes_by_property,
            'bg_classes' => $bg_classes,
            'custom_classes' => $custom_classes,
            'block' => $block,
            'additional_data' => $additional_data,
        ]);

        /**
         * Filters the content of a single block.
         *
         * @since 5.0.0
         * @since 5.9.0 The `$instance` parameter was added.
         *
         * @param string   $block_content The block content.
         * @param array    $block         The full block, including name and attributes.
         * @param WP_Block $instance      The block instance.
         */
        $block_content = apply_filters('render_blade_block', $block_content, $block->parsed_block, $block);

        /**
         * Filters the content of a single block.
         *
         * The dynamic portion of the hook name, `$name`, refers to
         * the block name, e.g. "core/paragraph".
         *
         * @since 5.7.0
         * @since 5.9.0 The `$instance` parameter was added.
         *
         * @param string   $block_content The block content.
         * @param array    $block         The full block, including name and attributes.
         * @param WP_Block $instance      The block instance.
         */
        $block_content = apply_filters("render_blade_block_{$block->name}", $block_content, $block->parsed_block, $block);

        return $block_content;
    } else {
        return $block->render();
    }
}

/**
 * Build Tabs navigation based on child blocks titles.
 *
 * @param \WP_Block $block
 *
 * @return array
 */
function get_tabs_nav_data(\WP_Block $block)
{
    $tabs_nav = [];

    if (!isset($block->inner_blocks) || empty($block->inner_blocks)) {
        return $tabs_nav;
    }

    foreach ($block->inner_blocks as $child_block) {
        $attributes = $child_block->attributes;

        if (isset($attributes['title']) && !empty($attributes['title'])) {
            $tabs_nav[] = [
                'title' => $attributes['title'],
                'id' => Str::slug($attributes['title']),
            ];
        }
    }

    return $tabs_nav;
}

/**
 * Add custom categories to Gutenberg
 */
add_filter('block_categories_all', function ($categories) {
    // Add a new category to first place of list
    array_unshift(
        $categories,
        [
            'slug'  => 'webentor-blocks',
            'title' => __('Webentor Blocks', 'webentor')
        ],
        [
            'slug'  => 'webentor-elements',
            'title' => __('Webentor Elements', 'webentor')
        ],
        [
            'slug'  => 'webentor-layout',
            'title' => __('Webentor Layout', 'webentor')
        ]
    );

    return $categories;
});

/**
 * Remove core block patterns
 */
add_action('init', function () {
    remove_theme_support('core-block-patterns');

    if (!function_exists('unregister_block_pattern')) {
        return;
    }
    unregister_block_pattern('core/query-grid-posts');
    unregister_block_pattern('core/query-large-title-posts');
    unregister_block_pattern('core/query-medium-posts');
    unregister_block_pattern('core/query-offset-posts');
    unregister_block_pattern('core/query-small-posts');
    unregister_block_pattern('core/query-standard-posts');
});

/**
 * Add custom patterns categories
 */
add_action('init', function () {
    register_block_pattern_category(
        'webentor/components',
        ['label' => __('Components', 'webentor')]
    );
    register_block_pattern_category(
        'webentor/sections',
        ['label' => __('Sections', 'webentor')]
    );
});


/**
 * Filters the content of a 'core/template-part' block.
 *
 * @phpstan-param array{attrs: array<string, mixed>} $block
 *
 * @param  string $block_content The block content.
 * @param  array  $block         The full block, including name and attributes.
 * @return string
 */
add_filter('render_block_core/template-part', function ($block_content, $block) {
    $skip_wrapper = $block['attrs']['skipWrapper'] ?? false;

    /*
     * Allow passing "skipWrapper": true with template part block to remove the
     * the wrapper automatically added by core. This is useful to avoid extra
     * wrappers, as template part blocks do not currently support an `ID`
     * attribute. This also allows the block to more closely mimic the
     * `get_template_part()` function.
     */
    if (true === $skip_wrapper) {
        $proc = new \WP_HTML_Tag_Processor($block_content);

        if (true === $proc->next_tag()) {
            $block_content = trim($block_content);

            // Remove opening tag.
            $block_content = substr(
                $block_content,
                strpos($block_content, '>') + 1
            );

            // Remove closing tag.
            $block_content = substr(
                $block_content,
                0,
                strlen($block_content) - strlen("</{$proc->get_tag()}>"),
            );

            $block_content = trim($block_content);
        }
    }

    return $block_content;
}, 10, 2);

/**
 * Check if the given block has visibility settings from plugin Block Visibility.
 *
 * @since 1.0.0
 *
 * @param  string $block_content The block frontend output.
 * @param  array  $block         The block info and attributes.
 * @return mixed  Return either the $block_content or nothing depending on visibility settings.
 */
add_filter('render_blade_block', function ($block_content, $block) {
    if (!function_exists('\BlockVisibility\Frontend\is_block_type_disabled')) {
        return $block_content;
    }

    // Get the visibility settings.
    $attributes = $block['attrs']['blockVisibility'] ?? null;

    // Return early if the block does not have visibility settings.
    if (! $attributes) {
        return $block_content;
    }

    // Get the plugin settings.
    $settings = get_option('block_visibility_settings');

    // Return early if visibility control is disabled for this block type.
    if (\BlockVisibility\Frontend\is_block_type_disabled($settings, $block)) {
        return $block_content;
    }

    // Start with the hide block test. If it doesn't pass, the block is hidden.
    if (! \BlockVisibility\Frontend\VisibilityTests\hide_block_test($settings, $attributes)) {
        return '';
    }

    // If the block is visible, add custom classes as needed.
    if (\BlockVisibility\Frontend\is_visible($settings, $attributes)) {
        $content_classes = \BlockVisibility\Frontend\add_custom_classes($settings, $attributes);

        if (! empty($content_classes)) {
            $block_content = \BlockVisibility\Frontend\append_content_classes($block_content, $content_classes);
        }

        return $block_content;
    } else {
        return '';
    }
}, 10, 3);
