<?php

if (!function_exists('webentor_l_section_split_display_classes')) {
    /**
     * Partition section display utility classes into hide tokens
     * (`hidden` / `{bp}:hidden`) and the rest.
     *
     * The section splits responsive classes between the <section> wrapper and
     * the inner container, so `display:flex` lands on the inner container. But
     * `display:none` must hide the WHOLE section — otherwise the background
     * image + overlay still render — so hide tokens go on the wrapper while the
     * remaining display values (flex/grid/block) stay on the inner container.
     *
     * @param string $display_classes Space-separated display classes.
     * @return array{0: string, 1: string} [hide classes, visible classes]
     */
    function webentor_l_section_split_display_classes(string $display_classes): array
    {
        $hide = [];
        $visible = [];

        foreach (preg_split('/\s+/', trim($display_classes)) ?: [] as $token) {
            if ($token === '') {
                continue;
            }

            if ($token === 'hidden' || str_ends_with($token, ':hidden')) {
                $hide[] = $token;
            } else {
                $visible[] = $token;
            }
        }

        return [implode(' ', $hide), implode(' ', $visible)];
    }
}

/**
 * Customize block classes for Section block.
 * We need to split classes for block and its container as flexbox/grid classes needs to be applied to the container instead.
 *
 * @param string $classes
 * @param \WP_Block $block
 * @param array $classes_by_property
 * @return string
 */
add_filter('webentor/block_classes', function ($classes, $block, $classes_by_property) {
    if ($block->name === 'webentor/l-section') {
        // Hide tokens (display:none) must apply to the <section> wrapper so the
        // whole section — including background image and overlay — is hidden.
        [$hide_classes] = webentor_l_section_split_display_classes(
            \Webentor\Core\get_classes_by_property($classes_by_property, ['layout', 'display']),
        );

        $block_classes = [
            \Webentor\Core\get_classes_by_property($classes_by_property, ['className']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['backgroundColor']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['textColor']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['spacing']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['sizing', 'height']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['sizing', 'min-height']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['border']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['borderRadius']),
            $hide_classes,
        ];
        $block_classes = implode(' ', $block_classes);

        return $block_classes;
    }

    return $classes;
}, 10, 3);

/**
 * Add custom classes to Section block which would be used as container classes.
 *
 * @param string $custom_classes
 * @param \WP_Block $block
 * @param array $classes_by_property
 * @param array $all_classes_by_property
 * @return string
 */
add_filter('webentor/block_custom_classes', function ($custom_classes, $block, $classes_by_property, $all_classes_by_property) {
    if ($block->name === 'webentor/l-section') {
        // Keep only the visible display values (flex/grid/block) on the inner
        // container; hide tokens are routed to the wrapper (see block_classes).
        [, $visible_display] = webentor_l_section_split_display_classes(
            \Webentor\Core\get_classes_by_property($classes_by_property, ['layout', 'display']),
        );

        $custom_classes = [
            $visible_display,
            \Webentor\Core\get_classes_by_property($classes_by_property, ['flexbox']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['grid']),
        ];
        $custom_classes = implode(' ', $custom_classes);

        // Add container class that can be filtered by themes
        $container_class = apply_filters('webentor/l-section/container_classes', 'container', $block);
        $custom_classes .= ' ' . $container_class;

        return $custom_classes;
    }

    return $custom_classes;
}, 10, 4);
