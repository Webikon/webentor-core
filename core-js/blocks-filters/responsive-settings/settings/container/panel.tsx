import { PanelBody, TabPanel } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';
import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import { DisplaySettings, getDisplayProperties } from './display';
import { FlexboxSettings, getFlexboxItemProperties } from './flexbox';
import { getGridItemProperties, GridSettings } from './grid';

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

  const checkIfHasAnyActiveSettings = (breakpoint: string): boolean => {
    const parentBlock = useBlockParent();
    const displayProperties = getDisplayProperties(props.name, twTheme);
    const flexboxItemProperties = getFlexboxItemProperties(twTheme);
    const gridItemProperties = getGridItemProperties(twTheme);

    const hasDisplaySettings = displayProperties.some((property) => {
      return !!attributes?.display?.[property.name]?.value?.[breakpoint];
    });

    const isParentFlexbox =
      parentBlock?.attributes?.display?.display?.value?.[breakpoint] === 'flex';
    const isParentGrid =
      parentBlock?.attributes?.display?.display?.value?.[breakpoint] === 'grid';

    const hasFlexboxItemSettings =
      isParentFlexbox &&
      flexboxItemProperties.some((property) => {
        return !!attributes?.flexboxItem?.[property.name]?.value?.[breakpoint];
      });

    const hasGridItemSettings =
      isParentGrid &&
      gridItemProperties.some((property) => {
        return !!attributes?.gridItem?.[property.name]?.value?.[breakpoint];
      });

    return hasDisplaySettings || hasFlexboxItemSettings || hasGridItemSettings;
  };

  const hasContainerSettings = (breakpoint: string): boolean => {
    return checkIfHasAnyActiveSettings(breakpoint);
  };

  // Allow themes/plugins to add custom content before responsive tabs
  const beforeTabsContent = applyFilters(
    'webentor.containerPanel.beforeTabs',
    null,
    props,
  );

  return (
    <PanelBody title={__('Container Settings', 'webentor')} initialOpen={true}>
      {beforeTabsContent}
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
