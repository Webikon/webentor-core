<?php

namespace Webentor\Core;

/**
 * PHP-side Settings Registry.
 * Mirrors the JS SettingsRegistry pattern: each setting type registers a handler,
 * and prepareBlockClassesFromSettings iterates over all registered handlers.
 *
 * v2 adds dual reading: handlers check both v2 attribute keys (layout, sizing, flexItem)
 * and v1 keys (display, flexboxItem) for backward compatibility during migration.
 */
class SettingsRegistry
{
    /** @var array<string, array{generator: callable, attributeSchema: array}> */
    private static array $handlers = [];

    /**
     * Register a setting handler.
     *
     * @param string   $name            Setting identifier (e.g. 'spacing', 'layout')
     * @param callable $classGenerator  function(array $attributes, $block, $parentBlock): array{classes: string, classes_by_property: array}
     * @param array    $attributeSchema Optional attribute schema for auto-registration
     */
    public static function register(string $name, callable $classGenerator, array $attributeSchema = []): void
    {
        self::$handlers[$name] = [
            'generator' => $classGenerator,
            'attributeSchema' => $attributeSchema,
        ];
    }

    /**
     * Generate classes for all registered settings that the block supports.
     * Normalizes support keys before checking (v1 display → v2 layout + sizing).
     *
     * @param  array     $attributes
     * @param  \WP_Block $block
     * @param  \WP_Block $parentBlock
     * @return array{classes: string, classes_by_property: array}
     */
    public static function generateClasses(array $attributes, $block = null, $parentBlock = null): array
    {
        $classes = '';
        $classes_by_prop = [];

        // Normalize support keys for v2 resolution
        $webentorSupports = resolve_support_keys($block?->block_type?->supports['webentor'] ?? []);

        foreach (self::$handlers as $name => $handler) {
            $supportKey = self::getSupportKeyForHandler($name);

            // Check if the block supports this setting (any of the support keys)
            $isSupported = false;
            foreach ((array) $supportKey as $key) {
                if (!empty($webentorSupports[$key])) {
                    $isSupported = true;
                    break;
                }
            }

            if (!$isSupported) {
                continue;
            }

            $result = ($handler['generator'])($attributes, $block, $parentBlock);
            $classes .= $result['classes'];
            $classes_by_prop = array_merge($classes_by_prop, $result['classes_by_property']);
        }

        return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
    }

    /**
     * Map handler names to their block support keys.
     * Updated for v2: includes both old and new key names.
     */
    private static function getSupportKeyForHandler(string $name): array
    {
        $map = [
            'spacing'     => ['spacing'],
            'layout'      => ['layout', 'display'],
            'sizing'      => ['sizing', 'display'],
            'grid'        => ['grid'],
            'gridItem'    => ['gridItem'],
            'flexbox'     => ['flexbox'],
            'flexItem'    => ['flexItem', 'flexboxItem'],
            'border'      => ['border', 'borderRadius'],
            'presets'     => ['layout', 'display'],
        ];

        return $map[$name] ?? [$name];
    }

    /** @return array<string, array> */
    public static function getAll(): array
    {
        return self::$handlers;
    }
}

/**
 * Normalize v1 support keys to v2 format.
 * Mirrors the JS resolveSupportKeys() function.
 *
 * Mapping:
 * - display: true        → layout: true + sizing: true
 * - display: { display } → layout: { display }
 * - display: { height }  → sizing: { height }
 * - flexboxItem          → flexItem
 *
 * @param  array|null $webentor_supports
 * @return array
 */
