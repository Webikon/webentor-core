import { useBlockProps } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import { ClassGenContext, registry } from './registry';

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
 * Border class helpers remain exported for use by border settings panel
 * (preview classes on the border control buttons).
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
 * Border class generation for full attribute set (used by border settings preview).
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

/** Check if any registered responsive setting attribute is present on the block */
export const applyResponsiveSettings = (attributes: any): boolean => {
  return registry.getAll().some((def) =>
    Object.keys(def.attributeSchema).some((key) => !!attributes?.[key]),
  );
};

/**
 * Generates Tailwind class names from block attributes using the SettingsRegistry.
 * Each registered setting's generateClasses is called per breakpoint.
 *
 * useBlockParent is called at top level (not inside a callback) to comply with Rules of Hooks.
 */
export const generateClassNames = (attributes: any): string => {
  if (!applyResponsiveSettings(attributes)) {
    return '';
  }

  const blockProps = useBlockProps();
  const blockName = blockProps['data-type'];
  const blockSettings = getBlockType(blockName);
  const supports = blockSettings?.supports;

  // useBlockParent hoisted to top level of this hook-safe function
  const parentBlock = useBlockParent();

  const context: ClassGenContext = {
    blockName,
    supports: supports || {},
    parentBlockAttributes: parentBlock?.attributes,
  };

  const classes: string[] = [];
  const allSettings = registry.getAll();

  // Collect breakpoint keys from attributes (all settings share the same breakpoints)
  const breakpoints = new Set<string>();
  for (const def of allSettings) {
    if (!registry.isSupported(supports, def)) continue;

    const attrGroup = attributes[def.attributeKey];
    if (!attrGroup) continue;

    for (const prop of Object.values(attrGroup)) {
      const propData = prop as any;
      if (propData?.value) {
        for (const bp of Object.keys(propData.value)) {
          breakpoints.add(bp);
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
