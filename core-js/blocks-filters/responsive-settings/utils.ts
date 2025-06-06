export const getPixelFromRemValue = (value: string): string => {
  if (value.includes('rem')) {
    const remValue = value.replace('rem', '');
    return `${Number(remValue) * 16}px`;
  }
  return value;
};

export const hasSpacingSettingsForBreakpoint = (
  attributes: any,
  breakpoint: string,
): boolean => {
  return (
    attributes?.spacing?.['margin-top']?.value?.[breakpoint] ||
    attributes?.spacing?.['margin-bottom']?.value?.[breakpoint] ||
    attributes?.spacing?.['margin-left']?.value?.[breakpoint] ||
    attributes?.spacing?.['margin-right']?.value?.[breakpoint] ||
    attributes?.spacing?.['padding-top']?.value?.[breakpoint] ||
    attributes?.spacing?.['padding-bottom']?.value?.[breakpoint] ||
    attributes?.spacing?.['padding-left']?.value?.[breakpoint] ||
    attributes?.spacing?.['padding-right']?.value?.[breakpoint]
  );
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

export const prepareTailwindClassesFromSettings = (
  settings: any,
  type: string,
): string[] => {
  const classes: string[] = [];

  if (settings[type]) {
    Object.entries(settings[type]).forEach(([, prop]: [string, any]) => {
      if (prop?.value) {
        Object.entries(prop?.value).forEach(
          ([bpName, bpPropValue]: [string, any]) => {
            if (type === 'flex' || type === 'flexItem') {
              if (settings?.display?.display?.value?.[bpName] !== 'flex') {
                return;
              }
            }

            if (type === 'grid' || type === 'gridItem') {
              if (settings?.display?.display?.value?.[bpName] !== 'grid') {
                return;
              }
            }

            if (settings?.slider?.enabled?.value?.[bpName]) {
              return;
            }

            if (bpPropValue) {
              const twBreakpoint = bpName === 'basic' ? '' : `${bpName}:`;
              classes.push(`${twBreakpoint}${bpPropValue}`);
            }
          },
        );
      }
    });
  }

  return classes;
};

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
                    if (valueSide === 'linked') {
                      return;
                    }

                    if (propName === 'border') {
                      // Check if side classes should be processed as we can in some cases get only one side of the border
                      if (Array.isArray(side) && !side.includes(valueSide)) {
                        return;
                      }

                      if (typeof side === 'string' && side !== valueSide) {
                        return;
                      }

                      classes.push(
                        ...prepareTailwindBorderClassesForSide(
                          value,
                          valueSide,
                          twBreakpoint,
                        ),
                      );
                    } else if (propName === 'borderRadius') {
                      classes.push(
                        ...prepareTailwindBorderRadiusClassesForCorner(
                          value,
                          valueSide,
                          twBreakpoint,
                        ),
                      );
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

const prepareTailwindBorderRadiusClassesForCorner = (
  value: any,
  corner: string,
  twBreakpoint: string,
): string[] => {
  const classes: string[] = [];

  const radiusMapping = {
    topLeft: 'rounded-tl',
    topRight: 'rounded-tr',
    bottomRight: 'rounded-br',
    bottomLeft: 'rounded-bl',
  };

  if (value) {
    classes.push(`${twBreakpoint}${radiusMapping[corner]}-${value}`);
  }

  return classes;
};

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

export const applyResponsiveSettings = (attributes: any): boolean => {
  if (
    !attributes?.blockLink &&
    !attributes?.spacing &&
    !attributes?.display &&
    !attributes?.grid &&
    !attributes?.gridItem &&
    !attributes?.flexbox &&
    !attributes?.flexboxItem
  ) {
    return false;
  }

  return true;
};

export const generateClassNames = (attributes: any): string => {
  if (!applyResponsiveSettings(attributes)) {
    return '';
  }

  const classes: string[] = [];

  // Prepare all Tailwind classes
  const spacingClasses = prepareTailwindClassesFromSettings(
    attributes,
    'spacing',
  );
  const displayClasses = prepareTailwindClassesFromSettings(
    attributes,
    'display',
  );
  const flexboxClasses = prepareTailwindClassesFromSettings(
    attributes,
    'flexbox',
  );
  const flexboxItemClasses = prepareTailwindClassesFromSettings(
    attributes,
    'flexboxItem',
  );
  const gridClasses = prepareTailwindClassesFromSettings(attributes, 'grid');
  const gridItemClasses = prepareTailwindClassesFromSettings(
    attributes,
    'gridItem',
  );

  const borderClasses = prepareTailwindBorderClassesFromSettings(
    attributes,
    'border',
    ['top', 'right', 'bottom', 'left'],
  );

  classes.push(...spacingClasses);
  classes.push(...displayClasses);
  classes.push(...flexboxClasses);
  classes.push(...flexboxItemClasses);
  classes.push(...gridClasses);
  classes.push(...gridItemClasses);
  classes.push(...borderClasses);

  return classes.join(' ') ?? '';
};

export const inlineStyleGenerator = (): Record<string, any> => {
  return {};
};
