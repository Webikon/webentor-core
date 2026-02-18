<?php

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
        $block_classes = [
            \Webentor\Core\get_classes_by_property($classes_by_property, ['className']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['backgroundColor']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['textColor']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['spacing']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['display', 'height']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['display', 'min-height']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['border']),
            \Webentor\Core\get_classes_by_property($classes_by_property, ['borderRadius']),
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
 * @return string
 */
add_filter('webentor/block_custom_classes', function ($custom_classes, $block, $classes_by_property) {
    if ($block->name === 'webentor/l-section') {
        $custom_classes = [
            \Webentor\Core\get_classes_by_property($classes_by_property, ['display', 'display']),
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
}, 10, 3);
