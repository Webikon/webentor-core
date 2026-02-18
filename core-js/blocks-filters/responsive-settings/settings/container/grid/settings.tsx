import { SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';
import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';
import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import { DisabledSliderInfo } from '../../../components/DisabledSliderInfo';
import { isSliderEnabledForBreakpoint } from '../../../utils';
import { getGridItemProperties, getGridProperties } from './properties';

interface GridSettingsProps extends BlockPanelProps {
  breakpoint: string;
  twTheme: any;
}

export const GridSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  twTheme,
}: GridSettingsProps) => {
  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );

  // Get parent block data
  const parentBlock = useBlockParent();

  // TODO: how to check all previous breakpoints and determine if any of them is grid so we can display the settings?
  const isParentGrid =
    parentBlock?.attributes?.display?.display?.value?.[breakpoint] === 'grid';
  const isCurrentGrid =
    attributes?.display?.display?.value?.[breakpoint] === 'grid';

  if (!isCurrentGrid && !isParentGrid) {
    return null;
  }

  const gridProperties = getGridProperties(twTheme);
  const gridItemProperties = getGridItemProperties(twTheme);

  return (
    <>
      {isCurrentGrid && attributes?.grid && (
        <div
          style={{
            marginTop: '16px',
            border: '1px solid #e0e0e0',
            padding: '8px',
          }}
        >
          <h3 style={{ marginBottom: '8px' }}>
            {__('Grid settings', 'webentor')}
          </h3>

          {isSliderEnabled && <DisabledSliderInfo />}

          {gridProperties.map((property) => (
            <Fragment key={property.name + breakpoint}>
              <SelectControl
                label={property.label}
                value={attributes.grid?.[property.name]?.value?.[breakpoint]}
                disabled={isSliderEnabled}
                help={property?.help}
                options={property.values}
                onChange={(selected) =>
                  setAttributes(
                    setImmutably(
                      attributes,
                      ['grid', property.name, 'value', breakpoint],
                      selected,
                    ),
                  )
                }
              />
            </Fragment>
          ))}
        </div>
      )}

      {isParentGrid && attributes?.gridItem && (
        <div
          style={{
            marginTop: '16px',
            border: '1px solid #e0e0e0',
            padding: '8px',
          }}
        >
          <h3 style={{ marginBottom: '8px' }}>
            {__('Grid Item settings', 'webentor')}
          </h3>
          <div style={{ marginBottom: '8px', fontSize: '12px' }}>
            {__(
              'Parent block display setting is set to `Grid`, so current block also acts as grid item.',
              'webentor',
            )}
          </div>

          {isSliderEnabled && <DisabledSliderInfo />}

          {gridItemProperties.map((property) => (
            <Fragment key={property.name + breakpoint}>
              <SelectControl
                label={property.label}
                value={
                  attributes.gridItem?.[property.name]?.value?.[breakpoint]
                }
                disabled={isSliderEnabled}
                help={property?.help}
                options={property.values}
                onChange={(selected) =>
                  setAttributes(
                    setImmutably(
                      attributes,
                      ['gridItem', property.name, 'value', breakpoint],
                      selected,
                    ),
                  )
                }
              />
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
};
