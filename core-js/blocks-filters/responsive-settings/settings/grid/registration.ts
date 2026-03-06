/**
 * Grid container module registration.
 *
 * panelGroup: displayLayout, order: 40
 * Contextual: only renders when display=grid at the active breakpoint.
 * Support key: 'grid'
 */
import { getEffectiveDisplayValue } from '../../migration';
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import { GRID_PROPERTY_NAMES } from './properties';
import { GridSettings } from './settings';

export const generateGridClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.grid) return classes;

  // Cascaded display check: grid classes apply when effective display is 'grid'
  const effectiveDisplay = getEffectiveDisplayValue(
    attributes,
    breakpoint,
    context.breakpoints,
  );
  if (effectiveDisplay !== 'grid') return classes;

  for (const [, prop] of Object.entries(attributes.grid)) {
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

const hasGridActiveSettings = (
  attributes: Record<string, any>,
  breakpoint: string,
): boolean => {
  return GRID_PROPERTY_NAMES.some(
    (propName) => !!attributes?.grid?.[propName]?.value?.[breakpoint],
  );
};

registry.register({
  name: 'grid',
  panelGroup: 'displayLayout',
  order: 40,
  attributeKey: 'grid',
  supportKey: 'grid',
  attributeSchema: {
    grid: { type: 'object', default: {} },
  },
  SettingsComponent: GridSettings,
  generateClasses: generateGridClasses,
  hasActiveSettings: hasGridActiveSettings,
});
