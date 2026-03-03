import { PanelBody } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';
import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import { ResponsiveTabPanel } from '../../components/ResponsiveTabPanel';
import { DisplaySettings, getDisplayProperties } from './display';
import { FlexboxSettings, getFlexboxItemProperties } from './flexbox';
import { getGridItemProperties, GridSettings } from './grid';

export const ContainerPanel = (props: BlockPanelProps) => {
  const { attributes, breakpoints, twTheme } = props;

  // useBlockParent hoisted to component top-level (fixes Rules of Hooks violation)
  const parentBlock = useBlockParent();

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

  const beforeTabsContent = applyFilters(
    'webentor.containerPanel.beforeTabs',
    null,
    props,
  );

  return (
    <PanelBody title={__('Container Settings', 'webentor')} initialOpen={true}>
      {beforeTabsContent}
      <ResponsiveTabPanel
        breakpoints={breakpoints}
        hasActiveSettings={checkIfHasAnyActiveSettings}
      >
        {(breakpoint) => (
          <>
            <DisplaySettings
              {...props}
              breakpoint={breakpoint}
              twTheme={twTheme}
            />
            <GridSettings {...props} breakpoint={breakpoint} />
            <FlexboxSettings {...props} breakpoint={breakpoint} />
          </>
        )}
      </ResponsiveTabPanel>
    </PanelBody>
  );
};
