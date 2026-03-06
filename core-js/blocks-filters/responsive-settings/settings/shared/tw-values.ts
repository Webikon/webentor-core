import { __ } from '@wordpress/i18n';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { SelectOption, SelectOptionGroup } from '../../types';
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
    // Sort by the resolved CSS value (e.g. 0.25rem → 4, 1rem → 16)
    keys.sort(
      (a, b) => (parseFloat(themeObj[a]) || 0) - (parseFloat(themeObj[b]) || 0),
    );
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

/** Matches pure integers (96) and floats (3.5) — rejects units like 3rem, 100% */
const PURE_NUMBER = /^\d+(\.\d+)?$/;

/**
 * Creates grouped SelectOptionGroup[] splitting numeric vs string values.
 * Numeric = theme key is a pure integer or float (e.g. "96", "3.5").
 * String  = everything else (e.g. "auto", "full", "screen", "px").
 */
export const createGroupedTwThemeValues = (
  twTheme: WebentorConfig['theme'],
  themeKey: string,
  prefix: string,
  opts?: TwThemeValueOptions,
): SelectOptionGroup[] => {
  const themeObj = twTheme?.[themeKey];
  if (!themeObj) return [];

  const keys = Object.keys(themeObj);
  if (opts?.sort !== false) {
    keys.sort(
      (a, b) => (parseFloat(themeObj[a]) || 0) - (parseFloat(themeObj[b]) || 0),
    );
  }

  const formatter = opts?.labelFormatter ?? defaultLabelFormatter;
  const numeric: SelectOption[] = [];
  const keyword: SelectOption[] = [];

  for (const key of keys) {
    const rawValue = themeObj[key];
    const option: SelectOption = {
      label: formatter(key, rawValue),
      value: prefix ? `${prefix}-${key}` : key,
    };
    if (PURE_NUMBER.test(key)) {
      numeric.push(option);
    } else {
      keyword.push(option);
    }
  }

  const groups: SelectOptionGroup[] = [];
  if (numeric.length)
    groups.push({ label: __('Numeric', 'webentor'), options: numeric });
  if (keyword.length)
    groups.push({ label: __('Keyword', 'webentor'), options: keyword });
  return groups;
};

/** Label formatter for spacing-scale keys (key × 4 = px) */
export const spacingLabel = (key: string): string => `${Number(key) * 4}px`;
