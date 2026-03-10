import { WebentorConfig } from '../../../../types/_webentor-config';
import { SelectOption } from '../../types';
import { createTwThemeValues, spacingLabel } from './tw-values';

/**
 * Shared gap value generator used by both grid and flexbox properties.
 */
export const getGapValues = (
  axis: '' | 'x' | 'y' = '',
  twTheme: WebentorConfig['theme'],
): SelectOption[] => {
  const prefix = axis ? `gap-${axis}` : 'gap';
  return createTwThemeValues(twTheme, 'gap', prefix, {
    labelFormatter: spacingLabel,
  });
};
