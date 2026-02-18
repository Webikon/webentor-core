import { SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';
import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';
import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import { DisabledSliderInfo } from '../../../components/DisabledSliderInfo';
import { isSliderEnabledForBreakpoint } from '../../../utils';
import { getFlexboxItemProperties, getFlexboxProperties } from './properties';

interface FlexboxSettingsProps extends BlockPanelProps {
  breakpoint: string;
}

export const FlexboxSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  twTheme,
}: FlexboxSettingsProps) => {
  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );

  // Get parent block data
  const parentBlock = useBlockParent();

  // TODO: how to check all previous breakpoints and determine if any of them is flex so we can display the settings?
  const isParentFlex =
    parentBlock?.attributes?.display?.display?.value?.[breakpoint] === 'flex';
  const isCurrentFlex =
    attributes?.display?.display?.value?.[breakpoint] === 'flex';

  if (!isCurrentFlex && !isParentFlex) {
    return null;
  }

  const flexboxProperties = getFlexboxProperties(twTheme);
  const flexboxItemProperties = getFlexboxItemProperties(twTheme);

  return (
    <>
      {isCurrentFlex && attributes?.flexbox && (
        <div
          style={{
            marginTop: '16px',
            border: '1px solid #e0e0e0',
            padding: '8px',
          }}
        >
          <h3 style={{ marginBottom: '8px' }}>
            {__('Flexbox settings', 'webentor')}
          </h3>

          {isSliderEnabled && <DisabledSliderInfo />}

          {flexboxProperties.map((property) => (
            <Fragment key={property.name + breakpoint}>
              <SelectControl
                label={property.label}
                value={attributes.flexbox?.[property.name]?.value?.[breakpoint]}
                disabled={isSliderEnabled}
                help={property?.help}
                options={property.values}
                onChange={(selected) =>
                  setAttributes(
                    setImmutably(
                      attributes,
                      ['flexbox', property.name, 'value', breakpoint],
                      selected,
                    ),
                  )
                }
              />
            </Fragment>
          ))}
        </div>
      )}

      {isParentFlex && attributes?.flexboxItem && (
        <div
          style={{
            marginTop: '16px',
            border: '1px solid #e0e0e0',
            padding: '8px',
          }}
        >
          <h3 style={{ marginBottom: '8px' }}>
            {__('Flex Item settings', 'webentor')}
          </h3>
          <div style={{ marginBottom: '8px', fontSize: '12px' }}>
            {__(
              'Parent block display setting is set to `Flex`, so current block also acts as flex item.',
              'webentor',
            )}
          </div>

          {isSliderEnabled && <DisabledSliderInfo />}

          {flexboxItemProperties.map((property) => (
            <Fragment key={property.name + breakpoint}>
              <SelectControl
                label={property.label}
                value={
                  attributes.flexboxItem?.[property.name]?.value?.[breakpoint]
                }
                disabled={isSliderEnabled}
                help={property?.help}
                options={property.values}
                onChange={(selected) =>
                  setAttributes(
                    setImmutably(
                      attributes,
                      ['flexboxItem', property.name, 'value', breakpoint],
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