function resolve_support_keys($webentor_supports): array
{
    if (empty($webentor_supports)) {
        return [];
    }

    $resolved = $webentor_supports;

    $layout_subkeys = ['display'];
    $sizing_subkeys = ['height', 'minHeight', 'maxHeight', 'width', 'minWidth', 'maxWidth'];

    // Expand display → layout + sizing
    if (isset($resolved['display'])) {
        $display_support = $resolved['display'];

        if ($display_support === true) {
            if (!isset($resolved['layout'])) $resolved['layout'] = true;
            if (!isset($resolved['sizing'])) $resolved['sizing'] = true;
        } elseif (is_array($display_support)) {
            $layout_sub = [];
            $sizing_sub = [];

            foreach ($display_support as $key => $value) {
                if (in_array($key, $layout_subkeys, true)) {
                    $layout_sub[$key] = $value;
                } elseif (in_array($key, $sizing_subkeys, true)) {
                    $sizing_sub[$key] = $value;
                }
            }

            if (!empty($layout_sub) && !isset($resolved['layout'])) {
                $resolved['layout'] = $layout_sub;
            }
            if (!empty($sizing_sub) && !isset($resolved['sizing'])) {
                $resolved['sizing'] = $sizing_sub;
            }
        }
    }

    // Rename flexboxItem → flexItem
    if (isset($resolved['flexboxItem']) && !isset($resolved['flexItem'])) {
        $resolved['flexItem'] = $resolved['flexboxItem'];
    }

    return $resolved;
}

/**
 * If some defaults are needed for block attributes, they must be set via this hook.
 * Its because we are adding custom attributes via hook and not directly in block.json
 *
 * Updated for v2: sets defaults on both layout and display attribute keys.
 *
 * @param array $settings
 * @param array $metadata
 */
