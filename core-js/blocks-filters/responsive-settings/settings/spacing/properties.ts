import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { createTwThemeValues, spacingLabel } from '../shared/tw-values';

const getSpacingValues = (
  property: string,
  twTheme: WebentorConfig['theme'],
) =>
  createTwThemeValues(twTheme, 'spacing', property, {
    labelFormatter: spacingLabel,
  });

/** Margin sides for BoxModelControl (includes Auto option) */
export const getMarginSides = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Margin Top', 'webentor'),
    name: 'margin-top',
    values: [
      ...getSpacingValues('mt', twTheme),
      { label: 'Auto', value: 'mt-auto' },
    ],
  },
  {
    label: __('Margin Right', 'webentor'),
    name: 'margin-right',
    values: [
      ...getSpacingValues('mr', twTheme),
      { label: 'Auto', value: 'mr-auto' },
    ],
  },
  {
    label: __('Margin Bottom', 'webentor'),
    name: 'margin-bottom',
    values: [
      ...getSpacingValues('mb', twTheme),
      { label: 'Auto', value: 'mb-auto' },
    ],
  },
  {
    label: __('Margin Left', 'webentor'),
    name: 'margin-left',
    values: [
      ...getSpacingValues('ml', twTheme),
      { label: 'Auto', value: 'ml-auto' },
    ],
  },
];

/** Padding sides for BoxModelControl */
export const getPaddingSides = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Padding Top', 'webentor'),
    name: 'padding-top',
    values: getSpacingValues('pt', twTheme),
  },
  {
    label: __('Padding Right', 'webentor'),
    name: 'padding-right',
    values: getSpacingValues('pr', twTheme),
  },
  {
    label: __('Padding Bottom', 'webentor'),
    name: 'padding-bottom',
    values: getSpacingValues('pb', twTheme),
  },
  {
    label: __('Padding Left', 'webentor'),
    name: 'padding-left',
    values: getSpacingValues('pl', twTheme),
  },
];

/** Flat list of all spacing properties (backward compat for getSpacingProperties) */
export const getSpacingProperties = (twTheme: WebentorConfig['theme']) => [
  ...getMarginSides(twTheme),
  ...getPaddingSides(twTheme),
];

const SPACING_PROPERTY_NAMES = [
  'margin-top',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
];

/** Check if any spacing value is set for a given breakpoint */
export const hasSpacingSettingsForBreakpoint = (
  attributes: Record<string, any>,
  breakpoint: string,
): boolean => {
  return SPACING_PROPERTY_NAMES.some(
    (prop) => !!attributes?.spacing?.[prop]?.value?.[breakpoint],
  );
};
