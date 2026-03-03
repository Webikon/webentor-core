import { ClassGenContext } from '../../../registry';

export const generateGridClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  _context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.grid) return classes;

  for (const [, prop] of Object.entries(attributes.grid)) {
    const propData = prop as any;
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;

    // Grid classes only apply when display is 'grid' at this breakpoint
    if (attributes?.display?.display?.value?.[breakpoint] !== 'grid') continue;
    if (attributes?.slider?.enabled?.value?.[breakpoint]) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;
    classes.push(`${twBreakpoint}${bpValue}`);
  }

  return classes;
};

export const generateGridItemClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.gridItem) return classes;

  for (const [, prop] of Object.entries(attributes.gridItem)) {
    const propData = prop as any;
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;

    // Grid item classes only apply when parent display is 'grid'
    const parentDisplay =
      context.parentBlockAttributes?.display?.display?.value?.[breakpoint];
    if (parentDisplay !== 'grid') continue;
    if (attributes?.slider?.enabled?.value?.[breakpoint]) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;
    classes.push(`${twBreakpoint}${bpValue}`);
  }

  return classes;
};
