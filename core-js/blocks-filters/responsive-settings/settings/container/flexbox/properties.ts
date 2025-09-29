import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { getPixelFromRemValue } from '../../../utils';

const getGapValues = (axis = '', twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.gap)
    // Sort ASC manually because Object.keys() is sorting keys wrong
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${Number(key) * 4}px`,
      value: `gap-${axis === 'x' ? 'x-' : axis === 'y' ? 'y-' : ''}${key}`,
    }));

  // Add none selected option as first item
  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

const getFlexBasisValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.flexBasis)
    // Sort ASC manually because Object.keys() is sorting keys wrong
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${key} (${getPixelFromRemValue(twTheme?.flexBasis[key])})`,
      value: `basis-${key}`,
    }));

  // Add none selected option as first item
  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

const getFlexDirectionValues = () => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Row', 'webentor'), value: 'flex-row' },
  { label: __('Row Reverse', 'webentor'), value: 'flex-row-reverse' },
  { label: __('Column', 'webentor'), value: 'flex-col' },
  { label: __('Column Reverse', 'webentor'), value: 'flex-col-reverse' },
];

const getFlexWrapValues = () => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Wrap', 'webentor'), value: 'flex-wrap' },
  { label: __('Nowrap', 'webentor'), value: 'flex-nowrap' },
  { label: __('Wrap Reverse', 'webentor'), value: 'flex-wrap-reverse' },
];

const getJustifyContentValues = () => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Normal', 'webentor'), value: 'justify-normal' },
  { label: __('Flex Start', 'webentor'), value: 'justify-start' },
  { label: __('Flex End', 'webentor'), value: 'justify-end' },
  { label: __('Center', 'webentor'), value: 'justify-center' },
  { label: __('Space Between', 'webentor'), value: 'justify-between' },
  { label: __('Space Around', 'webentor'), value: 'justify-around' },
  { label: __('Space Evenly', 'webentor'), value: 'justify-evenly' },
  { label: __('Stretch', 'webentor'), value: 'justify-stretch' },
];

const getAlignItemsValues = () => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Flex Start', 'webentor'), value: 'items-start' },
  { label: __('Flex End', 'webentor'), value: 'items-end' },
  { label: __('Center', 'webentor'), value: 'items-center' },
  { label: __('Baseline', 'webentor'), value: 'items-baseline' },
  { label: __('Stretch', 'webentor'), value: 'items-stretch' },
];

const getAlignContentValues = () => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Normal', 'webentor'), value: 'content-normal' },
  { label: __('Flex Start', 'webentor'), value: 'content-start' },
  { label: __('Flex End', 'webentor'), value: 'content-end' },
  { label: __('Center', 'webentor'), value: 'content-center' },
  { label: __('Space Between', 'webentor'), value: 'content-between' },
  { label: __('Space Around', 'webentor'), value: 'content-around' },
  { label: __('Space Evenly', 'webentor'), value: 'content-evenly' },
  { label: __('Baseline', 'webentor'), value: 'content-baseline' },
  { label: __('Stretch', 'webentor'), value: 'content-stretch' },
];

const getFlexGrowValues = () => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Grow 0', 'webentor'), value: 'grow-0' },
  { label: __('Grow 1', 'webentor'), value: 'grow' },
];

const getFlexShrinkValues = () => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Shrink 0', 'webentor'), value: 'shrink-0' },
  { label: __('Shrink 1', 'webentor'), value: 'shrink' },
];

const getOrderValues = () => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Order First', 'webentor'), value: 'order-first' },
  { label: __('Order Last', 'webentor'), value: 'order-last' },
  { label: __('Order None', 'webentor'), value: 'order-none' },
  { label: __('Order 0', 'webentor'), value: 'order-0' },
  { label: __('Order 1', 'webentor'), value: 'order-1' },
  { label: __('Order 2', 'webentor'), value: 'order-2' },
  { label: __('Order 3', 'webentor'), value: 'order-3' },
  { label: __('Order 4', 'webentor'), value: 'order-4' },
  { label: __('Order 5', 'webentor'), value: 'order-5' },
];

export const getFlexboxProperties = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Flex Gap', 'webentor'),
    name: 'gap',
    values: getGapValues('', twTheme),
  },
  {
    label: __('Flex Gap X', 'webentor'),
    name: 'gap-x',
    values: getGapValues('x', twTheme),
    help: __('Overrides Gap value', 'webentor'),
  },
  {
    label: __('Flex Gap Y', 'webentor'),
    name: 'gap-y',
    values: getGapValues('y', twTheme),
    help: __('Overrides Gap value', 'webentor'),
  },
  {
    label: __('Flex Direction', 'webentor'),
    name: 'flex-direction',
    values: getFlexDirectionValues(),
  },
  {
    label: __('Flex Wrap', 'webentor'),
    name: 'flex-wrap',
    values: getFlexWrapValues(),
  },
  {
    label: __('Justify Content', 'webentor'),
    name: 'justify-content',
    values: getJustifyContentValues(),
  },
  {
    label: __('Align Items', 'webentor'),
    name: 'align-items',
    values: getAlignItemsValues(),
  },
  {
    label: __('Align Content', 'webentor'),
    name: 'align-content',
    values: getAlignContentValues(),
  },
];

export const getFlexboxItemProperties = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Flex Grow', 'webentor'),
    name: 'flex-grow',
    help: __('Applicable only on Flexbox child item', 'webentor'),
    values: getFlexGrowValues(),
  },
  {
    label: __('Flex Shrink', 'webentor'),
    name: 'flex-shrink',
    help: __('Applicable only on Flexbox child item', 'webentor'),
    values: getFlexShrinkValues(),
  },
  {
    label: __('Flex Basis', 'webentor'),
    name: 'flex-basis',
    help: __('Applicable only on Flexbox child item', 'webentor'),
    values: getFlexBasisValues(twTheme),
  },
  {
    label: __('Order', 'webentor'),
    name: 'order',
    help: __('Applicable only on Flexbox child item', 'webentor'),
    values: getOrderValues(),
  },
];
