import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { createTwThemeValues } from '../../shared/tw-values';

export const getBorderRadiusValues = (twTheme: WebentorConfig['theme']) =>
  createTwThemeValues(twTheme, 'borderRadius', '', {
    sort: false,
    labelFormatter: (key, rawValue) => `${key} (${rawValue})`,
  });
