/**
 * Sizing properties — width, height, min/max dimensions.
 *
 * These were previously lumped under the 'display' attribute alongside
 * the CSS display property. Now they live in their own 'sizing' attribute
 * with a dedicated support key.
 */
import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { PropertyDefinition } from '../../types';
import { createTwThemeValues } from '../shared/tw-values';

export const getSizingProperties = (
  twTheme: WebentorConfig['theme'],
): PropertyDefinition[] => [
  {
    label: __('Height', 'webentor'),
    name: 'height',
    values: createTwThemeValues(twTheme, 'height', 'h'),
    groupedValues: true,
  },
  {
    label: __('Min Height', 'webentor'),
    name: 'min-height',
    values: createTwThemeValues(twTheme, 'minHeight', 'min-h'),
    groupedValues: true,
  },
  {
    label: __('Max Height', 'webentor'),
    name: 'max-height',
    values: createTwThemeValues(twTheme, 'maxHeight', 'max-h'),
    groupedValues: true,
  },
  {
    label: __('Width', 'webentor'),
    name: 'width',
    values: createTwThemeValues(twTheme, 'width', 'w'),
    groupedValues: true,
  },
  {
    label: __('Min Width', 'webentor'),
    name: 'min-width',
    values: createTwThemeValues(twTheme, 'minWidth', 'min-w'),
    groupedValues: true,
  },
  {
    label: __('Max Width', 'webentor'),
    name: 'max-width',
    values: createTwThemeValues(twTheme, 'maxWidth', 'max-w'),
    groupedValues: true,
  },
];

export const SIZING_PROPERTY_NAMES = [
  'height',
  'min-height',
  'max-height',
  'width',
  'min-width',
  'max-width',
];

export const hasSizingSettingsForBreakpoint = (
  attributes: Record<string, any>,
  breakpoint: string,
): boolean => {
  const isV2 = attributes?._responsiveSettingsVersion === 2;
  return SIZING_PROPERTY_NAMES.some(
    (prop) =>
      !!attributes?.sizing?.[prop]?.value?.[breakpoint] ||
      (!isV2 && !!attributes?.display?.[prop]?.value?.[breakpoint]),
  );
};
