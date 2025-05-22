import { PanelBody, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';

import { BorderSettings } from './settings';

export const BorderPanel = (props: BlockPanelProps) => {
  const { attributes, breakpoints, twTheme } = props;

  if (!attributes?.border) {
    return null;
  }

  const hasBorderSettingsForBreakpoint = (breakpoint: string): boolean => {
    return !!(
      attributes?.border?.border?.value?.[breakpoint]?.top?.width ||
      attributes?.border?.border?.value?.[breakpoint]?.right?.width ||
      attributes?.border?.border?.value?.[breakpoint]?.bottom?.width ||
      attributes?.border?.border?.value?.[breakpoint]?.left?.width ||
      attributes?.border?.border?.value?.[breakpoint]?.top?.color ||
      attributes?.border?.border?.value?.[breakpoint]?.right?.color ||
      attributes?.border?.border?.value?.[breakpoint]?.bottom?.color ||
      attributes?.border?.border?.value?.[breakpoint]?.left?.color ||
      attributes?.border?.border?.value?.[breakpoint]?.top?.style ||
      attributes?.border?.border?.value?.[breakpoint]?.right?.style ||
      attributes?.border?.border?.value?.[breakpoint]?.bottom?.style ||
      attributes?.border?.border?.value?.[breakpoint]?.left?.style
    );
  };

  return (
    <PanelBody title={__('Border Settings', 'webentor')} initialOpen={true}>
      <TabPanel
        activeClass="is-active"
        className="w-responsive-settings-tabs"
        initialTabName={breakpoints[0]}
        tabs={breakpoints.map((breakpoint) => ({
          name: breakpoint,
          title: `${breakpoint}${hasBorderSettingsForBreakpoint(breakpoint) ? '*' : ''}`, // Add * if spacing is set on this breakpoint,
        }))}
      >
        {(tab) => (
          <BorderSettings {...props} breakpoint={tab.name} twTheme={twTheme} />
        )}
      </TabPanel>
    </PanelBody>
  );
};
