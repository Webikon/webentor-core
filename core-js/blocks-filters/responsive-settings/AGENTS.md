# Responsive Settings — AI Guide

This file documents the architecture, data flow, and conventions of the
responsive settings system so AI agents can work on it without re-exploring.

## Purpose

Provides per-breakpoint (responsive) block controls in the WordPress editor
sidebar. Users can configure spacing, display mode, sizing, flexbox, grid,
flex/grid item behaviour, borders, and presets — all with breakpoint tabs
(`basic`, `sm`, `md`, `lg`, `xl`, `2xl`). Values are stored as Tailwind
class names and output as CSS classes on the block wrapper.

## File Structure

```
responsive-settings/
  index.tsx              — Entry point: attribute filter, registerBlockExtension, BlockEdit
  registry.ts            — SettingsRegistry singleton (Map-based, panelGroup queries)
  migration.ts           — Display value helpers (v1/v2 dual-read); on-load migrator removed (PHP handles it)
  migration-cleanup.md   — Checklist of all remaining v1 fallbacks to remove later
  support-keys.ts        — Normalizes v1 support keys to v2 (display→layout+sizing, flexboxItem→flexItem)
  utils.ts               — Class generation orchestrator + border preview helpers + generic breakpoint cascade utilities
  constants.ts           — Legacy includedBlocks map (currently empty, kept for fallback)
  types/index.ts         — All TypeScript interfaces (SettingDefinition, PanelGroup, BlockAttributes, etc.)

  panels/                — Thin PanelBody wrappers, one per UI panel
    SpacingPanel.tsx      — panelGroup='spacing'
    DisplayLayoutPanel.tsx — panelGroup='displayLayout' (presets rendered above tabs)
    BorderPanel.tsx       — panelGroup='border'
    BlockLinkPanel.tsx    — panelGroup='blockLink' (standalone, no breakpoint tabs)
    index.ts

  components/            — Shared UI components
    ResponsiveTabPanel.tsx    — Breakpoint tab wrapper with active-settings indicator
    ResponsiveSelectGroup.tsx — Generic SelectControl list renderer (+ optgroup support)
    BreakpointResetButton.tsx — Per-breakpoint "Reset" button inside tabs
    DebugPanel.tsx            — JSON attribute inspector (gated by window flag)
    BoxModelControl.tsx       — Margin/padding box-model layout with link modes
    LinkedValuesControl.tsx   — Link/unlink toggle + reset button
    DisabledSliderInfo.tsx    — Info message when slider overrides settings
    LayoutModeSettings.tsx    — Backward-compat container+item layout component
    InheritedIndicator.tsx    — "Inherited from {breakpoint}" label for cascaded settings

  settings/
    presets/              — Quick layout presets (panelGroup: displayLayout, order: 0)
    layout/               — Display mode: flex/grid/block/hidden (panelGroup: displayLayout, order: 10)
    sizing/               — Width/height/min/max dimensions (panelGroup: displayLayout, order: 20)
    flexbox/              — Flexbox container controls (panelGroup: displayLayout, order: 30)
    grid/                 — Grid container controls (panelGroup: displayLayout, order: 40)
    flex-item/            — Flex child controls (panelGroup: displayLayout, order: 50)
    grid-item/            — Grid child controls (panelGroup: displayLayout, order: 60)
    spacing/              — Margin/padding (panelGroup: spacing, order: 10)
    border/               — Border + border-radius (panelGroup: border, order: 10)
    block-link/           — Block link (panelGroup: blockLink, order: 100)
    shared/               — Shared value generators (gap-values, layout-values, tw-values)
```

## Architecture

### Two-Layer Pattern: Panel Groups + Setting Modules

The UI has **4 collapsible panels** (SpacingPanel, DisplayLayoutPanel, BorderPanel, BlockLinkPanel).
Internally, the code is modular: each setting module is self-contained and
declares which `panelGroup` it belongs to.

Panel components are thin wrappers: they render a `PanelBody` with
`ResponsiveTabPanel` tabs, query the registry for all modules in their
`panelGroup` (sorted by `order`), and render each module's `SettingsComponent`.

### SettingsRegistry (`registry.ts`)

Singleton `Map<string, SettingDefinition>`. Modules self-register via
side-effect imports in their `registration.ts` files.

Key methods:
- `register(def)` — add a setting module
- `getAll()` — all modules sorted by order
- `getByPanelGroup(group)` — modules for a specific panel
- `isSupported(supports, def)` — check if a block supports a setting

### SettingDefinition Interface

