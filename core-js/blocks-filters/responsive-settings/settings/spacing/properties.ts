import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

const getSpacingValues = (property = '', twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.spacing)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => ({
      label: `${Number(key) * 4}px`,
      value: `${property}-${key}`,
    }));

  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

export const getSpacingProperties = (twTheme: WebentorConfig['theme']) => [
  {
    label: __('Margin Top', 'webentor'),
    name: 'margin-top',
    values: [
      ...getSpacingValues('mt', twTheme),
      { label: 'Auto', value: 'mt-auto' },
    ],
  },
  {
    label: __('Margin Left', 'webentor'),
    name: 'margin-left',
    values: [
      ...getSpacingValues('ml', twTheme),
      { label: 'Auto', value: 'ml-auto' },
    ],
  },
  {
    label: __('Margin Right', 'webentor'),
    name: 'margin-right',
    values: [
      ...getSpacingValues('mr', twTheme),
      { label: 'Auto', value: 'mr-auto' },
    ],
  },
  {
    label: __('Margin Bottom', 'webentor'),
    name: 'margin-bottom',
    values: [
      ...getSpacingValues('mb', twTheme),
      { label: 'Auto', value: 'mb-auto' },
    ],
  },
  {
    label: __('Padding Top', 'webentor'),
    name: 'padding-top',
    values: getSpacingValues('pt', twTheme),
  },
  {
    label: __('Padding Left', 'webentor'),
    name: 'padding-left',
    values: getSpacingValues('pl', twTheme),
  },
  {
    label: __('Padding Right', 'webentor'),
    name: 'padding-right',
    values: getSpacingValues('pr', twTheme),
  },
  {
    label: __('Padding Bottom', 'webentor'),
    name: 'padding-bottom',
    values: getSpacingValues('pb', twTheme),
  },
];
