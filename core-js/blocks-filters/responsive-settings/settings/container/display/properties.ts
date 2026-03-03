import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { createTwThemeValues } from '../../shared/tw-values';

const getDisplayValues = () => [
  { label: 'None selected', value: '' },
  { label: 'Block', value: 'block' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Flex', value: 'flex' },
  { label: 'Grid', value: 'grid' },
  { label: 'Inline Block', value: 'inline-block' },
  { label: 'Inline', value: 'inline' },
];

export const getDisplayProperties = (
  blockName: string,
  twTheme: WebentorConfig['theme'],
) =>
  applyFilters(
    'webentor-theme-display-settings',
    [
      {
        label: __('Display', 'webentor'),
        name: 'display',
        help: __('Initial value is "Flex"', 'webentor'),
        values: getDisplayValues(),
      },
      {
        label: __('Height', 'webentor'),
        name: 'height',
        values: createTwThemeValues(twTheme, 'height', 'h'),
      },
      {
        label: __('Min Height', 'webentor'),
        name: 'min-height',
        values: createTwThemeValues(twTheme, 'minHeight', 'min-h'),
      },
      {
        label: __('Max Height', 'webentor'),
        name: 'max-height',
        values: createTwThemeValues(twTheme, 'maxHeight', 'max-h'),
      },
      {
        label: __('Width', 'webentor'),
        name: 'width',
        values: createTwThemeValues(twTheme, 'width', 'w'),
      },
      {
        label: __('Min Width', 'webentor'),
        name: 'min-width',
        values: createTwThemeValues(twTheme, 'minWidth', 'min-w'),
      },
      {
        label: __('Max Width', 'webentor'),
        name: 'max-width',
        values: createTwThemeValues(twTheme, 'maxWidth', 'max-w'),
      },
    ],
    blockName,
  );
