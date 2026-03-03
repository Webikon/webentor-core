import { ClassGenContext, registry } from '../../registry';
import { SpacingPanel } from './panel';
import { hasSpacingSettingsForBreakpoint } from './properties';

const generateSpacingClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  _context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.spacing) return classes;

  for (const [, prop] of Object.entries(attributes.spacing)) {
    const propData = prop as any;
    // Skip link-mode metadata keys
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;

    // Skip when slider is enabled
    if (attributes?.slider?.enabled?.value?.[breakpoint]) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;
    classes.push(`${twBreakpoint}${bpValue}`);
  }

  return classes;
};

registry.register({
  name: 'spacing',
  panelTitle: 'Spacing Settings',
  panelPriority: 10,
  attributeKey: 'spacing',
  supportKey: 'spacing',
  attributeSchema: {
    spacing: {
      type: 'object',
      default: {},
    },
  },
  PanelComponent: SpacingPanel,
  generateClasses: generateSpacingClasses,
  hasActiveSettings: hasSpacingSettingsForBreakpoint,
});
