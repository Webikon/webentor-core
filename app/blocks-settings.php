<?php

namespace Webentor\Core;

/**
 * If some defaults are needed for block attributes, they must be set via this hook.
 * Its because we are adding custom attributes via hook and not directly in block.json
 *
 * @param array $settings
 * @param array $metadata
 */
add_filter('block_type_metadata_settings', function ($settings, $metadata) {
    // if (!empty($metadata['supports']['webentor']['link'])) {
    //     $settings['attributes']['blockLink'] = [
    //         'type' => 'object',
    //         'default' => []
    //     ];
    // }

    // if (!empty($metadata['supports']['anchor'])) {
    //     $settings['attributes']['anchor'] = [
    //         'type' => 'string',
    //         'default' => '',
    //     ];
    // }

    if (!empty($metadata['supports']['webentor']['display'])) {
        // Check if actual "display" property support is true
        $display_property_support = (isset($settings['supports']['webentor']['display']) && $settings['supports']['webentor']['display'] === true)
            || (isset($settings['supports']['webentor']['display']['display']) && $settings['supports']['webentor']['display']['display'] === true);

        $display_default = $settings['attributes']['display']['default'] ?? [];

        $settings['attributes']['display'] = [
            'type' => 'object',
            'default' => [
                ...$display_default ?? [],
                'display' => [
                    'value' => [
                        // Default display property must be FLEX!
                        ...$display_property_support ? ['basic' => 'flex'] : [],
                        ...$display_default['display']['value'] ?? []
                    ]
                ],
            ],
        ];
    }

    if ($metadata['name'] === 'webentor/e-slider') {
        $settings['attributes']['slider'] = [
            'type' => 'object',
            'default' => [
                'enabled' => [
                    'value' => [
                        'basic' => true,
                        'sm' => true,
                        'md' => true,
                        'lg' => true,
                        'xl' => true,
                        '2xl' => true,
                    ]
                ],
                'centeredSlides' => [
                    'value' => [
                        'basic' => false,
                        'sm' => false,
                        'md' => false,
                        'lg' => false,
                        'xl' => false,
                        '2xl' => false,
                    ]
                ],
                'slidesPerView' => [
                    'value' => [
                        'basic' => '1',
                        'sm' => '2',
                        'md' => '3',
                        'lg' => '3',
                        'xl' => '3',
                        '2xl' => '3',
                    ]
                ],
                'spaceBetween' => [
                    'value' => [
                        'basic' => '32',
                        'sm' => '32',
                        'md' => '32',
                        'lg' => '32',
                        'xl' => '32',
                        '2xl' => '32',
                    ]
                ],
            ]
        ];
    }

    // if (!empty($metadata['supports']['webentor']['spacing'])) {
    //     $settings['attributes']['spacing'] = [
    //         'type' => 'object',
    //         'default' => [
    //             'margin-top' => [
    //                 'value' => ''
    //             ],
    //             'margin-right' => [
    //                 'value' => ''
    //             ],
    //             'margin-bottom' => [
    //                 'value' => ''
    //             ],
    //             'margin-left' => [
    //                 'value' => ''
    //             ],
    //             'padding-top' => [
    //                 'value' => ''
    //             ],
    //             'padding-right' => [
    //                 'value' => ''
    //             ],
    //             'padding-bottom' => [
    //                 'value' => ''
    //             ],
    //             'padding-left' => [
    //                 'value' => ''
    //             ],
    //         ],
    //     ];
    // }

    // if (!empty($metadata['supports']['webentor']['flexbox'])) {
    //     $settings['attributes']['flexbox'] = [
    //         'type' => 'object',
    //         'default' => [
    //             'gap' => [
    //                 'value' => [
    //                     'basic' => 'gap-0'
    //                 ]
    //             ],
    //             'gap-x' => [
    //                 'value' => ''
    //             ],
    //             'gap-y' => [
    //                 'value' => ''
    //             ],
    //             'flex-direction' => [
    //                 'value' => ''
    //             ],
    //             'flex-wrap' => [
    //                 'value' => ''
    //             ],
    //             'justify-content' => [
    //                 'value' => ''
    //             ],
    //             'align-items' => [
    //                 'value' => ''
    //             ],
    //             'align-content' => [
    //                 'value' => ''
    //             ],
    //         ],
    //     ];
    // }

    // if (!empty($metadata['supports']['webentor']['flexboxItem'])) {
    //     $settings['attributes']['flexboxItem'] = [
    //         'type' => 'object',
    //         'default' => [
    //             'flex-grow' => [
    //                 'value' => ''
    //             ],
    //             'flex-shrink' => [
    //                 'value' => ''
    //             ],
    //             'flex-basis' => [
    //                 'value' => ''
    //             ],
    //             'order' => [
    //                 'value' => ''
    //             ],
    //         ],
    //     ];
    // }

    $settings = apply_filters('webentor/block_type_metadata_settings', $settings, $metadata);

    return $settings;
}, 10, 2);

