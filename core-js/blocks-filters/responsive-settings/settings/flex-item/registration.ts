/**
 * Flex-item module registration.
 *
 * panelGroup: displayLayout, order: 50
 * Contextual: only shows when parent block display=flex.
 * Support key: 'flexItem'
 */
import { getEffectiveParentDisplayValue } from '../../migration';
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import { FLEX_ITEM_PROPERTY_NAMES } from './properties';
import { FlexItemSettings } from './settings';

export const generateFlexItemClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  const flexItemAttr = attributes?.flexItem || attributes?.flexboxItem;
  if (!flexItemAttr) return classes;

  // Cascaded parent display check
  const effectiveParentDisplay = getEffectiveParentDisplayValue(
    context.parentBlockAttributes,
    breakpoint,
    context.breakpoints,
  );
  if (effectiveParentDisplay !== 'flex') return classes;

  for (const [, prop] of Object.entries(flexItemAttr)) {
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

const hasFlexItemActiveSettings = (
  attributes: Record<string, any>,
  breakpoint: string,
  context?: ClassGenContext,
): boolean => {
  const effectiveParentDisplay = getEffectiveParentDisplayValue(
    context?.parentBlockAttributes,
    breakpoint,
    context?.breakpoints ?? [],
  );
  if (effectiveParentDisplay !== 'flex') return false;

  const flexItemAttr = attributes?.flexItem || attributes?.flexboxItem;
  if (!flexItemAttr) return false;

  return FLEX_ITEM_PROPERTY_NAMES.some(
    (prop) => !!flexItemAttr[prop]?.value?.[breakpoint],
  );
};

registry.register({
  name: 'flexItem',
  panelGroup: 'displayLayout',
  order: 50,
  attributeKey: 'flexItem',
  supportKey: 'flexItem',
  attributeSchema: {
    flexItem: { type: 'object', default: {} },
  },
  SettingsComponent: FlexItemSettings,
  generateClasses: generateFlexItemClasses,
  hasActiveSettings: hasFlexItemActiveSettings,
});
