import { SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';

import { PropertyDefinition } from '../registry';
import { SelectOptionGroup } from '../types';
import { getEffectiveValue, getInheritedFromBreakpoint } from '../utils';

interface ResponsiveSelectGroupProps {
  attributeKey: string;
  properties: PropertyDefinition[];
  attributes: Record<string, any>;
  setAttributes: (attrs: Record<string, any>) => void;
  breakpoint: string;
  /** Ordered breakpoint names for cascade indicators */
  breakpoints?: string[];
  disabled?: boolean;
  /** Per-property visibility filter (e.g. display supports check) */
  isPropertyVisible?: (property: PropertyDefinition) => boolean;
  /** Map of property name → grouped options for optgroup rendering */
  valueGroups?: Record<string, SelectOptionGroup[]>;
}

/**
 * Resolve the inherited placeholder text for a property.
 * Returns the human-readable label of the cascaded value + source breakpoint,
 * or the default "None selected" if nothing is inherited.
 */
const getInheritedPlaceholder = (
  attributes: Record<string, any>,
  attributeKey: string,
  property: PropertyDefinition,
  breakpoint: string,
  breakpoints: string[] | undefined,
  valueGroups?: Record<string, SelectOptionGroup[]>,
): { text: string; isInherited: boolean } => {
  const defaultText = __('None selected', 'webentor');
  if (!breakpoints?.length) return { text: defaultText, isInherited: false };

  const inheritedFrom = getInheritedFromBreakpoint(
    attributes,
    attributeKey,
    property.name,
    breakpoint,
    breakpoints,
  );
  if (!inheritedFrom) return { text: defaultText, isInherited: false };

  const inheritedValue = getEffectiveValue(
    attributes,
    attributeKey,
    property.name,
    breakpoint,
    breakpoints,
  );
  if (!inheritedValue) return { text: defaultText, isInherited: false };

  // Resolve human-readable label from flat options or grouped options
  let label: string | undefined;
  const groups = property.groupedValues
    ? valueGroups?.[property.name]
    : undefined;
  if (groups) {
    for (const group of groups) {
      const match = group.options.find((o) => o.value === inheritedValue);
      if (match) {
        label = match.label;
        break;
      }
    }
  }
  if (!label) {
    label =
      property.values.find((o) => o.value === inheritedValue)?.label ??
      inheritedValue;
  }

  return {
    text: sprintf(__('%s (from %s)', 'webentor'), label, inheritedFrom),
    isInherited: true,
  };
};

/**
 * Generic SelectControl list renderer for responsive settings.
 *
 * Shows cascade indicators: when a property has no explicit value at the
 * current breakpoint but inherits one from a lower breakpoint, the empty
 * option shows the inherited value and source breakpoint.
 *
 * When a property has groupedValues + matching valueGroups entry,
 * passes <optgroup> children to SelectControl instead of the options prop.
 * WP's SelectControl renders children directly inside the native <select>.
 */
export const ResponsiveSelectGroup = ({
  attributeKey,
  properties,
  attributes,
  setAttributes,
  breakpoint,
  breakpoints,
  disabled = false,
  isPropertyVisible,
  valueGroups,
}: ResponsiveSelectGroupProps) => {
  return (
    <>
      {properties.map((property) => {
        if (isPropertyVisible && !isPropertyVisible(property)) return null;

        const groups = property.groupedValues
          ? valueGroups?.[property.name]
          : undefined;
        const handleChange = (selected: string) =>
          setAttributes(
            setImmutably(
              attributes,
              [attributeKey, property.name, 'value', breakpoint],
              selected,
            ),
          );

        const explicitValue =
          attributes[attributeKey]?.[property.name]?.value?.[breakpoint] ?? '';
        const { text: placeholderText, isInherited } = getInheritedPlaceholder(
          attributes,
          attributeKey,
          property,
          breakpoint,
          breakpoints,
          valueGroups,
        );

        const inheritedClassName =
          !explicitValue && isInherited ? 'wbtr-inherited-value' : '';

        return (
          <Fragment key={property.name + breakpoint}>
            {groups ? (
              <SelectControl
                label={property.label}
                value={explicitValue}
                help={property?.help}
                disabled={disabled}
                onChange={handleChange}
                className={inheritedClassName}
              >
                <option value="">{placeholderText}</option>
                {groups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </SelectControl>
            ) : (
              <SelectControl
                label={property.label}
                value={explicitValue}
                help={property?.help}
                disabled={disabled}
                options={
                  isInherited
                    ? [
                        { label: placeholderText, value: '' },
                        ...property.values.filter((o) => o.value !== ''),
                      ]
                    : property.values
                }
                onChange={handleChange}
                className={inheritedClassName}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};
