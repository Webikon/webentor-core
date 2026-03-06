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

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

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
  return registry.getAll().some((def) =>
    Object.keys(def.attributeSchema).some((key) => !!attributes?.[key]),
  );
};

/**
 * Generates Tailwind class names from block attributes using the SettingsRegistry.
 * Each registered setting's generateClasses() is called per breakpoint.
 *
 * This function is called as a classNameGenerator hook from registerBlockExtension.
 * useBlockParent/useBlockProps are called at top level to comply with Rules of Hooks.
 */
export const generateClassNames = (attributes: any): string => {
  if (!applyResponsiveSettings(attributes)) {
    return '';
  }

  const blockProps = useBlockProps();
  const blockName = blockProps['data-type'];
  const blockSettings = getBlockType(blockName);
  const supports = blockSettings?.supports;

  // useBlockParent hoisted to top level (hook-safe)
  const parentBlock = useBlockParent();

  // Resolve ordered breakpoints for cascade logic
  const orderedBreakpoints: string[] = applyFilters(
    'webentor.core.twBreakpoints',
    ['basic'],
  ) as string[];

  const context: ClassGenContext = {
    blockName,
    supports,
    parentBlockAttributes: parentBlock?.attributes,
    breakpoints: orderedBreakpoints,
  };

  const classes: string[] = [];
  const allSettings = registry.getAll();

  // Collect all breakpoints present in any attribute
  const breakpoints = new Set<string>();
  for (const def of allSettings) {
    if (!registry.isSupported(supports, def)) continue;

    // Check all attribute keys declared by this module
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

  // Generate classes per breakpoint per registered setting
  for (const bp of breakpoints) {
    for (const def of allSettings) {
      if (!registry.isSupported(supports, def)) continue;
      classes.push(...def.generateClasses(attributes, bp, context));
    }
  }

  return classes.join(' ') ?? '';
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
