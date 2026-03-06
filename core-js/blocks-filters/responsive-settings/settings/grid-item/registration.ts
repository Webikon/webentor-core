/**
 * Grid-item module registration.
 *
 * panelGroup: displayLayout, order: 60
 * Contextual: only shows when parent block display=grid.
 * Support key: 'gridItem'
 */
import { getEffectiveParentDisplayValue } from '../../migration';
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import { GRID_ITEM_PROPERTY_NAMES } from './properties';
import { GridItemSettings } from './settings';

export const generateGridItemClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.gridItem) return classes;

  // Cascaded parent display check
  const effectiveParentDisplay = getEffectiveParentDisplayValue(
    context.parentBlockAttributes,
    breakpoint,
    context.breakpoints,
  );
  if (effectiveParentDisplay !== 'grid') return classes;

  for (const [, prop] of Object.entries(attributes.gridItem)) {
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

const hasGridItemActiveSettings = (
  attributes: Record<string, any>,
  breakpoint: string,
  context?: ClassGenContext,
): boolean => {
  const effectiveParentDisplay = getEffectiveParentDisplayValue(
    context?.parentBlockAttributes,
    breakpoint,
    context?.breakpoints ?? [],
  );
  if (effectiveParentDisplay !== 'grid') return false;

  return GRID_ITEM_PROPERTY_NAMES.some(
    (prop) => !!attributes?.gridItem?.[prop]?.value?.[breakpoint],
  );
};

registry.register({
  name: 'gridItem',
  panelGroup: 'displayLayout',
  order: 60,
  attributeKey: 'gridItem',
  supportKey: 'gridItem',
  attributeSchema: {
    gridItem: { type: 'object', default: {} },
  },
  SettingsComponent: GridItemSettings,
  generateClasses: generateGridItemClasses,
  hasActiveSettings: hasGridItemActiveSettings,
});
