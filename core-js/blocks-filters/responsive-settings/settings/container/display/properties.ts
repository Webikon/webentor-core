import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { getPixelFromRemValue } from '../../../utils';

const getDisplayValues = () => [
  { label: 'None selected', value: '' },
  { label: 'Block', value: 'block' },
  { label: 'Hidden', value: 'hidden' },
  { label: 'Flex', value: 'flex' },
  { label: 'Grid', value: 'grid' },
  { label: 'Inline Block', value: 'inline-block' },
  { label: 'Inline', value: 'inline' },
];

const getHeightValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.height)
    // Sort ASC manually because Object.keys() is sorting keys wrong
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${key} (${getPixelFromRemValue(twTheme?.height[key])})`,
      value: `h-${key}`,
    }));

  // Add none selected option as first item
  values.unshift({
    label: 'None selected',
    value: '',
  });

  return values;
};

const getWidthValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.width)
    // Sort ASC manually because Object.keys() is sorting keys wrong
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${key} (${getPixelFromRemValue(twTheme?.width[key])})`,
      value: `w-${key}`,
    }));

  // Add none selected option as first item
  values.unshift({
    label: 'None selected',
    value: '',
  });

  return values;
};

const getMinHeightValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.minHeight)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${key} (${getPixelFromRemValue(twTheme?.minHeight[key])})`,
      value: `min-h-${key}`,
    }));

  // Add none selected option as first item
  values.unshift({
    label: 'None selected',
    value: '',
  });

  return values;
};

const getMinWidthValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.minWidth)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${key} (${getPixelFromRemValue(twTheme?.minWidth[key])})`,
      value: `min-w-${key}`,
    }));

  // Add none selected option as first item
  values.unshift({
    label: 'None selected',
    value: '',
  });

  return values;
};

const getMaxHeightValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.maxHeight)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${key} (${getPixelFromRemValue(twTheme?.maxHeight[key])})`,
      value: `max-h-${key}`,
    }));

  // Add none selected option as first item
  values.unshift({
    label: 'None selected',
    value: '',
  });

  return values;
};

const getMaxWidthValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.maxWidth)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${key} (${getPixelFromRemValue(twTheme?.maxWidth[key])})`,
      value: `max-w-${key}`,
    }));

  // Add none selected option as first item
  values.unshift({
    label: 'None selected',
    value: '',
  });

  return values;
};

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
        values: getHeightValues(twTheme),
      },
      {
        label: __('Min Height', 'webentor'),
        name: 'min-height',
        values: getMinHeightValues(twTheme),
      },
      {
        label: __('Max Height', 'webentor'),
        name: 'max-height',
        values: getMaxHeightValues(twTheme),
      },
      {
        label: __('Width', 'webentor'),
        name: 'width',
        values: getWidthValues(twTheme),
      },
      {
        label: __('Min Width', 'webentor'),
        name: 'min-width',
        values: getMinWidthValues(twTheme),
      },
      {
        label: __('Max Width', 'webentor'),
        name: 'max-width',
        values: getMaxWidthValues(twTheme),
      },
    ],
    blockName,
  );
