/**
 * Sizing module registration.
 *
 * panelGroup: displayLayout, order: 20
 * Handles width, height, min/max dimensions.
 * Support key: 'sizing'
 */
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import { hasSizingSettingsForBreakpoint, SIZING_PROPERTY_NAMES } from './properties';
import { SizingSettings } from './settings';

const generateSizingClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  _context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  // Read from v2 'sizing' key, fallback to v1 'display' key
  const sizingAttr = attributes?.sizing || {};
  const displayAttr = attributes?.display || {};

  for (const propName of SIZING_PROPERTY_NAMES) {
    // Prefer v2 key, then v1 fallback
    const propData = sizingAttr[propName] || displayAttr[propName];
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;

    if (attributes?.slider?.enabled?.value?.[breakpoint]) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;
    classes.push(`${twBreakpoint}${bpValue}`);
  }

  return classes;
};

registry.register({
  name: 'sizing',
  panelGroup: 'displayLayout',
  order: 20,
  attributeKey: 'sizing',
  supportKey: 'sizing',
  attributeSchema: {
    sizing: { type: 'object', default: {} },
  },
  SettingsComponent: SizingSettings,
  generateClasses: generateSizingClasses,
  hasActiveSettings: hasSizingSettingsForBreakpoint,
});
