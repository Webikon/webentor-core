import { ClassGenContext } from '../../../registry';

export const generateDisplayClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  _context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (!attributes.display) return classes;

  for (const [, prop] of Object.entries(attributes.display)) {
    const propData = prop as any;
    if (!propData?.value) continue;
    const bpValue = propData.value[breakpoint];
    if (!bpValue) continue;

    if (attributes?.slider?.enabled?.value?.[breakpoint]) continue;

    const twBreakpoint = breakpoint === 'basic' ? '' : `${breakpoint}:`;
    if (bpValue === 'hidden') {
      classes.push(`${twBreakpoint}opacity-30`);
    } else {
      classes.push(`${twBreakpoint}${bpValue}`);
    }
  }

  return classes;
};
