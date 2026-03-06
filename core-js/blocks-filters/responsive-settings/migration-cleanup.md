# V1 Fallback Cleanup Checklist

This file documents every v1 backward-compatibility remnant in the JS
responsive settings codebase. Once the global PHP migration has run on all
sites and all blocks are confirmed v2, remove each item below.

---

## `display` attribute key (v1 → v2 `layout` + `sizing`)

### migration.ts

- `getDisplayValue()` falls back to `attributes.display.display.value[bp]`.
  **Action:** Remove the `?? attributes?.display?.display?.value?.[breakpoint]` fallback.
- `getParentDisplayValue()` delegates to `getDisplayValue` — no separate change needed.

### types/index.ts

- `BlockAttributes` interface has `display?: ResponsiveAttribute`.
  **Action:** Remove the `display` field.

### index.tsx

- `_responsiveSettingsVersion` injection guard checks `settings.attributes?.display ||`.
  **Action:** Remove the `display` check, keep only `settings.attributes?.layout`.

### settings/layout/registration.ts

- `attributeSchema` registers `display: { type: 'object', default: {} }`.
  **Action:** Remove the `display` schema entry.
- `initAttributes` sets defaults on both `layout` AND `display` keys.
  **Action:** Remove all `display` default-setting logic (lines referencing `settings.attributes.display`).
- `generateLayoutClasses` reads v1 `attributes.display` for sizing property classes (lines 38-49).
  **Action:** Remove the entire `displayAttr` loop (sizing classes come from the sizing module).

### settings/layout/settings.tsx

- Guard checks `!attributes?.layout && !attributes?.display`.
  **Action:** Simplify to `!attributes?.layout`.
- `attributeKey` fallback: `attributes?.layout ? 'layout' : 'display'`.
  **Action:** Hardcode `'layout'`.

### settings/layout/properties.ts

- `hasLayoutSettingsForBreakpoint` checks `!!attributes?.display?.[prop]?.value?.[breakpoint]` when `!isV2`.
  **Action:** Remove the `!isV2` branch and the `display` check entirely.

### settings/sizing/registration.ts

- `generateSizingClasses` reads `attributes?.display || {}` as fallback.
  **Action:** Remove the `displayAttr` fallback; only read from `attributes.sizing`.

### settings/sizing/settings.tsx

- Guard checks `!attributes?.sizing && !attributes?.display`.
  **Action:** Simplify to `!attributes?.sizing`.
- `attributeKey` fallback: `attributes?.sizing ? 'sizing' : 'display'`.
  **Action:** Hardcode `'sizing'`.

### settings/sizing/properties.ts

- `hasSizingSettingsForBreakpoint` checks `!!attributes?.display?.[prop]?.value?.[breakpoint]` when `!isV2`.
  **Action:** Remove the `!isV2` branch and the `display` check entirely.

---

## `flexboxItem` attribute key (v1 → v2 `flexItem`)

### types/index.ts

- `BlockAttributes` interface has `flexboxItem?: ResponsiveAttribute`.
  **Action:** Remove the `flexboxItem` field.

### settings/flex-item/registration.ts

- Reads `attributes?.flexItem || attributes?.flexboxItem` in `generateFlexItemClasses` and `hasFlexItemActiveSettings`.
  **Action:** Remove `|| attributes?.flexboxItem` fallbacks.
- `attributeSchema` registers `flexboxItem: { type: 'object', default: {} }`.
  **Action:** Remove the `flexboxItem` schema entry.
- `supportKey` includes `'flexboxItem'`.
  **Action:** Change to `supportKey: 'flexItem'`.

### settings/flex-item/settings.tsx

- Guard checks `attributes?.flexItem || attributes?.flexboxItem`.
  **Action:** Simplify to `attributes?.flexItem`.
- `attributeKey` fallback: `attributes?.flexItem ? 'flexItem' : 'flexboxItem'`.
  **Action:** Hardcode `'flexItem'`.

---

## Support key normalization

### support-keys.ts

- Normalizes `display` → `layout` + `sizing` and `flexboxItem` → `flexItem`.
  **Action:** Remove the normalization logic once all `block.json` files use v2 keys exclusively.

### constants.ts

- `includedBlocks` map has `flexboxItem: []`.
  **Action:** Remove the `flexboxItem` entry.

---

## Debug / diagnostic

### components/DebugPanel.tsx

- `ATTRIBUTE_KEYS` includes `'display'` and `'flexboxItem'`.
  **Action:** Remove both entries once v1 keys are fully dropped.

---

## PHP side (out of scope for this file, tracked separately)

- `blocks-settings.php` has its own v1 handler registration and `resolve_support_keys()`.
  Coordinate JS and PHP v1 removal together to avoid mismatches.
