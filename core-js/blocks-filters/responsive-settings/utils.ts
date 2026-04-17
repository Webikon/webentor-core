/**
 * Responsive Settings — Utility functions.
 *
 * Class generation delegates to the SettingsRegistry: each registered
 * module's generateClasses() is called per breakpoint, and the results
 * are concatenated.
 *
 * Also contains generic breakpoint cascade utilities (getEffectiveValue,
 * getInheritedFromBreakpoint, etc.) for min-width inheritance lookups.
 *
 * Border helpers are kept here for backward compat (used by border
 * settings panel for preview classes).
 */
import { useBlockProps } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { applyFilters } from '@wordpress/hooks';

import { useBlockParent } from '../../blocks-utils/_use-block-parent';
import { registry } from './registry';
import { ClassGenContext } from './types';

export const getPixelFromRemValue = (value: string): string => {
  if (value.includes('rem')) {
    const remValue = value.replace('rem', '');
    return `${Number(remValue) * 16}px`;
  }
  return value;
};

export const isSliderEnabledForBreakpoint = (
  blockName: string,
  attributes: any,
  breakpoint: string,
): boolean => {
  return (
    blockName === 'webentor/e-slider' &&
    attributes?.slider?.enabled?.value?.[breakpoint]
  );
};

/**
 * Border class helpers — exported for border settings panel (preview).
 */
export const prepareTailwindBorderClassesForSide = (
  value: any,
  side: string,
  twBreakpoint: string,
): string[] => {
  const classes: string[] = [];

  const borderMapping = {
    top: 'border-t',
    right: 'border-r',
    bottom: 'border-b',
    left: 'border-l',
  };

  if (value) {
    if (value?.width) {
      classes.push(`${twBreakpoint}${borderMapping[side]}-${value.width}`);
    }
    if (value?.style) {
      classes.push(`${twBreakpoint}${borderMapping[side]}-${value.style}`);
    }
    if (value?.color) {
      classes.push(`${twBreakpoint}${borderMapping[side]}-${value.color}`);
    }
  }

  return classes;
};

/**
 * Border class generation for full attribute set (border settings preview).
 */
export const prepareTailwindBorderClassesFromSettings = (
  settings: any,
  type: string,
  side: string | string[],
): string[] => {
  const classes: string[] = [];
  if (settings[type]) {
    Object.entries(settings[type]).forEach(
      ([propName, prop]: [string, any]) => {
        if (prop?.value) {
          Object.entries(prop?.value).forEach(
            ([bpName, bpPropValue]: [string, object]) => {
              if (bpPropValue) {
                const twBreakpoint = bpName === 'basic' ? '' : `${bpName}:`;

                Object.entries(bpPropValue).forEach(
                  ([valueSide, value]: [string, any]) => {
                    if (valueSide === 'linked') return;

                    if (propName === 'border') {
                      if (Array.isArray(side) && !side.includes(valueSide))
                        return;
                      if (typeof side === 'string' && side !== valueSide)
                        return;
                      classes.push(
                        ...prepareTailwindBorderClassesForSide(
                          value,
                          valueSide,
                          twBreakpoint,
                        ),
                      );
                    } else if (propName === 'borderRadius') {
                      const radiusMapping = {
                        topLeft: 'rounded-tl',
                        topRight: 'rounded-tr',
                        bottomRight: 'rounded-br',
                        bottomLeft: 'rounded-bl',
                      };
                      if (value) {
                        classes.push(
                          `${twBreakpoint}${radiusMapping[valueSide]}-${value}`,
                        );
                      }
                    }
                  },
                );
              }
            },
          );
        }
      },
    );
  }
  return classes;
};

/**
 * Check if any registered responsive setting attribute is present on the block.
 * Used as a fast guard before running class generation.
 */
export const applyResponsiveSettings = (attributes: any): boolean => {
  return registry
    .getAll()
    .some((def) =>
      Object.keys(def.attributeSchema).some((key) => !!attributes?.[key]),
    );
};

/**
 * Pure class generator. Walks the SettingsRegistry and runs each supported
 * module's generateClasses() per breakpoint, grouping the results by
 * SettingDefinition.attributeKey (e.g. 'layout', 'flexbox', 'grid', 'spacing').
 *
 * Mirrors the PHP classes_by_property map. Hook-free — caller passes
 * blockName and parentBlockAttributes explicitly so this can be used from
 * any component without duplicating useBlockProps / useBlockParent calls.
 *
 * Consumers that need to split classes between different DOM elements
 * (e.g. l-section puts flexbox/grid/layout.display on an inner container)
 * can call this helper and pick the entries they want per element.
 */
