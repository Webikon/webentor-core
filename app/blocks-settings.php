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
 * @param  \WP_Block $block
 * @return string
 */
function prepareBgBlockClassesFromSettings($attributes, $block = null)
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
 * @param  \WP_Block $block
 * @return string
 */
function prepareBlockClassesFromSettings($attributes, $block = null)
{

    // Create classes attribute allowing for custom "className" and "align" values.
    $classes = '';
    if (!empty($attributes['className'])) {
        $classes .= ' ' . $attributes['className'];
    }

    if (!empty($attributes['align'])) {
        $classes .= ' align' . $attributes['align'];
    }
    if (!empty($attributes['backgroundColor'])) {
        $classes .= ' has-' . $attributes['backgroundColor'] . '-background-color bg-' . $attributes['backgroundColor']; // add WP has-*-background-color clas, but also Tailwind bg-* so bg with image (texture) can be applied
    }
    if (!empty($attributes['textColor'])) {
        $classes .= ' has-' . $attributes['textColor'] . '-color text-' . $attributes['textColor'];
    }

    if (!empty($attributes['spacing'])) {
        foreach ($attributes['spacing'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
            }
        }
    }

    if (!empty($attributes['display'])) {
        foreach ($attributes['display'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        if (!empty($attributes['slider']['enabled']['value'][$breakpoint_name])) {
                            // Skip display classes generation if slider is enabled
                            continue;
                        }

                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
            }
        }
    }

    if (!empty($attributes['grid'])) {
        foreach ($attributes['grid'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value) && !empty($attributes['display']['display']['value'][$breakpoint_name]) && $attributes['display']['display']['value'][$breakpoint_name] === 'grid') {
                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
            }
        }
    }

    if (!empty($attributes['gridItem'])) {
        foreach ($attributes['gridItem'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value) && !empty($attributes['display']['display']['value'][$breakpoint_name]) && $attributes['display']['display']['value'][$breakpoint_name] === 'grid') {
                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
            }
        }
    }

    if (!empty($attributes['flexbox'])) {
        foreach ($attributes['flexbox'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
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
                    }
                }
            }
        }
    }

    if (!empty($attributes['flexboxItem'])) {
        foreach ($attributes['flexboxItem'] as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
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

                        // Transform to Tailwind classes
                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
            }
        }
    }

    return $classes;
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
