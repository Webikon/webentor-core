/**
 * Layout properties — display mode and visibility.
 *
 * Separated from the old display/properties.ts which lumped sizing
 * properties together with display mode. This module only handles
 * the CSS `display` property itself.
 */
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '../../../../types/_webentor-config';
import { PropertyDefinition } from '../../types';

const getDisplayValues = () => [
  { label: 'None selected', value: '' },
  { label: 'Block', value: 'block' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Flex', value: 'flex' },
  { label: 'Grid', value: 'grid' },
  { label: 'Inline Block', value: 'inline-block' },
  { label: 'Inline', value: 'inline' },
];

export const getLayoutProperties = (
  blockName: string,
  _twTheme: WebentorConfig['theme'],
): PropertyDefinition[] =>
  applyFilters(
    'webentor-theme-layout-settings',
    [
      {
        label: __('Display', 'webentor'),
        name: 'display',
        help: __('Initial value is "Flex"', 'webentor'),
        values: getDisplayValues(),
      },
    ],
    blockName,
  ) as PropertyDefinition[];

/** Property names for active-settings detection */
export const LAYOUT_PROPERTY_NAMES = ['display'];

export const hasLayoutSettingsForBreakpoint = (
  attributes: Record<string, any>,
  breakpoint: string,
): boolean => {
  return LAYOUT_PROPERTY_NAMES.some(
    (prop) => !!attributes?.layout?.[prop]?.value?.[breakpoint],
  );
};
