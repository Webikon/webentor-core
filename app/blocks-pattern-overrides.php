<?php

namespace Webentor\Core;

/**
 * Block Bindings / Pattern Overrides support for Webentor blocks.
 *
 * WP 7.0 made Pattern Overrides generic: an attribute listed in
 * `block_bindings_supported_attributes` becomes overridable per synced-pattern
 * instance, and bindable to any other registered source (post meta, term data,
 * custom sources). Everything else follows from that list — the "Enable
 * overrides" button, the editor read/write plumbing, and the server-side
 * attribute substitution in WP_Block::render().
 *
 * @see https://make.wordpress.org/core/2026/03/16/pattern-overrides-in-wp-7-0-support-for-custom-blocks/
 */

/**
 * Attributes each Webentor block exposes to Block Bindings.
 *
 * Only content attributes belong here.
 *
 * Bindings are keyed by top-level attribute name — WP has no sub-path support —
 * so an object attribute is always overridden as a whole. For `e-button` that
 * means an instance override stores the full `button` object, including the
 * design props (variant/size/icon). Design changes made in the pattern original
 * afterwards no longer reach that instance. Splitting `button` into flat
 * attributes would avoid this, but would change the attribute contract every
 * consumer theme's Blade views and filters build on.
 *
 * @return array<string, string[]> Block name => supported attribute names.
 */
function get_block_bindings_supported_attributes_map()
{
    /**
     * Filters which block attributes Webentor exposes to Block Bindings.
     *
     * @param array<string, string[]> $map Block name => supported attribute names.
     */
    return apply_filters('webentor/block_bindings_supported_attributes', [
        'webentor/e-accordion' => ['title'],
        'webentor/e-button' => ['button'],
        'webentor/e-gallery' => ['images'],
        'webentor/e-icon-picker' => ['icon'],
        'webentor/e-image' => ['imgId', 'link'],
        'webentor/e-svg' => ['imgId'],
        'webentor/e-tab-container' => ['title'],
    ]);
}

/**
 * Opt Webentor blocks into Block Bindings / Pattern Overrides.
 *
 * @param  string[] $attributes Attributes already supported for this block type.
 * @param  string   $block_type Block name.
 * @return string[]
 */
add_filter('block_bindings_supported_attributes', function ($attributes, $block_type) {
    $map = get_block_bindings_supported_attributes_map();

    if (empty($map[$block_type])) {
        return $attributes;
    }

    return array_values(array_unique(array_merge((array) $attributes, $map[$block_type])));
}, 10, 2);
