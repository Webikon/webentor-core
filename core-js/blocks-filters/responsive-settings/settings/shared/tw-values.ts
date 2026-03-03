import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { SelectOption } from '../../types';
import { getPixelFromRemValue } from '../../utils';

export interface TwThemeValueOptions {
  sort?: boolean;
  labelFormatter?: (key: string, rawValue: string) => string;
}

const defaultLabelFormatter = (key: string, rawValue: string) =>
  `${key} (${getPixelFromRemValue(rawValue)})`;

/**
 * Creates a SelectOption[] from a Tailwind theme config section.
 * Replaces the 13+ near-identical getXValues() functions scattered
 * across display, flexbox, grid, spacing, and border property files.
 *
 * @param twTheme  Tailwind resolved theme
 * @param themeKey Key inside twTheme (e.g. 'height', 'spacing', 'gap')
 * @param prefix   CSS utility prefix (e.g. 'h', 'w', 'mt', 'gap-x')
 * @param opts     Sorting and label formatting overrides
 */
export const createTwThemeValues = (
  twTheme: WebentorConfig['theme'],
  themeKey: string,
  prefix: string,
  opts?: TwThemeValueOptions,
): SelectOption[] => {
  const themeObj = twTheme?.[themeKey];
  if (!themeObj) return [{ label: __('None selected', 'webentor'), value: '' }];

  const keys = Object.keys(themeObj);
  if (opts?.sort !== false) {
    keys.sort((a, b) => Number(a) - Number(b));
  }

  const formatter = opts?.labelFormatter ?? defaultLabelFormatter;

  const values = keys.map((key) => ({
    label: formatter(key, themeObj[key]),
    value: prefix ? `${prefix}-${key}` : key,
  }));

  values.unshift({
    label: __('None selected', 'webentor'),
    value: '',
  });

  return values;
};

/** Label formatter for spacing-scale keys (key × 4 = px) */
export const spacingLabel = (key: string): string => `${Number(key) * 4}px`;
