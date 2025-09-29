import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

const getGridTemplateColumnsValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.gridTemplateColumns).map((key) => ({
    label: __('Columns: %s', 'webentor').replace('%s', key),
    value: `grid-cols-${key}`,
  }));

  // Add none selected option as first item
  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

const getGridTemplateRowsValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.gridTemplateRows).map((key) => ({
    label: __('Rows: %s', 'webentor').replace('%s', key),
    value: `grid-rows-${key}`,
  }));

  // Add none selected option as first item
  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

const getGapValues = (axis = '', twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.gap)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${Number(key) * 4}px`,
      value: `gap-${axis === 'x' ? 'x-' : axis === 'y' ? 'y-' : ''}${key}`,
    }));

  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

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

const getGridColumnSpanValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.gridColumn).map((key) => ({
    label: key,
    value: `col-${key}`,
  }));

  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

const getGridRowSpanValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.gridRow).map((key) => ({
    label: key,
    value: `row-${key}`,
  }));

  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

export const getGridProperties = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Grid Template Columns', 'webentor'),
    name: 'grid-cols',
    values: getGridTemplateColumnsValues(twTheme),
  },
  {
    label: __('Grid Template Rows', 'webentor'),
    name: 'grid-rows',
    values: getGridTemplateRowsValues(twTheme),
  },
  {
    label: __('Gap', 'webentor'),
    name: 'gap',
    values: getGapValues('', twTheme),
  },
  {
    label: __('Gap X', 'webentor'),
    name: 'gap-x',
    values: getGapValues('x', twTheme),
    help: __('Overrides Gap value', 'webentor'),
  },
  {
    label: __('Gap Y', 'webentor'),
    name: 'gap-y',
    values: getGapValues('y', twTheme),
    help: __('Overrides Gap value', 'webentor'),
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

export const getGridItemProperties = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Grid Column Span', 'webentor'),
    name: 'grid-col-span',
    values: getGridColumnSpanValues(twTheme),
  },
  {
    label: __('Grid Row Span', 'webentor'),
    name: 'grid-row-span',
    values: getGridRowSpanValues(twTheme),
  },
  {
    label: __('Order', 'webentor'),
    name: 'order',
    values: getOrderValues(),
  },
];
