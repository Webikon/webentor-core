import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { getGapValues } from '../shared/gap-values';
import {
  getAlignContentValues,
  getAlignItemsValues,
  getJustifyContentValues,
} from '../shared/layout-values';
import { createTwThemeValues } from '../shared/tw-values';

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
