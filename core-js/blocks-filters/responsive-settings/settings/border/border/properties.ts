import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { getPixelFromRemValue } from '../../../utils';

export const getBorderProperties = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Border Width', 'webentor'),
    name: 'width',
    values: Object.keys(twTheme?.borderWidth).map((key) => ({
      label: `${key} (${getPixelFromRemValue(twTheme?.borderWidth[key])})`,
      value: `${key}`,
    })),
  },
  {
    label: __('Border Style', 'webentor'),
    name: 'style',
    values: [
      { label: __('None selected', 'webentor'), value: '' },
      ...Object.keys(twTheme?.borderStyle).map((key) => ({
        label: `${key}`,
        value: `${key}`,
      })),
    ],
  },
];
