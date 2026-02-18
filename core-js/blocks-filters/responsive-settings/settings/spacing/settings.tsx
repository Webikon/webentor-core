import { SelectControl } from '@wordpress/components';

import { setImmutably } from '@webentorCore/_utils';
import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';

import { DisabledSliderInfo } from '../../components/DisabledSliderInfo';
import { isSliderEnabledForBreakpoint } from '../../utils';
import { getSpacingProperties } from './properties';

interface SpacingSettingsProps extends BlockPanelProps {
  breakpoint: string;
}

export const SpacingSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  twTheme,
}: SpacingSettingsProps) => {
  if (!attributes?.spacing) {
    return null;
  }

  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );

  const spacingProperties = getSpacingProperties(twTheme);

  return (
    <div
      style={{
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      {isSliderEnabled && <DisabledSliderInfo />}

      {spacingProperties.map((property) => (
        <div
          key={property.name + breakpoint}
          style={{
            margin:
              property.name.includes('top') || property.name.includes('bottom')
                ? '0 auto'
                : undefined,
            width:
              property.name.includes('top') || property.name.includes('bottom')
                ? '75%'
                : property.name.includes('left') ||
                    property.name.includes('right')
                  ? '40%'
                  : undefined,
          }}
        >
          <SelectControl
            label={property.label}
            value={attributes.spacing?.[property.name]?.value?.[breakpoint]}
            help={property?.help}
            disabled={isSliderEnabled}
            options={property.values}
            onChange={(selected) =>
              setAttributes(
                setImmutably(
                  attributes,
                  ['spacing', property.name, 'value', breakpoint],
                  selected,
                ),
              )
            }
          />

          {/* Horizontal line between margin & padding settings */}
          {property.name.includes('margin-bottom') && <hr />}
        </div>
      ))}
    </div>
  );
};
