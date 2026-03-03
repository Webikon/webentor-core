import { isEmpty } from '@webentorCore/_utils';

import { ClassGenContext, registry } from '../../registry';
import {
  prepareTailwindBorderClassesForSide,
} from '../../utils';
import { BorderPanel } from './panel';

const BORDER_MAPPING: Record<string, string> = {
  top: 'border-t',
  right: 'border-r',
  bottom: 'border-b',
  left: 'border-l',
};

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
  panelTitle: 'Border Settings',
  panelPriority: 30,
  attributeKey: 'border',
  supportKey: ['border', 'borderRadius'],
  attributeSchema: {
    border: { type: 'object', default: {} },
  },
  PanelComponent: BorderPanel,
  generateClasses: generateBorderClasses,
  hasActiveSettings: hasBorderActiveSettings,
});
