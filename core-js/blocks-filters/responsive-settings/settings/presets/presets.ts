/**
 * Preset definitions — one-click layout configurations.
 *
 * Each preset specifies which attribute values to set and optionally
 * includes custom CSS classes for layouts that can't be expressed
 * with pure Tailwind utilities (e.g. flex-wrap + gap + equal columns).
 *
 * Presets are decomposable: selecting one fills in the individual
 * settings below (which remain editable). The _preset marker tracks
 * which preset was last applied.
 */
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { LayoutPreset } from '../../types';

export const layoutPresets: LayoutPreset[] = [
  {
    id: 'grid-2-col',
    label: __('2 Column Grid', 'webentor'),
    icon: 'columns',
    description: __('Grid layout with 2 equal columns', 'webentor'),
    applies: {
      layout: {
        display: { value: { basic: 'grid' } },
      },
      grid: {
        'grid-cols': { value: { basic: 'grid-cols-2' } },
        gap: { value: { basic: 'gap-4' } },
      },
    },
  },
  {
    id: 'grid-3-col',
    label: __('3 Column Grid', 'webentor'),
    icon: 'columns',
    description: __('Grid layout with 3 equal columns', 'webentor'),
    applies: {
      layout: {
        display: { value: { basic: 'grid' } },
      },
      grid: {
        'grid-cols': { value: { basic: 'grid-cols-3' } },
        gap: { value: { basic: 'gap-4' } },
      },
    },
  },
  {
    id: 'grid-4-col',
    label: __('4 Column Grid', 'webentor'),
    icon: 'columns',
    description: __('Grid layout with 4 equal columns', 'webentor'),
    applies: {
      layout: {
        display: { value: { basic: 'grid' } },
      },
      grid: {
        'grid-cols': { value: { basic: 'grid-cols-4' } },
        gap: { value: { basic: 'gap-4' } },
      },
    },
  },
  {
    id: 'flex-3-col-wrap',
    label: __('3 Column Flex Wrap', 'webentor'),
    icon: 'columns',
    description: __(
      'Flex layout with 3 columns and wrapping (uses custom CSS for gap-aware widths)',
      'webentor',
    ),
    applies: {
      layout: {
        display: { value: { basic: 'flex' } },
      },
      flexbox: {
        'flex-wrap': { value: { basic: 'flex-wrap' } },
      },
    },
    customClasses: ['w-flex-cols', 'w-flex-cols-3', 'w-gap-4'],
  },
  {
    id: 'centered-content',
    label: __('Centered Content', 'webentor'),
    icon: 'align-center',
    description: __('Flex container with centered content', 'webentor'),
    applies: {
      layout: {
        display: { value: { basic: 'flex' } },
      },
      flexbox: {
        'justify-content': { value: { basic: 'justify-center' } },
        'align-items': { value: { basic: 'items-center' } },
      },
    },
  },
  {
    id: 'stack-column',
    label: __('Stack (Column)', 'webentor'),
    icon: 'arrow-down',
    description: __('Vertical flex stack with gap', 'webentor'),
    applies: {
      layout: {
        display: { value: { basic: 'flex' } },
      },
      flexbox: {
        'flex-direction': { value: { basic: 'flex-col' } },
        gap: { value: { basic: 'gap-4' } },
      },
    },
  },
];

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
