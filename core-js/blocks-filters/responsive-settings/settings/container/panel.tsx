import { PanelBody, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';

import { DisplaySettings, getDisplayProperties } from './display';
import { FlexboxSettings } from './flexbox';
import { GridSettings } from './grid';

export const ContainerPanel = (props: BlockPanelProps) => {
  const { attributes, breakpoints, twTheme } = props;

  if (
    !attributes?.display &&
    !attributes?.grid &&
    !attributes?.gridItem &&
    !attributes?.flexbox &&
    !attributes?.flexboxItem
  ) {
    return null;
  }

  const checkIfHasAnyDisplaySettings = (breakpoint: string): boolean => {
    const displayProperties = getDisplayProperties(props.name, twTheme);

    return displayProperties.some((property) => {
      return !!attributes?.display?.[property.name]?.value?.[breakpoint];
    });
  };

  const hasContainerSettings = (breakpoint: string): boolean => {
    return checkIfHasAnyDisplaySettings(breakpoint);
  };

  return (
    <PanelBody title={__('Container Settings', 'webentor')} initialOpen={true}>
      <TabPanel
        activeClass="is-active"
        className="w-responsive-settings-tabs"
        initialTabName={breakpoints[0]}
        tabs={breakpoints.map((breakpoint) => ({
          name: breakpoint,
          title: `${breakpoint}${hasContainerSettings(breakpoint) ? '*' : ''}`,
        }))}
      >
        {(tab) => (
          <>
            <DisplaySettings
              {...props}
              breakpoint={tab.name}
              twTheme={twTheme}
            />
            <GridSettings {...props} breakpoint={tab.name} />
            <FlexboxSettings {...props} breakpoint={tab.name} />
          </>
        )}
      </TabPanel>
    </PanelBody>
  );
};