```typescript
{
  name: string;                    // e.g. 'layout', 'sizing', 'flexbox'
  panelGroup: PanelGroup;          // 'spacing' | 'displayLayout' | 'border'
  order: number;                   // render order within panel (lower = higher)
  attributeKey: string;            // WP attribute key (e.g. 'layout', 'spacing')
  supportKey: string | string[];   // webentor.* support flag(s)
  attributeSchema: object;         // WP attribute schema
  initAttributes?: Function;       // custom attribute defaults (e.g. flex default)
  SettingsComponent: React.FC;     // renders inline within the panel
  generateClasses: Function;       // Tailwind class array per breakpoint
  hasActiveSettings: Function;     // tab indicator (breakpoint has values?)
  migrateFromV1?: Function;        // optional per-module migration
}
```

### Data Flow

1. **Attribute injection** (`blocks.registerBlockType` filter in `index.tsx`):
   - Iterates all registered modules
   - Checks `supports.webentor.*` against each module's `supportKey`
   - Merges attribute schemas into the block
   - Runs `initAttributes` for defaults (e.g. `layout.display = 'flex'`)

2. **Editor rendering** (`BlockEdit` in `index.tsx`):
   - Renders SpacingPanel, DisplayLayoutPanel, BorderPanel, BlockLinkPanel
   - Each panel queries registry and renders SettingsComponents
   - v1→v2 migration is handled globally in PHP (no JS on-load migrator)

3. **Class generation** (`generateClassNames` in `utils.ts`):
   - Called by `registerBlockExtension` classNameGenerator hook
   - Collects breakpoints from all attribute values
   - Calls each module's `generateClasses(attributes, breakpoint, context)` per breakpoint
   - Concatenates results

4. **PHP class generation** (`blocks-settings.php`):
   - `SettingsRegistry::generateClasses()` iterates registered handlers
   - Each handler reads attribute values and generates Tailwind classes
   - `prepareBlockClassesFromSettings()` orchestrates all handlers

## Attribute Shape

All responsive values follow the same pattern:

```
attributes.{attributeKey}.{propertyName}.value.{breakpoint} = "tailwind-class"
```

Example:
```json
{
  "layout": { "display": { "value": { "basic": "flex", "md": "grid" } } },
  "spacing": { "margin-top": { "value": { "basic": "mt-4", "lg": "mt-8" } } },
  "border": { "border": { "value": { "basic": { "top": { "width": "1", "style": "solid", "color": "black" }, "linked": true } } } }
}
```

## v1 → v2 Migration

### Attribute Key Changes

| v1 Key | v2 Key | Notes |
|--------|--------|-------|
| `display.display` | `layout.display` | Display mode |
| `display.height/width/min-*/max-*` | `sizing.*` | Sizing properties |
| `flexboxItem` | `flexItem` | Renamed |
| `spacing`, `grid`, `gridItem`, `flexbox`, `border` | unchanged | |

### How It Works

- v1→v2 migration is handled globally in PHP (JS on-load migrator has been removed)
- `_responsiveSettingsVersion` attribute: absent/1 = v1, 2 = v2
- `getDisplayValue()` / `getParentDisplayValue()` are the canonical way to read display mode — they check v2 key first, fall back to v1
- v1 fallbacks still exist in the JS codebase for safety; see `migration-cleanup.md` for the full removal checklist

### Support Key Normalization

`support-keys.ts` → `resolveSupportKeys()` (JS) / `resolve_support_keys()` (PHP):

- `display: true` → `layout: true` + `sizing: true`
- `display: { display: true, width: true }` → `layout: { display }` + `sizing: { width }`
- `flexboxItem` → `flexItem`
- Old keys kept alongside new ones

## PHP Side (`app/blocks-settings.php`)

- `SettingsRegistry` class mirrors the JS pattern
- `resolve_support_keys()` mirrors JS `resolveSupportKeys()`
- `get_display_value_for_breakpoint()` helper for v2/v1 dual reading (explicit only)
- `get_effective_display_value_for_breakpoint()` cascaded display (min-width inheritance)
- `get_effective_parent_display_value_for_breakpoint()` cascaded parent display
- Handlers: `prepareLayoutBlockClassesFromSettings`, `prepareSizingBlockClassesFromSettings`,
  `prepareFlexItemBlockClassesFromSettings` (new), plus unchanged handlers for spacing,
  grid, gridItem, flexbox, border
- `prepareBlockClassesFromSettings()` also outputs `_presetClasses` directly

## Presets

Defined in `settings/presets/presets.ts` as `LayoutPreset[]`. Each preset
specifies `applies` (attribute values per module) and optional `customClasses`
for edge cases that need non-Tailwind CSS (e.g. flex-wrap + gap + equal columns).

Selecting a preset fills in the individual settings (which remain editable)
and stores `_preset` (ID marker) and `_presetClasses` (custom CSS classes).

