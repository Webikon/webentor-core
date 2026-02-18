import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

export const getBorderRadiusValues = (twTheme: WebentorConfig['theme']) => {
  const values = Object.keys(twTheme?.borderRadius).map((key) => ({
    label: `${key} (${twTheme?.borderRadius[key]})`,
    value: key,
  }));

  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

// export const getBorderRadiusProperties = (twTheme: WebentorConfig['theme']) => [
//   {
//     name: 'radius',
//     label: __('Radius', 'webentor'),
//     values: [
//       { label: __('None selected', 'webentor'), value: '' },
//       ...Object.keys(twTheme?.borderRadius || {}).map((key) => ({
//         label: key,
//         value: key,
//       })),
//     ],
//   },
// ];
