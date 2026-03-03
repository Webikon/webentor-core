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
    values: createTwThemeValues(twTheme, 'flexBasis', 'basis'),
  },
  {
    label: __('Order', 'webentor'),
    name: 'order',
    help: __('Applicable only on Flexbox child item', 'webentor'),
    values: getOrderValues(),
  },
];
