import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { getGapValues } from '../../shared/gap-values';
import {
  getAlignContentValues,
  getAlignItemsValues,
  getJustifyContentValues,
  getOrderValues,
} from '../../shared/layout-values';
import { createTwThemeValues } from '../../shared/tw-values';

export const getGridProperties = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Grid Template Columns', 'webentor'),
    name: 'grid-cols',
    values: createTwThemeValues(twTheme, 'gridTemplateColumns', 'grid-cols', {
      sort: false,
      labelFormatter: (key) =>
        __('Columns: %s', 'webentor').replace('%s', key),
    }),
  },
  {
    label: __('Grid Template Rows', 'webentor'),
    name: 'grid-rows',
    values: createTwThemeValues(twTheme, 'gridTemplateRows', 'grid-rows', {
      sort: false,
      labelFormatter: (key) => __('Rows: %s', 'webentor').replace('%s', key),
    }),
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
    values: createTwThemeValues(twTheme, 'gridColumn', 'col', {
      sort: false,
      labelFormatter: (key) => key,
    }),
  },
  {
    label: __('Grid Row Span', 'webentor'),
    name: 'grid-row-span',
    values: createTwThemeValues(twTheme, 'gridRow', 'row', {
      sort: false,
      labelFormatter: (key) => key,
    }),
  },
  {
    label: __('Order', 'webentor'),
    name: 'order',
    values: getOrderValues(),
  },
];
