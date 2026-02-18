import { getBlockSupport } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

import { camelize, setImmutably } from '@webentorCore/_utils';

import { DisabledSliderInfo } from '../../../components/DisabledSliderInfo';
import { BlockPanelProps } from '../../../types';
import { isSliderEnabledForBreakpoint } from '../../../utils';
import { getDisplayProperties } from './properties';

interface DisplaySettingsProps extends BlockPanelProps {
  breakpoint: string;
}

export const DisplaySettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  twTheme,
}: DisplaySettingsProps) => {
  if (!attributes?.display) {
    return null;
  }

  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );

  const displayProperties = getDisplayProperties(name, twTheme);
  const supports = getBlockSupport(name, 'webentor.display');

  return (
    <div style={{ marginTop: '16px' }}>
      {isSliderEnabled && <DisabledSliderInfo />}

      {displayProperties.map((property) => {
        // Check if block supports all properties, meaning its set to true
        if (supports !== true) {
          const propertyCamel = camelize(property.name); // Suports is defined in camelCase
          // Check if block supports specific property, e.g. only "display" or "height" is supported
          if (supports?.[propertyCamel] !== true) {
            return null;
          }
        }

        return (
          <Fragment key={property.name + breakpoint}>
            <SelectControl
              label={property.label}
              value={attributes.display?.[property.name]?.value?.[breakpoint]}
              help={property?.help}
              disabled={isSliderEnabled}
              options={property.values}
              onChange={(selected) =>
                setAttributes(
                  setImmutably(
                    attributes,
                    ['display', property.name, 'value', breakpoint],
                    selected,
                  ),
                )
              }
            />
          </Fragment>
        );
      })}
    </div>
  );
};