add_filter('block_type_metadata_settings', function ($settings, $metadata) {
    $webentor_supports = resolve_support_keys($metadata['supports']['webentor'] ?? []);

    // Set display/layout defaults when supported
    if (!empty($webentor_supports['layout']) || !empty($webentor_supports['display'])) {
        // Check if actual "display" property support is true
        $display_property_support = ($webentor_supports['layout'] ?? false) === true
            || ($webentor_supports['layout']['display'] ?? false) === true
            || ($webentor_supports['display'] ?? false) === true
            || ($webentor_supports['display']['display'] ?? false) === true;

        $display_default = $settings['attributes']['display']['default'] ?? [];
        $layout_default = $settings['attributes']['layout']['default'] ?? [];

        $default_value = [
            'display' => [
                'value' => [
                    // Default display property must be FLEX!
                    ...$display_property_support ? ['basic' => 'flex'] : [],
                    ...$display_default['display']['value'] ?? [],
                    ...$layout_default['display']['value'] ?? [],
                ]
            ],
        ];

        // Set on v2 key
        $settings['attributes']['layout'] = [
            'type' => 'object',
            'default' => [
                ...$layout_default,
                ...$default_value,
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
 *  Prepare block (and Tailwind) classes from block attributes.
 *  Orchestrates all registered setting handlers via SettingsRegistry,
 *  plus className/align/backgroundColor/textColor which are always present.
 *
 * @param  array     $attributes
 * @param  \WP_Block $block
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
        'layout' => [],
        'sizing' => [],
        'display' => [],
        'grid' => [],
        'gridItem' => [],
        'flexbox' => [],
        'flexItem' => [],
        'flexboxItem' => [],
        'border' => [],
        'borderRadius' => [],
    ];

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

    // Output preset custom classes (non-decomposable, e.g. w-flex-cols-3)
    if (!empty($attributes['_presetClasses']) && is_array($attributes['_presetClasses'])) {
        $preset_classes = ' ' . implode(' ', $attributes['_presetClasses']);
        $classes .= $preset_classes;
    }

    // Delegate to the registry for all setting-type handlers
    $registry_result = SettingsRegistry::generateClasses($attributes, $block, $parent_block);
    $classes .= $registry_result['classes'];
    $classes_by_prop = array_merge($classes_by_prop, $registry_result['classes_by_property']);

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

// ── Setting handler functions ──
// v2 handlers use dual-read: check v2 keys first, fallback to v1 keys.

function prepareSpacingBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'spacing' => [],
    ];

    if (!empty($attributes['spacing'])) {
        foreach ($attributes['spacing'] as $property_name => $property_data) {
            // Skip link-mode metadata
            if (str_starts_with($property_name, '_')) {
                continue;
            }

            if (!empty($property_data['value'])) {
                $spacing_classes = '';
                // Determine type (margin/padding) for link-mode lookup
                $type = str_starts_with($property_name, 'margin') ? 'margin' : 'padding';
                $link_mode_key = "_{$type}LinkMode";

                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        // Skip sides suppressed by the active link mode
                        $link_mode = $attributes['spacing'][$link_mode_key]['value'][$breakpoint_name] ?? 'individual';
                        if (is_spacing_side_suppressed($property_name, $link_mode)) {
                            continue;
                        }

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

/**
 * Check if a spacing side is suppressed by its link mode.
 * Mirrors the JS isSideSuppressed() logic.
 */
function is_spacing_side_suppressed(string $property_name, string $link_mode): bool
{
    if ($link_mode === 'all' || $link_mode === 'individual') {
        return false;
    }
    if ($link_mode === 'horizontal') {
        return str_contains($property_name, 'top') || str_contains($property_name, 'bottom');
    }
    if ($link_mode === 'vertical') {
        return str_contains($property_name, 'left') || str_contains($property_name, 'right');
    }
    return false;
}

/**
 * Layout handler — reads display mode from v2 'layout' key, falls back to v1 'display' key.
 * Only generates classes for the 'display' property itself; sizing is separate.
 */
function prepareLayoutBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'layout' => [],
    ];

    // Resolve display value: v2 layout.display takes priority over v1 display.display
    $layout_attr = $attributes['layout'] ?? [];
    $display_attr = $attributes['display'] ?? [];

    // Only handle the 'display' property here
    $display_prop = $layout_attr['display'] ?? $display_attr['display'] ?? null;

    if (!empty($display_prop['value'])) {
        $layout_classes = '';
        foreach ($display_prop['value'] as $breakpoint_name => $breakpoint_property_value) {
            if (!empty($breakpoint_property_value)) {
                $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                $layout_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
            }
        }
        $classes_by_prop['layout']['display'] = $layout_classes;
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

/**
 * Sizing handler — reads from v2 'sizing' key, falls back to v1 'display' key
 * for height, width, min/max dimension properties.
 */
function prepareSizingBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'sizing' => [],
    ];

    $sizing_properties = ['height', 'min-height', 'max-height', 'width', 'min-width', 'max-width'];
    $sizing_attr = $attributes['sizing'] ?? [];
    $display_attr = $attributes['display'] ?? [];

    foreach ($sizing_properties as $prop_name) {
        // v2 key takes priority, fallback to v1 display attribute
        $prop_data = $sizing_attr[$prop_name] ?? $display_attr[$prop_name] ?? null;

        if (!empty($prop_data['value'])) {
            $sizing_classes = '';
            foreach ($prop_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                if (!empty($breakpoint_property_value)) {
                    $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                    $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    $sizing_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                }
            }
            $classes_by_prop['sizing'][$prop_name] = $sizing_classes;
        }
    }

    return ['classes' => $classes, 'classes_by_property' => $classes_by_prop];
}

/**
 * Helper: resolve the explicit display value for a breakpoint (no cascade).
 * Checks v2 layout.display first, then v1 display.display.
 */
function get_display_value_for_breakpoint($attributes, $breakpoint_name)
{
    return $attributes['layout']['display']['value'][$breakpoint_name]
        ?? $attributes['display']['display']['value'][$breakpoint_name]
        ?? null;
}

/**
 * Cascaded display value — walks breakpoints from lowest to target and
 * returns the last explicitly set display mode (min-width inheritance).
 * Mirrors JS getEffectiveDisplayValue().
 */
function get_effective_display_value_for_breakpoint($attributes, $breakpoint_name)
{
    $breakpoints = array_keys(get_theme_breakpoints());
    $target_index = array_search($breakpoint_name, $breakpoints, true);
    if ($target_index === false) {
        return null;
    }

    $effective = null;
    for ($i = 0; $i <= $target_index; $i++) {
        $val = get_display_value_for_breakpoint($attributes, $breakpoints[$i]);
        if ($val !== null && $val !== '') {
            $effective = $val;
        }
    }

    return $effective;
}

/**
 * Cascaded parent display value — same cascade applied to parent block attributes.
 * Mirrors JS getEffectiveParentDisplayValue().
 */
function get_effective_parent_display_value_for_breakpoint($parent_block, $breakpoint_name)
{
    if (!$parent_block || empty($parent_block->attributes)) {
        return null;
    }

    return get_effective_display_value_for_breakpoint($parent_block->attributes, $breakpoint_name);
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
                    // Cascaded display check: grid classes apply when effective display is 'grid'
                    $display_value = get_effective_display_value_for_breakpoint($attributes, $breakpoint_name);
                    if (!empty($breakpoint_property_value) && $display_value === 'grid') {
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
                    // Cascaded parent display check
                    $parent_display_value = get_effective_parent_display_value_for_breakpoint($parent_block, $breakpoint_name) ?? 'flex';

                    if (!empty($breakpoint_property_value) && $parent_display_value === 'grid') {
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
                            continue;
                        }

                        // Cascaded display check: flexbox classes apply when effective display is 'flex'
                        $display_value = get_effective_display_value_for_breakpoint($attributes, $breakpoint_name);
                        if (empty($display_value) || $display_value !== 'flex') {
                            continue;
                        }

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

/**
 * Flex-item handler — reads from v2 'flexItem', falls back to v1 'flexboxItem'.
 */
function prepareFlexItemBlockClassesFromSettings($attributes, $block = null, $parent_block = null)
{
    $classes = '';
    $classes_by_prop = [
        'flexItem' => [],
    ];

    $flex_item_attr = $attributes['flexItem'] ?? $attributes['flexboxItem'] ?? [];

    if (!empty($flex_item_attr)) {
        foreach ($flex_item_attr as $property_name => $property_data) {
            if (!empty($property_data['value'])) {
                $flex_item_classes = '';
                foreach ($property_data['value'] as $breakpoint_name => $breakpoint_property_value) {
                    if (!empty($breakpoint_property_value)) {
                        if (!empty($attributes['slider']['enabled']['value'][$breakpoint_name])) {
                            continue;
                        }

                        // Cascaded parent display check
                        $parent_display_value = get_effective_parent_display_value_for_breakpoint($parent_block, $breakpoint_name) ?? 'flex';

                        if (empty($parent_display_value) || $parent_display_value !== 'flex') {
                            continue;
                        }

                        $tw_breakpoint = $breakpoint_name === 'basic' ? '' : "{$breakpoint_name}:";
                        $classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                        $flex_item_classes .= ' ' . $tw_breakpoint . $breakpoint_property_value;
                    }
                }
                $classes_by_prop['flexItem'][$property_name] = $flex_item_classes;
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

// ── Register all handlers with the SettingsRegistry ──
// v2 registration: layout and sizing replace the old display handler,
// flexItem replaces flexboxItem. Old handlers removed.

SettingsRegistry::register('spacing', __NAMESPACE__ . '\prepareSpacingBlockClassesFromSettings');
SettingsRegistry::register('layout', __NAMESPACE__ . '\prepareLayoutBlockClassesFromSettings');
SettingsRegistry::register('sizing', __NAMESPACE__ . '\prepareSizingBlockClassesFromSettings');
SettingsRegistry::register('grid', __NAMESPACE__ . '\prepareGridBlockClassesFromSettings');
SettingsRegistry::register('gridItem', __NAMESPACE__ . '\prepareGridItemBlockClassesFromSettings');
SettingsRegistry::register('flexbox', __NAMESPACE__ . '\prepareFlexboxBlockClassesFromSettings');
SettingsRegistry::register('flexItem', __NAMESPACE__ . '\prepareFlexItemBlockClassesFromSettings');
SettingsRegistry::register('border', __NAMESPACE__ . '\prepareBorderBlockClassesFromSettings');

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
