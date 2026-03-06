/**
 * Layout module registration.
 *
 * panelGroup: displayLayout, order: 10
 * Handles the CSS display property (block/flex/grid/hidden/etc).
 * Support key: 'layout'
 */
import { getDisplayValue, getEffectiveDisplayValue } from '../../migration';
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';
import { hasLayoutSettingsForBreakpoint } from './properties';
import { LayoutSettings } from './settings';

const generateLayoutClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  context: ClassGenContext,
): string[] => {
  const classes: string[] = [];
  const displayValue = getDisplayValue(attributes, breakpoint);

  if (!displayValue) return classes;

  // Skip when slider is enabled at this breakpoint
  if (attributes?.slider?.enabled?.value?.[breakpoint]) return classes;

  const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;

  // 'hidden' maps to opacity-30 in the editor (visual indicator rather than true hide)
  if (displayValue === 'hidden') {
    classes.push(`${twBreakpoint}opacity-30`);
  } else {
    classes.push(`${twBreakpoint}${displayValue}`);

    // Reset opacity when transitioning from hidden to visible across breakpoints.
    // Without this, opacity-30 from a lower breakpoint would persist even after
    // the display is overridden to a non-hidden value at a higher breakpoint.
    const bpIndex = context.breakpoints.indexOf(breakpoint);
    if (bpIndex > 0) {
      const prevBp = context.breakpoints[bpIndex - 1];
      const prevEffective = getEffectiveDisplayValue(
        attributes,
        prevBp,
        context.breakpoints,
      );
      if (prevEffective === 'hidden') {
        classes.push(`${twBreakpoint}opacity-100`);
      }
    }
  }

  return classes;
};

registry.register({
  name: 'layout',
  panelGroup: 'displayLayout',
  order: 10,
  attributeKey: 'layout',
  supportKey: 'layout',
  attributeSchema: {
    layout: { type: 'object', default: {} },
  },
  initAttributes: (settings, _name) => {
    const webentorSupport = settings?.supports?.webentor;
    const displaySupport =
      webentorSupport?.layout === true ||
      webentorSupport?.layout?.display === true;

    if (displaySupport) {
      const defaultValue = {
        display: {
          value: {
            basic: 'flex',
            ...settings?.attributes?.layout?.default?.display?.value,
          },
        },
      };

      settings.attributes = {
        ...settings.attributes,
        layout: {
          type: 'object',
          default: {
            ...settings?.attributes?.layout?.default,
            ...defaultValue,
          },
        },
      };
    }
    return settings;
  },
  SettingsComponent: LayoutSettings,
  generateClasses: generateLayoutClasses,
  hasActiveSettings: hasLayoutSettingsForBreakpoint,
});
