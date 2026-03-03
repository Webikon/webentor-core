import { ClassGenContext } from '../../../registry';

export const generateFlexboxClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  _context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.flexbox) return classes;

  for (const [, prop] of Object.entries(attributes.flexbox)) {
    const propData = prop as any;
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;

    // Flexbox classes only apply when display is 'flex' at this breakpoint
    if (attributes?.display?.display?.value?.[breakpoint] !== 'flex') continue;
    if (attributes?.slider?.enabled?.value?.[breakpoint]) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;
    classes.push(`${twBreakpoint}${bpValue}`);
  }

  return classes;
};

export const generateFlexboxItemClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.flexboxItem) return classes;

  for (const [, prop] of Object.entries(attributes.flexboxItem)) {
    const propData = prop as any;
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;

    // Flexbox item classes only apply when parent display is 'flex'
    const parentDisplay =
      context.parentBlockAttributes?.display?.display?.value?.[breakpoint];
    if (parentDisplay !== 'flex') continue;
    if (attributes?.slider?.enabled?.value?.[breakpoint]) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;
    classes.push(`${twBreakpoint}${bpValue}`);
  }

  return classes;
};