Custom CSS utilities for presets live in `resources/styles/common/_utilities.css`:
- `.w-flex-cols` — flex container with wrapping
- `.w-flex-cols-{2-6}` — sets child width via `calc()` accounting for gap
- `.w-gap-{0-12}` — gap + `--w-col-gap` CSS var

## Block.json Support Keys

### v2 Keys (preferred for new blocks)

```json
"webentor": {
  "spacing": true,
  "layout": true,
  "sizing": true,
  "grid": true,
  "gridItem": true,
  "flexbox": true,
  "flexItem": true,
  "border": true,
  "borderRadius": true,
  "blockLink": true,
  "presets": true
}
```

### v1 Keys (still accepted, auto-normalized)

```json
"webentor": {
  "display": true,        // → layout + sizing
  "display": { "display": true, "width": true },  // → granular split
  "flexboxItem": true     // → flexItem
}
```

## JSON Schema

`schemas/webentor-block.json` defines both v1 and v2 keys under `supports.webentor`.
Old keys are marked deprecated in their descriptions.

## Contextual Rendering Rules

Display checks use **breakpoint cascading** (min-width inheritance): if `display=flex`
is set at `basic`, flexbox settings are visible at `sm`, `md`, etc. even without an
explicit value, because the effective display cascades from `basic`. An
`InheritedIndicator` label is shown when the value is inherited.

- **Flexbox settings**: show when **effective** `display=flex` at the active breakpoint
- **Grid settings**: show when **effective** `display=grid` at the active breakpoint
- **Flex-item settings**: show when **parent** block's **effective** `display=flex`
- **Grid-item settings**: show when **parent** block's **effective** `display=grid`
- **Slider override**: when `slider.enabled=true` at a breakpoint, display/flexbox/spacing settings are disabled

### Generic Cascade Functions (`utils.ts`)

| Function | Purpose |
|----------|---------|
| `getEffectiveValue(attrs, attrKey, prop, bp, bps)` | Generic cascade for any string attribute property |
| `getInheritedFromBreakpoint(attrs, attrKey, prop, bp, bps)` | Source breakpoint for inheritance (UI indicator) |
| `getEffectiveObjectValue(attrs, attrKey, prop, bp, bps)` | Cascade for object-typed values (borders, radius) |
| `getObjectInheritedFromBreakpoint(attrs, attrKey, prop, bp, bps)` | Source breakpoint for inherited object values |

### Display Cascade Functions (`migration.ts`, v1/v2 aware)

| Function | Purpose |
|----------|---------|
| `getEffectiveDisplayValue(attrs, bp, bps)` | Cascaded display mode (v1/v2 dual-read) |
| `getEffectiveParentDisplayValue(parentAttrs, bp, bps)` | Cascaded parent display |
| `getDisplayInheritedFromBreakpoint(attrs, bp, bps)` | Display-specific inheritance source |

PHP equivalents in `blocks-settings.php`:
- `get_effective_display_value_for_breakpoint($attributes, $breakpoint)`
- `get_effective_parent_display_value_for_breakpoint($parent_block, $breakpoint)`

### Per-Property Cascade Indicators

Every property control shows inherited values from lower breakpoints:

- **`ResponsiveSelectGroup`** — when a select has no explicit value but an inherited
  value exists, the placeholder changes from "None selected" to e.g. "Flex Row (from basic)"
  and the select is styled with `.wbtr-inherited-value` (italic, muted color).
- **`BoxModelControl`** — same placeholder replacement per side select for spacing.
- **`BorderSettings` / `BorderRadiusSettings`** — section-level `InheritedIndicator`
  label shown when border/radius objects cascade from a lower breakpoint.

The `breakpoints` prop is threaded from `SettingsComponentProps` → `ResponsiveSelectGroup` /
`BoxModelControl` to enable cascade lookups. CSS class `.wbtr-inherited-value` in
`resources/styles/common/_editor.css` provides the visual styling.

## Adding a New Setting Module

1. Create `settings/{name}/` with: `index.ts`, `properties.ts`, `settings.tsx`, `registration.ts`
2. In `registration.ts`, call `registry.register({ name, panelGroup, order, ... })`
3. Import `./settings/{name}` in `index.tsx` (side-effect import)
4. Add a matching PHP handler in `blocks-settings.php` and register it
5. Update `schemas/webentor-block.json` if adding a new support key

## Common Mistakes to Avoid

- **Don't read `attributes.display.display` directly** — use `getDisplayValue()` from `migration.ts`
- **Don't read parent display directly** — use `getParentDisplayValue()`
- **Don't create a new PanelBody in a SettingsComponent** — it renders inline within an existing panel
- **Don't forget both JS and PHP** — class generation runs on both sides
- **Don't manually bump version numbers** — follow the Changesets workflow (see root AGENTS.md)
