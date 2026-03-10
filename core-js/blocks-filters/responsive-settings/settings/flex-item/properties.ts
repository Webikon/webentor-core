/**
 * Flex-item properties — grow, shrink, basis, order.
 *
 * Extracted from container/flexbox/properties.ts to be its own module.
 * Re-exports getFlexboxItemProperties for backward compat.
 */
import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '../../../../types/_webentor-config';
import { PropertyDefinition } from '../../types';
import { getOrderValues } from '../shared/layout-values';
import { createTwThemeValues } from '../shared/tw-values';

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

export const getFlexItemProperties = (
  twTheme: WebentorConfig['theme'],
): PropertyDefinition[] => [
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

export const FLEX_ITEM_PROPERTY_NAMES = [
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'order',
];