export const computeClassesByAttribute = (
  attributes: Record<string, any>,
  blockName: string,
  parentBlockAttributes?: Record<string, any>,
): Record<string, string[]> => {
  const result: Record<string, string[]> = {};

  if (!applyResponsiveSettings(attributes)) {
    return result;
  }

  const blockSettings = getBlockType(blockName);
  const supports = blockSettings?.supports;

  const orderedBreakpoints: string[] = applyFilters(
    'webentor.core.twBreakpoints',
    ['basic'],
  ) as string[];

  const context: ClassGenContext = {
    blockName,
    supports,
    parentBlockAttributes,
    breakpoints: orderedBreakpoints,
  };

  const allSettings = registry.getAll();

  // Collect all breakpoints present in any attribute
  const breakpoints = new Set<string>();
  for (const def of allSettings) {
    if (!registry.isSupported(supports, def)) continue;

    for (const attrKey of Object.keys(def.attributeSchema)) {
      const attrGroup = attributes[attrKey];
      if (!attrGroup || typeof attrGroup !== 'object') continue;

      for (const prop of Object.values(attrGroup)) {
        const propData = prop as any;
        if (propData?.value) {
          for (const bp of Object.keys(propData.value)) {
            breakpoints.add(bp);
          }
        }
      }
    }
  }

  // Generate classes per breakpoint per registered setting, grouped by attributeKey
  for (const bp of breakpoints) {
    for (const def of allSettings) {
      if (!registry.isSupported(supports, def)) continue;
      const produced = def.generateClasses(attributes, bp, context);
      if (produced.length === 0) continue;
      const key = def.attributeKey;
      if (!result[key]) result[key] = [];
      result[key].push(...produced);
    }
  }

  return result;
};

/**
 * Generates Tailwind class names from block attributes using the SettingsRegistry.
 * Each registered setting's generateClasses() is called per breakpoint.
 *
 * Called from the editor.BlockListBlock HOC (React component context).
 * Hooks are called unconditionally before any early returns (Rules of Hooks).
 *
 * Delegates the per-module work to computeClassesByAttribute and flattens the
 * result, preserving the original output shape (a single space-joined string).
 */
export const generateClassNames = (attributes: any): string => {
  // Hooks must be called unconditionally before any early return (Rules of Hooks)
  const blockProps = useBlockProps();
  const parentBlock = useBlockParent();

  if (!applyResponsiveSettings(attributes)) {
    return '';
  }

  const blockName = blockProps['data-type'];

  const classesByAttribute = computeClassesByAttribute(
    attributes,
    blockName,
    parentBlock?.attributes,
  );

  return Object.values(classesByAttribute).flat().join(' ');
};

/**
 * Collect Tailwind class tokens from responsive setting attributes.
 *
 * Reads value entries from the given attribute keys (e.g. 'layout', 'flexbox',
 * 'grid') and returns the set of class tokens that would be generated.
 * Works directly from the block's attributes — no registry or cross-bundle
 * state needed.
 *
 * Useful for blocks that need to split classes between elements (e.g. l-section
 * moves layout/flexbox/grid classes from the wrapper to an inner container).
 */
export const collectClassTokensFromAttributes = (
  attributes: Record<string, any>,
  attributeKeys: string[],
): Set<string> => {
  const tokens = new Set<string>();

  for (const attrKey of attributeKeys) {
    const attrGroup = attributes[attrKey];
    if (!attrGroup || typeof attrGroup !== 'object') continue;

    for (const prop of Object.values(attrGroup)) {
      const propData = prop as any;
      if (!propData?.value) continue;

      for (const [bp, value] of Object.entries(propData.value)) {
        if (!value || typeof value !== 'string') continue;
        const prefix = bp === 'basic' ? '' : `${bp}:`;
        tokens.add(`${prefix}${value}`);

        // Layout 'hidden' maps to 'opacity-30' in editor
        if (value === 'hidden') {
          tokens.add(`${prefix}opacity-30`);
        }
      }
    }
  }

  return tokens;
};

export const inlineStyleGenerator = (): Record<string, any> => {
  return {};
};

// ─── Breakpoint cascade utilities ───────────────────────────────────
//
// Generic min-width inheritance helpers: walk breakpoints 0..target and
// return the last explicitly set value. These work on the standard
// attributes[attrKey][propName].value[bp] shape (no v1/v2 awareness).

