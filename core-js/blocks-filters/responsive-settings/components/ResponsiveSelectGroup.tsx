import { SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import { setImmutably } from '@webentorCore/_utils';

import { PropertyDefinition } from '../registry';

interface ResponsiveSelectGroupProps {
  attributeKey: string;
  properties: PropertyDefinition[];
  attributes: Record<string, any>;
  setAttributes: (attrs: Record<string, any>) => void;
  breakpoint: string;
  disabled?: boolean;
  /** Per-property visibility filter (e.g. display supports check) */
  isPropertyVisible?: (property: PropertyDefinition) => boolean;
}

/**
 * Generic SelectControl list renderer for responsive settings.
 * Replaces the duplicated properties.map → SelectControl pattern
 * across display, flexbox, grid, and spacing settings components.
 */
export const ResponsiveSelectGroup = ({
  attributeKey,
  properties,
  attributes,
  setAttributes,
  breakpoint,
  disabled = false,
  isPropertyVisible,
}: ResponsiveSelectGroupProps) => {
  return (
    <>
      {properties.map((property) => {
        if (isPropertyVisible && !isPropertyVisible(property)) return null;
        return (
          <Fragment key={property.name + breakpoint}>
            <SelectControl
              label={property.label}
              value={
                attributes[attributeKey]?.[property.name]?.value?.[breakpoint]
              }
              help={property?.help}
              disabled={disabled}
              options={property.values}
              onChange={(selected) =>
                setAttributes(
                  setImmutably(
                    attributes,
                    [attributeKey, property.name, 'value', breakpoint],
                    selected,
                  ),
                )
              }
            />
          </Fragment>
        );
      })}
    </>
  );
};
