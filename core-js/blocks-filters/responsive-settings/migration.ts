/**
 * Display value helpers — v1/v2 dual-read accessors.
 *
 * On-load migration has been removed from JS (handled globally in PHP).
 * These helpers remain because modules (flexbox, grid, flex-item, grid-item)
 * need to read the display mode and the v1 `display` key may still exist
 * on blocks until all v1 remnants are cleaned up.
 *
 * Generic (non-display) cascade utilities live in utils.ts.
 * See migration-cleanup.md for the full list of v1 fallbacks to remove later.
 */

/**
 * Resolve the "display" value for a given breakpoint (explicit only, no cascade).
 * Works with both v1 and v2 attribute structures by checking
 * layout.display first, then falling back to display.display.
 *
 * This is the canonical way to read the display mode — all modules
 * (flexbox, grid, flex-item, grid-item) should use this instead of
 * directly accessing attributes.display.display.
 */
export const getDisplayValue = (
  attributes: Record<string, any>,
  breakpoint: string,
): string | undefined => {
  return (
    attributes?.layout?.display?.value?.[breakpoint] ??
    attributes?.display?.display?.value?.[breakpoint]
  );
};

/**
 * Resolve the parent display value for a given breakpoint (explicit only).
 * Same dual-read logic for parent block attributes.
 */
export const getParentDisplayValue = (
  parentAttributes: Record<string, any> | undefined,
  breakpoint: string,
): string | undefined => {
  if (!parentAttributes) return undefined;
  return getDisplayValue(parentAttributes, breakpoint);
};

// ─── Display-specific cascade (v1/v2 aware) ────────────────────────

/**
 * Cascaded display value — walks breakpoints and returns the effective
 * display mode at the given breakpoint. Handles v1/v2 dual-read by
 * checking both layout.display and display.display at each level.
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
 * Display-specific inheritance source — checks both v1/v2 keys.
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
