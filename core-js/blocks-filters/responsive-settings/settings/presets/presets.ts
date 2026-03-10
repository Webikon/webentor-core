/**
 * Preset definitions - one-click layout configurations.
 *
 * Core intentionally ships no built-in presets because layout shortcuts are
 * project-specific. Themes/plugins are expected to provide their own preset
 * catalog through `webentor.core.responsiveSettings.layoutPresets` in the
 * editor bootstrap where they already register `twTheme` and breakpoints.
 *
 * Each preset specifies which attribute values to set and optionally includes
 * custom CSS classes for layouts that cannot be expressed with pure Tailwind
 * utilities (for example: flex-wrap + gap + equal columns).
 *
 * Presets are decomposable: selecting one fills in the individual settings
 * below, which remain editable. The `_preset` marker only tracks which preset
 * was last applied.
 */
import { applyFilters } from '@wordpress/hooks';

import { WebentorConfig } from '../../../../types/_webentor-config';
import { LayoutPreset } from '../../types';

// Intentionally empty: themes/projects own the preset catalog.
export const layoutPresets: LayoutPreset[] = [];

const clonePreset = (preset: LayoutPreset): LayoutPreset => ({
  ...preset,
  applies: Object.fromEntries(
    Object.entries(preset.applies).map(([attributeKey, propertyMap]) => [
      attributeKey,
      Object.fromEntries(
        Object.entries(propertyMap).map(([propertyName, propertyValue]) => [
          propertyName,
          {
            value: { ...propertyValue.value },
          },
        ]),
      ),
    ]),
  ),
  customClasses: preset.customClasses ? [...preset.customClasses] : undefined,
});

export const getLayoutPresets = (
  blockName: string,
  twTheme: WebentorConfig['theme'],
): LayoutPreset[] =>
  applyFilters(
    'webentor.core.responsiveSettings.layoutPresets',
    layoutPresets.map(clonePreset),
    blockName,
    twTheme,
  ) as LayoutPreset[];
