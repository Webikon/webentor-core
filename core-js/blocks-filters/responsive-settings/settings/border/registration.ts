/**
 * Border module registration.
 *
 * panelGroup: border, order: 10
 * Handles both border and borderRadius settings within a single module.
 * Support key: ['border', 'borderRadius']
 */
import { isEmpty } from '@webentorCore/_utils';

import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import {
  prepareTailwindBorderClassesForSide,
} from '../../utils';
import { BorderAndRadiusSettings } from './settings';

const RADIUS_MAPPING: Record<string, string> = {
  topLeft: 'rounded-tl',
  topRight: 'rounded-tr',
  bottomRight: 'rounded-br',
  bottomLeft: 'rounded-bl',
};

const generateBorderClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  _context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.border) return classes;

  for (const [propName, prop] of Object.entries(attributes.border)) {
    const propData = prop as any;
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;

    for (const [valueSide, value] of Object.entries(bpValue)) {
      if (valueSide === 'linked') continue;
      if (!value) continue;

      if (propName === 'border') {
        classes.push(
          ...prepareTailwindBorderClassesForSide(
            value,
            valueSide,
            twBreakpoint,
          ),
        );
      } else if (propName === 'borderRadius') {
        const prefix = RADIUS_MAPPING[valueSide];
        if (prefix) {
          classes.push(`${twBreakpoint}${prefix}-${value}`);
        }
      }
    }
  }

  return classes;
};

const hasBorderActiveSettings = (
  attributes: Record<string, any>,
  breakpoint: string,
): boolean => {
  const properties = ['border', 'borderRadius'];
  return properties.some((property) => {
    return !isEmpty(attributes?.border?.[property]?.value?.[breakpoint]);
  });
};

registry.register({
  name: 'border',
  panelGroup: 'border',
  order: 10,
  attributeKey: 'border',
  supportKey: ['border', 'borderRadius'],
  attributeSchema: {
    border: { type: 'object', default: {} },
  },
  SettingsComponent: BorderAndRadiusSettings,
  generateClasses: generateBorderClasses,
  hasActiveSettings: hasBorderActiveSettings,
});
