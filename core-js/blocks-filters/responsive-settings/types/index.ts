import { WebentorConfig } from '@webentorCore/types/_webentor-config';

// ─── Panel groups ────────────────────────────────────────────────────
// Each setting module declares which panel group it renders in.
// The panel components query the registry by this key.
export type PanelGroup = 'spacing' | 'displayLayout' | 'border' | 'blockLink';

// ─── Primitive value types ───────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
}

/**
 * A single responsive property value.
 * Keys are breakpoint names ('basic', 'sm', 'md', 'lg', 'xl', '2xl').
 */
export interface ResponsiveValue {
  value: {
    [breakpoint: string]: string;
  };
}

/**
 * A group of responsive properties keyed by CSS property name.
 * e.g. { 'margin-top': { value: { basic: 'mt-4', md: 'md:mt-8' } } }
 */
export interface ResponsiveAttribute {
  [propertyName: string]: ResponsiveValue;
}

// ─── Border-specific value types ─────────────────────────────────────

export interface BorderSideValue {
  width: string;
  color: string;
  style: string;
}

export interface BorderValue {
  top: BorderSideValue;
  right: BorderSideValue;
  bottom: BorderSideValue;
  left: BorderSideValue;
  linked?: boolean;
}

export interface ResponsiveBorderValue {
  value: {
    [breakpoint: string]: BorderValue;
  };
}

// ─── Grouped select options ──────────────────────────────────────────

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

// ─── Property definition ─────────────────────────────────────────────

export interface PropertyDefinition {
  label: string;
  name: string;
  help?: string;
  values: SelectOption[];
  /** When true, values are split into optgroups (numeric vs keyword) in the select */
  groupedValues?: boolean;
}

// ─── Block attributes & panel props ──────────────────────────────────

/**
 * Block attributes shape for responsive settings.
 */
export interface BlockAttributes {
  blockLink?: any;
  spacing?: ResponsiveAttribute;
  layout?: ResponsiveAttribute;
  sizing?: ResponsiveAttribute;
  flexItem?: ResponsiveAttribute;
  grid?: ResponsiveAttribute;
  gridItem?: ResponsiveAttribute;
  flexbox?: ResponsiveAttribute;
  border?: ResponsiveBorderValue;
  slider?: {
    enabled?: ResponsiveValue;
  };
  _preset?: string;
  _presetClasses?: string[];
}

export interface BlockPanelProps {
  attributes: BlockAttributes;
  setAttributes: (attributes: Partial<BlockAttributes>) => void;
  name: string;
  clientId: string;
  breakpoints: string[];
  twTheme: WebentorConfig['theme'];
}

// ─── Class generation context ────────────────────────────────────────

/**
 * Context passed to generateClasses() so modules can inspect
 * parent block state, slider status, and support flags.
 */
export interface ClassGenContext {
  blockName: string;
  supports: Record<string, any>;
  parentBlockAttributes?: Record<string, any>;
  /** Ordered breakpoint names for cascade resolution (min-width inheritance) */
  breakpoints: string[];
}

// ─── Setting definition (registry contract) ──────────────────────────

/**
 * Each setting module implements this interface and registers itself
 * with the SettingsRegistry. The panelGroup determines which panel
 * wrapper renders it; order determines render sequence within the panel.
 */
export interface SettingDefinition {
  /** Unique identifier, e.g. 'layout', 'sizing', 'flexbox' */
  name: string;
  /** Which UI panel this setting renders in */
  panelGroup: PanelGroup;
  /** Render order within the panel group (lower = higher) */
  order: number;
  /** WP block attribute key(s) this module reads/writes */
  attributeKey: string;
  /** webentor.* support flag(s) checked against block.json supports */
  supportKey: string | string[];
  /** Attribute schema merged into blocks.registerBlockType */
  attributeSchema: Record<string, any>;
  /** Optional custom attribute initialiser (e.g. display flex default) */
  initAttributes?: (
    settings: Record<string, any>,
    name: string,
  ) => Record<string, any>;
  /** React component rendered inline within the panel (NOT a PanelBody) */
  SettingsComponent: React.FC<SettingsComponentProps>;
  /** Generates Tailwind class array for a given breakpoint */
  generateClasses: (
    attributes: Record<string, any>,
    breakpoint: string,
    context: ClassGenContext,
  ) => string[];
  /** Returns true when at least one value is set for the breakpoint (tab indicator) */
  hasActiveSettings: (
    attributes: Record<string, any>,
    breakpoint: string,
    context?: ClassGenContext,
  ) => boolean;
  /** Optional v1→v2 migration for this module's attributes */
  migrateFromV1?: (oldAttrs: Record<string, any>) => Record<string, any>;
}

/**
 * Props passed to each setting module's SettingsComponent.
 * The panel wrapper provides these after resolving the active breakpoint.
 */
export interface SettingsComponentProps extends BlockPanelProps {
  breakpoint: string;
}

// ─── Layout preset ───────────────────────────────────────────────────

/**
 * A preset provides one-click layout configuration.
 * Selecting a preset fills in the underlying attribute values
 * and optionally attaches custom CSS classes for edge cases.
 */
export interface LayoutPresetValue {
  value: Record<string, unknown>;
}

export interface LayoutPresetApplies {
  [attributeKey: string]: {
    [propertyName: string]: LayoutPresetValue;
  };
}

export interface LayoutPreset {
  id: string;
  label: string;
  icon?: string;
  description: string;
  /** Attribute values keyed by module attribute key, then property name */
  applies: LayoutPresetApplies;
  /** Non-TW custom classes for edge cases (e.g. flex-wrap + gap calc) */
  customClasses?: string[];
}