/**
 * Generic cascade: walk breakpoints 0..target and return the last
 * explicitly set value (min-width inheritance).
 */
export const getEffectiveValue = (
  attributes: Record<string, any>,
  attributeKey: string,
  propertyName: string,
  breakpoint: string,
  breakpoints: string[],
): string | undefined => {
  const targetIndex = breakpoints.indexOf(breakpoint);
  if (targetIndex === -1) return undefined;
  let effective: string | undefined;
  for (let i = 0; i <= targetIndex; i++) {
    const val =
      attributes?.[attributeKey]?.[propertyName]?.value?.[breakpoints[i]];
    if (val !== undefined && val !== '') effective = val;
  }
  return effective;
};

/**
 * Returns the breakpoint name a value was inherited from, or null if the
 * value is explicitly set at the current breakpoint (or no value exists).
 * Used by InheritedIndicator to show "Inherited from basic" etc.
 */
export const getInheritedFromBreakpoint = (
  attributes: Record<string, any>,
  attributeKey: string,
  propertyName: string,
  breakpoint: string,
  breakpoints: string[],
): string | null => {
  const targetIndex = breakpoints.indexOf(breakpoint);
  if (targetIndex === -1) return null;

  // If explicit value exists at this breakpoint, it's not inherited
  const explicitVal =
    attributes?.[attributeKey]?.[propertyName]?.value?.[breakpoint];
  if (explicitVal !== undefined && explicitVal !== '') return null;

  // Walk backwards from the previous breakpoint to find the source
  for (let i = targetIndex - 1; i >= 0; i--) {
    const val =
      attributes?.[attributeKey]?.[propertyName]?.value?.[breakpoints[i]];
    if (val !== undefined && val !== '') return breakpoints[i];
  }
  return null;
};

// ─── Object value cascade (borders, border-radius) ─────────────────

/**
 * Check whether an object value has meaningful content.
 * Filters out metadata keys ('linked') and considers empty strings as
 * non-meaningful. Handles both flat values (border-radius: { topLeft: "lg" })
 * and nested values (border: { top: { width: "1" } }).
 */
const hasObjectContent = (val: Record<string, any>): boolean => {
  return Object.entries(val).some(([key, v]) => {
    if (key === 'linked') return false;
    if (v === undefined || v === null || v === '') return false;
    if (typeof v === 'object') {
      return Object.values(v).some(
        (sv) => sv !== undefined && sv !== null && sv !== '',
      );
    }
    return true;
  });
};

/**
 * Generic cascade for object-typed property values (e.g. border sides,
 * border-radius corners). Walks breakpoints 0..target and returns the
 * last non-empty object value.
 */
export const getEffectiveObjectValue = <T = Record<string, any>>(
  attributes: Record<string, any>,
  attributeKey: string,
  propertyName: string,
  breakpoint: string,
  breakpoints: string[],
): T | undefined => {
  const targetIndex = breakpoints.indexOf(breakpoint);
  if (targetIndex === -1) return undefined;
  let effective: T | undefined;
  for (let i = 0; i <= targetIndex; i++) {
    const val =
      attributes?.[attributeKey]?.[propertyName]?.value?.[breakpoints[i]];
    if (val !== undefined && val !== null && typeof val === 'object') {
      if (hasObjectContent(val)) effective = val;
    }
  }
  return effective;
};

/**
 * Returns the source breakpoint for an inherited object value, or null
 * if the value is explicitly set at the current breakpoint.
 */
export const getObjectInheritedFromBreakpoint = (
  attributes: Record<string, any>,
  attributeKey: string,
  propertyName: string,
  breakpoint: string,
  breakpoints: string[],
): string | null => {
  const targetIndex = breakpoints.indexOf(breakpoint);
  if (targetIndex === -1) return null;

  const explicitVal =
    attributes?.[attributeKey]?.[propertyName]?.value?.[breakpoint];
  if (
    explicitVal !== undefined &&
    explicitVal !== null &&
    typeof explicitVal === 'object' &&
    hasObjectContent(explicitVal)
  ) {
    return null;
  }

  for (let i = targetIndex - 1; i >= 0; i--) {
    const val =
      attributes?.[attributeKey]?.[propertyName]?.value?.[breakpoints[i]];
    if (val !== undefined && val !== null && typeof val === 'object') {
      if (hasObjectContent(val)) return breakpoints[i];
    }
  }
  return null;
};
