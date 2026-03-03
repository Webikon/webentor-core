import { __ } from '@wordpress/i18n';

import { SelectOption } from '../../types';

/**
 * Shared layout value lists used by both flexbox and grid properties.
 * Eliminates the 5 identical function pairs that were copy-pasted between
 * flexbox/properties.ts and grid/properties.ts.
 */

export const getJustifyContentValues = (): SelectOption[] => [
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

export const getAlignItemsValues = (): SelectOption[] => [
  { label: __('None selected', 'webentor'), value: '' },
  { label: __('Flex Start', 'webentor'), value: 'items-start' },
  { label: __('Flex End', 'webentor'), value: 'items-end' },
  { label: __('Center', 'webentor'), value: 'items-center' },
  { label: __('Baseline', 'webentor'), value: 'items-baseline' },
  { label: __('Stretch', 'webentor'), value: 'items-stretch' },
];

export const getAlignContentValues = (): SelectOption[] => [
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

export const getOrderValues = (): SelectOption[] => [
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
