export const getPixelFromRemValue = (value: string): string => {
  if (value.includes('rem')) {
    const remValue = value.replace('rem', '');
    return `${Number(remValue) * 16}px`;
  }
  return value;
};

export const setImmutably = (obj: any, path: string[], value: any): any => {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return {
    ...obj,
    [head]: setImmutably(obj[head] || {}, rest, value),
  };
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
  const classes = [];

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

  const classes = [];

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

  classes.push(...spacingClasses);
  classes.push(...displayClasses);
  classes.push(...flexboxClasses);
  classes.push(...flexboxItemClasses);
  classes.push(...gridClasses);
  classes.push(...gridItemClasses);

  return classes.join(' ') ?? '';
};

export const inlineStyleGenerator = (): Record<string, any> => {
  return {};
};