/**
 *  Prepare background block (and Tailwind) classes from block attributes
 *
 * @param  array     $attributes
 * @param  \WP_Block $parent_block
 * @return string
 */
function prepareBgBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    if (!empty($attributes['backgroundColor'])) {
        $classes .= ' has-' . $attributes['backgroundColor'] . '-background-color bg-' . $attributes['backgroundColor']; // add WP has-*-background-color clas, but also Tailwind bg-* so bg with image (texture) can be applied
    }

    return $classes;
}

/**
 *  Prepare block (and Tailwind) classes from block attributes
 *
 * @param  array     $attributes
 * @param  \WP_Block $parent_block
 * @return array ['classes' => string, 'classes_by_property' => array]
 */
function prepareBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes_by_prop = [
        'className' => [],
        'align' => [],
        'backgroundColor' => [],
        'textColor' => [],
        'spacing' => [],
        'display' => [],
        'grid' => [],
        'gridItem' => [],
        'flexbox' => [],
        'flexboxItem' => [],
        'border' => [],
        'borderRadius' => [],
    ];

    // Create classes attribute allowing for custom "className" and "align" values.
    $classes = '';
    if (!empty($attributes['className'])) {
        $classname_classes = ' ' . $attributes['className'];
        $classes_by_prop['className'] = $classname_classes;
        $classes .= $classname_classes;
    }

    if (!empty($attributes['align'])) {
        $align_classes = ' align' . $attributes['align'];
        $classes_by_prop['align'] = $align_classes;
        $classes .= $align_classes;
    }
    if (!empty($attributes['backgroundColor'])) {
        $background_color_classes = ' has-' . $attributes['backgroundColor'] . '-background-color bg-' . $attributes['backgroundColor']; // add WP has-*-background-color clas, but also Tailwind bg-* so bg with image (texture) can be applied
        $classes_by_prop['backgroundColor'] = $background_color_classes;
        $classes .= $background_color_classes;
    }
    if (!empty($attributes['textColor'])) {
        $text_color_classes = ' has-' . $attributes['textColor'] . '-color text-' . $attributes['textColor'];
        $classes_by_prop['textColor'] = $text_color_classes;
        $classes .= $text_color_classes;
    }

    if (!empty($block->block_type->supports['webentor']['spacing'])) {
        $spacing_classes = prepareSpacingBlockClassesFromSettings($attributes, $block, $parent_block);
        $classes .= $spacing_classes['classes'];
        $classes_by_prop = array_merge($classes_by_prop, $spacing_classes['classes_by_property']);
    }

    if (!empty($block->block_type->supports['webentor']['display'])) {
        $display_classes = prepareDisplayBlockClassesFromSettings($attributes, $block, $parent_block);
        $classes .= $display_classes['classes'];
        $classes_by_prop = array_merge($classes_by_prop, $display_classes['classes_by_property']);
    }

    if (!empty($block->block_type->supports['webentor']['grid'])) {
        $grid_classes = prepareGridBlockClassesFromSettings($attributes, $block, $parent_block);
        $classes .= $grid_classes['classes'];
        $classes_by_prop = array_merge($classes_by_prop, $grid_classes['classes_by_property']);
    }

    if (!empty($block->block_type->supports['webentor']['gridItem'])) {
        $grid_item_classes = prepareGridItemBlockClassesFromSettings($attributes, $block, $parent_block);
        $classes .= $grid_item_classes['classes'];
        $classes_by_prop = array_merge($classes_by_prop, $grid_item_classes['classes_by_property']);
    }

    if (!empty($block->block_type->supports['webentor']['flexbox'])) {
        $flexbox_classes = prepareFlexboxBlockClassesFromSettings($attributes, $block, $parent_block);
        $classes .= $flexbox_classes['classes'];
        $classes_by_prop = array_merge($classes_by_prop, $flexbox_classes['classes_by_property']);
    }

    if (!empty($block->block_type->supports['webentor']['flexboxItem'])) {
        $flexbox_item_classes = prepareFlexboxItemBlockClassesFromSettings($attributes, $block, $parent_block);
        $classes .= $flexbox_item_classes['classes'];
        $classes_by_prop = array_merge($classes_by_prop, $flexbox_item_classes['classes_by_property']);
    }

    if (!empty($block->block_type->supports['webentor']['border'])) {
        $border_classes = prepareBorderBlockClassesFromSettings($attributes, $block, $parent_block);
        $classes .= $border_classes['classes'];
        $classes_by_prop = array_merge($classes_by_prop, $border_classes['classes_by_property']);
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

function prepareSpacingBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'spacing' => [],
    ];

    if (!empty($attributes['spacing'])) {
        foreach ($attributes['spacing'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                $spacing_classes = '';
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                        $spacing_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
                $classes_by_prop['spacing'][$property_name] = $spacing_classes;
            }
        }
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

function prepareDisplayBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'display' => [],
    ];

    if (!empty($attributes['display'])) {
        foreach ($attributes['display'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                $display_classes = '';
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                        $display_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
                $classes_by_prop['display'][$property_name] = $display_classes;
            }
        }
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

function prepareGridBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'grid' => [],
    ];

    if (!empty($attributes['grid'])) {
        foreach ($attributes['grid'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                $grid_classes = '';
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value) && !empty($attributes['display']['display']['value'][$breakpoint_name]) && $attributes['display']['display']['value'][$breakpoint_name] === 'grid') {
                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                        $grid_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
                $classes_by_prop['grid'][$property_name] = $grid_classes;
            }
        }
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

function prepareGridItemBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'gridItem' => [],
    ];

    if (!empty($attributes['gridItem'])) {
        foreach ($attributes['gridItem'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                $grid_item_classes = '';
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    $parent_display_value = $parent_block->attributes['display']['display']['value'][$breakpoint_name] ?? 'flex';

                    if (!empty($breakpoint_property_value) && !empty($parent_display_value) && $parent_display_value === 'grid') {
                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                        $grid_item_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
                $classes_by_prop['gridItem'][$property_name] = $grid_item_classes;
            }
        }
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

function prepareFlexboxBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'flexbox' => [],
    ];

    if (!empty($attributes['flexbox'])) {
        foreach ($attributes['flexbox'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                $flexbox_classes = '';
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        if (!empty($attributes['slider']['enabled']['value'][$breakpoint_name])) {
                            // Skip display classes generation if slider is enabled
                            continue;
                        }

                        if (empty($attributes['display']['display']['value'][$breakpoint_name]) || $attributes['display']['display']['value'][$breakpoint_name] !== 'flex') {
                            // Skip when display is not flex
                            continue;
                        }

                        // TODO: This solution is not working with TW PurgeCSS so these classes are not generated...
                        // Get all next breakpoints for which we're gonna check if slider is enabled.
                        // If slider is enabled on next breakpoint, we don't want custom classes to be applied as "min-width" so we'll also add "max-width" media query,
                        // e.g. "md:max-lg:justify-center"
                        //
                        // Otherwise, we'll just add "min-width" media query classes, e.g. "md:justify-center"
                        // $next_breakpoints = get_next_breakpoint_names($breakpoint_name);
                        // $min_width_bp = $breakpoint_name;
                        // $max_width_bp = false;
                        // foreach ($next_breakpoints as $key => $next_breakpoint) {
                        //     // Transform to Tailwind classes
                        //     if (!empty($attributes['slider']['enabled']['value'][$next_breakpoint])) {
                        //         $max_width_bp = $next_breakpoint;
                        //     }
                        // }

                        // if ($max_width_bp) {
                        //     $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$min_width_bp}:max-{$max_width_bp}:" ;
                        // } else {
                        //     $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$min_width_bp}:";
                        // }

                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                        $flexbox_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
                $classes_by_prop['flexbox'][$property_name] = $flexbox_classes;
            }
        }
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

function prepareFlexboxItemBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'flexboxItem' => [],
    ];

    if (!empty($attributes['flexboxItem'])) {
        foreach ($attributes['flexboxItem'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                $flexbox_item_classes = '';
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        if (!empty($attributes['slider']['enabled']['value'][$breakpoint_name])) {
                            // Skip display classes generation if slider is enabled
                            continue;
                        }

                        $parent_display_value = $parent_block ? ($parent_block->attributes['display']['display']['value'][$breakpoint_name] ?? 'flex') : 'flex';

                        if (empty($parent_display_value) || $parent_display_value !== 'flex') {
                            // Skip when display is not flex
                            continue;
                        }

                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                        $flexbox_item_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
                $classes_by_prop['flexboxItem'][$property_name] = $flexbox_item_classes;
            }
        }
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

function prepareBorderBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'border' => [],
        'borderRadius' => [],
    ];

    if (!empty($attributes['border'])) {
        $border_mapping = [
            'top' => 'border-t',
            'right' => 'border-r',
            'bottom' => 'border-b',
            'left' => 'border-l'
        ];

        $border_radius_mapping = [
            'topLeft' => 'rounded-tl',
            'topRight' => 'rounded-tr',
            'bottomRight' => 'rounded-br',
            'bottomLeft' => 'rounded-bl'
        ];

        foreach ($attributes['border'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                $border_classes = '';
                $border_radius_classes = '';
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        foreach ($breakpoint_property_value as $value_side => $value) {
                            // Transform to Tailwind classes
                            $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";

                            if (!empty($value)) {
                                if ($value_side === 'linked') {
                                    continue;
                                }

                                if ($property_name === 'border') {
                                    if (!empty($value['width'])) {
                                        $class = ' ' . $tw_breakpoint . $border_mapping[$value_side] . '-' . $value['width'];
                                        $classes .= $class;
                                        $border_classes .= $class;
                                    }

                                    if (!empty($value['color'])) {
                                        $class = ' ' . $tw_breakpoint . $border_mapping[$value_side] . '-' . $value['color'];
                                        $classes .= $class;
                                        $border_classes .= $class;
                                    }

                                    if (!empty($value['style'])) {
                                        $class = ' ' . $tw_breakpoint . $border_mapping[$value_side] . '-' . $value['style'];
                                        $classes .= $class;
                                        $border_classes .= $class;
                                    }
                                } elseif ($property_name === 'borderRadius') {
                                    $class = ' ' . $tw_breakpoint . $border_radius_mapping[$value_side] . '-' . $value;
                                    $classes .= $class;
                                    $border_radius_classes .= $class;
                                }
                            }
                        }
                    }
                }
                if ($property_name === 'border') {
                    $classes_by_prop['border'] = $border_classes;
                } elseif ($property_name === 'borderRadius') {
                    $classes_by_prop['borderRadius'] = $border_radius_classes;
                }
            }
        }
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

/**
 * Add Custom Typography classes to Post Title block
 *
 * @param  string $block_content
 * @param  array  $block
 * @return string
 */
add_filter('render_block_core/post-title', function ($block_content, $block) {
    if (!empty($block['attrs']['customTypography'])) {
        $block_content = str_replace('wp-block-post-title', 'wp-block-post-title ' . $block['attrs']['customTypography'], $block_content);
    }

    return $block_content;
}, 10, 2);
