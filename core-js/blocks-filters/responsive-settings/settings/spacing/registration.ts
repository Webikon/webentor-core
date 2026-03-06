/**
 * Spacing module registration.
 *
 * panelGroup: spacing, order: 10
 * Handles margin and padding properties.
 * Unchanged between v1 and v2 — attribute key 'spacing' stays the same.
 */
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import { hasSpacingSettingsForBreakpoint } from './properties';
import { SpacingSettings } from './settings';

const generateSpacingClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  _context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.spacing) return classes;

  for (const [propName, prop] of Object.entries(attributes.spacing)) {
    if (propName.startsWith('_')) continue;
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

registry.register({
  name: 'spacing',
  panelGroup: 'spacing',
  order: 10,
  attributeKey: 'spacing',
  supportKey: 'spacing',
  attributeSchema: {
    spacing: {
      type: 'object',
      default: {},
    },
  },
  SettingsComponent: SpacingSettings,
  generateClasses: generateSpacingClasses,
  hasActiveSettings: hasSpacingSettingsForBreakpoint,
});
