/**
 * Support key normalizer for backward compatibility.
 *
 * Old block.json files use keys like `display: true` (which covered both
 * layout mode and sizing) and `flexboxItem`. New block.json files use
 * separate `layout`, `sizing`, and `flexItem` keys.
 *
 * This normalizer runs early in both the JS attribute injection filter
 * and PHP class generation so downstream code only deals with v2 key names.
 *
 * Mapping:
 * - display: true        → layout: true + sizing: true
 * - display: { display }  → layout: { display }
 * - display: { height }   → sizing: { height }
 * - display: { display, width } → layout: { display } + sizing: { width }
 * - flexboxItem            → flexItem
 * - All other keys         → unchanged
 */

/** Properties that map to the layout module */
const LAYOUT_SUBKEYS = ['display'];

/** Properties that map to the sizing module */
const SIZING_SUBKEYS = [
  'height',
  'minHeight',
  'maxHeight',
  'width',
  'minWidth',
  'maxWidth',
];

/**
 * Normalize supports.webentor from old (v1) to new (v2) key structure.
 * Returns a new object — does NOT mutate the input.
 *
 * Accepts both old and new keys; when both are present, new keys take priority.
 */
export const resolveSupportKeys = (
  webentorSupports: Record<string, any> | undefined,
): Record<string, any> => {
  if (!webentorSupports) return {};

  const resolved = { ...webentorSupports };

  // ── Expand `display` into `layout` + `sizing` ──────────────────
  if ('display' in resolved) {
    const displaySupport = resolved.display;

    if (displaySupport === true) {
      // display: true → enable both layout and sizing
      if (!('layout' in resolved)) resolved.layout = true;
      if (!('sizing' in resolved)) resolved.sizing = true;
    } else if (typeof displaySupport === 'object' && displaySupport !== null) {
      // Granular: split sub-properties into layout vs sizing
      const layoutSub: Record<string, boolean> = {};
      const sizingSub: Record<string, boolean> = {};

      for (const [key, value] of Object.entries(displaySupport)) {
        if (LAYOUT_SUBKEYS.includes(key)) {
          layoutSub[key] = value as boolean;
        } else if (SIZING_SUBKEYS.includes(key)) {
          sizingSub[key] = value as boolean;
        }
      }

      if (Object.keys(layoutSub).length > 0 && !('layout' in resolved)) {
        resolved.layout = layoutSub;
      }
      if (Object.keys(sizingSub).length > 0 && !('sizing' in resolved)) {
        resolved.sizing = sizingSub;
      }
    }

    // Keep the old `display` key so existing code doesn't break during transition
  }

  // ── Rename flexboxItem → flexItem ──────────────────────────────
  if ('flexboxItem' in resolved && !('flexItem' in resolved)) {
    resolved.flexItem = resolved.flexboxItem;
    // Keep old key for transition
  }

  return resolved;
};

/**
 * Check if a specific support key is enabled, handling both
 * boolean `true` and object `{ subProperty: true }` forms.
 */
export const isSupportEnabled = (
  webentorSupports: Record<string, any> | undefined,
  key: string,
  subKey?: string,
): boolean => {
  const resolved = resolveSupportKeys(webentorSupports);
  const value = resolved[key];

  if (!value) return false;
  if (value === true) return true;
  if (subKey && typeof value === 'object') return !!value[subKey];

  // If it's an object and no subKey requested, it's enabled at group level
  return typeof value === 'object';
};
