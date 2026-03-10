/**
 * Grid-item properties — column span, row span, order.
 *
 * These properties apply to children of a grid container.
 * Re-uses getGridItemProperties from the grid module for DRY.
 */
import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '../../../../types/_webentor-config';
import { PropertyDefinition } from '../../types';
import { getOrderValues } from '../shared/layout-values';
import { createTwThemeValues } from '../shared/tw-values';

export const getGridItemProperties = (
  twTheme: WebentorConfig['theme'],
): PropertyDefinition[] => [
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

export const GRID_ITEM_PROPERTY_NAMES = [
  'grid-col-span',
  'grid-row-span',
  'order',
];
