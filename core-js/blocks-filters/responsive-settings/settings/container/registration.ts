import { ClassGenContext, registry } from '../../registry';
import { getDisplayProperties } from './display/properties';
import { generateDisplayClasses } from './display/registration';
import {
  generateFlexboxClasses,
  generateFlexboxItemClasses,
} from './flexbox/registration';
import { getFlexboxItemProperties } from './flexbox/properties';
import {
  generateGridClasses,
  generateGridItemClasses,
} from './grid/registration';
import { getGridItemProperties } from './grid/properties';
import { ContainerPanel } from './panel';

/**
 * Container settings: display + grid + flexbox combined into one panel.
 * Registered as a single entry since they share one InspectorControls panel.
 */

const generateContainerClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  context: ClassGenContext,
): string[] => {
  const classes: string[] = [];

  if (context.supports?.webentor?.display) {
    classes.push(...generateDisplayClasses(attributes, breakpoint, context));
  }
  if (context.supports?.webentor?.grid) {
    classes.push(...generateGridClasses(attributes, breakpoint, context));
  }
  if (context.supports?.webentor?.gridItem) {
    classes.push(...generateGridItemClasses(attributes, breakpoint, context));
  }
  if (context.supports?.webentor?.flexbox) {
    classes.push(...generateFlexboxClasses(attributes, breakpoint, context));
  }
  if (context.supports?.webentor?.flexboxItem) {
    classes.push(
      ...generateFlexboxItemClasses(attributes, breakpoint, context),
    );
  }

  return classes;
};

const hasContainerActiveSettings = (
  attributes: Record<string, any>,
  breakpoint: string,
  context?: ClassGenContext,
): boolean => {
  const twTheme = {} as any; // Theme isn't available here; we check raw attribute values
  const displayProperties = getDisplayProperties('', twTheme);
  const hasDisplay = displayProperties.some(
    (p: any) => !!attributes?.display?.[p.name]?.value?.[breakpoint],
  );

  const parentAttrs = context?.parentBlockAttributes;
  const isParentFlex =
    parentAttrs?.display?.display?.value?.[breakpoint] === 'flex';
  const isParentGrid =
    parentAttrs?.display?.display?.value?.[breakpoint] === 'grid';

  const flexboxItemProps = getFlexboxItemProperties(twTheme);
  const hasFlexItem =
    isParentFlex &&
    flexboxItemProps.some(
      (p: any) => !!attributes?.flexboxItem?.[p.name]?.value?.[breakpoint],
    );

  const gridItemProps = getGridItemProperties(twTheme);
  const hasGridItem =
    isParentGrid &&
    gridItemProps.some(
      (p: any) => !!attributes?.gridItem?.[p.name]?.value?.[breakpoint],
    );

  return hasDisplay || hasFlexItem || hasGridItem;
};

registry.register({
  name: 'container',
  panelTitle: 'Container Settings',
  panelPriority: 20,
  attributeKey: 'display',
  supportKey: ['display', 'grid', 'gridItem', 'flexbox', 'flexboxItem'],
  attributeSchema: {
    display: { type: 'object', default: {} },
    grid: { type: 'object', default: {} },
    gridItem: { type: 'object', default: {} },
    flexbox: { type: 'object', default: {} },
    flexboxItem: { type: 'object', default: {} },
  },
  initAttributes: (settings, _name) => {
    const displaySupport =
      settings?.supports?.webentor?.display === true ||
      settings?.supports?.webentor?.display?.display === true;

    if (settings?.supports?.webentor?.display) {
      settings.attributes = {
        ...settings.attributes,
        display: {
          type: 'object',
          default: {
            ...settings?.attributes?.display?.default,
            display: {
              value: {
                ...(displaySupport ? { basic: 'flex' } : {}),
                ...settings?.attributes?.display?.default?.display?.value,
              },
            },
          },
        },
      };
    }
    return settings;
  },
  PanelComponent: ContainerPanel,
  generateClasses: generateContainerClasses,
  hasActiveSettings: hasContainerActiveSettings,
});
