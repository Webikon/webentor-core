/**
 * Display value helpers.
 *
 * Generic (non-display) cascade utilities live in utils.ts.
 */

/**
 * Resolve the "display" value for a given breakpoint (explicit only, no cascade).
 *
 * This is the canonical way to read the display mode for modules that need it
 * (flexbox, grid, flex-item, grid-item).
 */
export const getDisplayValue = (
  attributes: Record<string, any>,
  breakpoint: string,
): string | undefined => {
  return attributes?.layout?.display?.value?.[breakpoint];
};

/**
 * Resolve the parent display value for a given breakpoint (explicit only).
 */
export const getParentDisplayValue = (
  parentAttributes: Record<string, any> | undefined,
  breakpoint: string,
): string | undefined => {
  if (!parentAttributes) return undefined;
  return getDisplayValue(parentAttributes, breakpoint);
};

// ─── Display-specific cascade ───────────────────────────────────────

/**
 * Cascaded display value — walks breakpoints and returns the effective
 * display mode at the given breakpoint.
 */
export const getEffectiveDisplayValue = (
  attributes: Record<string, any>,
  breakpoint: string,
  breakpoints: string[],
): string | undefined => {
  const targetIndex = breakpoints.indexOf(breakpoint);
  if (targetIndex === -1) return undefined;
  let effective: string | undefined;
  for (let i = 0; i <= targetIndex; i++) {
    const val = getDisplayValue(attributes, breakpoints[i]);
    if (val !== undefined && val !== '') effective = val;
  }
  return effective;
};

/**
 * Cascaded parent display value — same cascade logic applied to
 * the parent block's attributes.
 */
export const getEffectiveParentDisplayValue = (
  parentAttributes: Record<string, any> | undefined,
  breakpoint: string,
  breakpoints: string[],
): string | undefined => {
  if (!parentAttributes) return undefined;
  return getEffectiveDisplayValue(parentAttributes, breakpoint, breakpoints);
};

/**
 * Display-specific inheritance source.
 * Returns the breakpoint name the display value cascades from,
 * or null if explicitly set at the current breakpoint.
 */
export const getDisplayInheritedFromBreakpoint = (
  attributes: Record<string, any>,
  breakpoint: string,
  breakpoints: string[],
): string | null => {
  const targetIndex = breakpoints.indexOf(breakpoint);
  if (targetIndex === -1) return null;

  const explicitVal = getDisplayValue(attributes, breakpoint);
  if (explicitVal !== undefined && explicitVal !== '') return null;

  for (let i = targetIndex - 1; i >= 0; i--) {
    const val = getDisplayValue(attributes, breakpoints[i]);
    if (val !== undefined && val !== '') return breakpoints[i];
  }
  return null;
};
