/**
 * Flexbox container module registration.
 *
 * panelGroup: displayLayout, order: 30
 * Contextual: only renders when display=flex at the active breakpoint.
 * Support key: 'flexbox'
 */
import { getEffectiveDisplayValue } from '../../migration';
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import { getFlexboxProperties } from './properties';
import { FlexboxSettings } from './settings';

export const generateFlexboxClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.flexbox) return classes;

  // Cascaded display check: flexbox classes apply when effective display is 'flex'
  const effectiveDisplay = getEffectiveDisplayValue(
    attributes,
    breakpoint,
    context.breakpoints,
  );
  if (effectiveDisplay !== 'flex') return classes;

  for (const [, prop] of Object.entries(attributes.flexbox)) {
    const propData = prop as any;
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;
    if (attributes?.slider?.enabled?.value?.[breakpoint]) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;
    classes.push(`${twBreakpoint}${bpValue}`);
  }

  return classes;
};

const hasFlexboxActiveSettings = (
  attributes: Record<string, any>,
  breakpoint: string,
): boolean => {
  const flexboxProps = getFlexboxProperties({} as any);
  return flexboxProps.some(
    (p) => !!attributes?.flexbox?.[p.name]?.value?.[breakpoint],
  );
};

registry.register({
  name: 'flexbox',
  panelGroup: 'displayLayout',
  order: 30,
  attributeKey: 'flexbox',
  supportKey: 'flexbox',
  attributeSchema: {
    flexbox: { type: 'object', default: {} },
  },
  SettingsComponent: FlexboxSettings,
  generateClasses: generateFlexboxClasses,
  hasActiveSettings: hasFlexboxActiveSettings,
});
