import { PanelBody, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';

import { SpacingSettings } from './settings';

export const SpacingPanel = (props: BlockPanelProps) => {
  const { attributes, breakpoints, twTheme } = props;

  if (!attributes?.spacing) {
    return null;
  }

  const hasSpacingSettingsForBreakpoint = (breakpoint: string): boolean => {
    return !!(
      attributes?.spacing?.['margin-top']?.value?.[breakpoint] ||
      attributes?.spacing?.['margin-bottom']?.value?.[breakpoint] ||
      attributes?.spacing?.['margin-left']?.value?.[breakpoint] ||
      attributes?.spacing?.['margin-right']?.value?.[breakpoint] ||
      attributes?.spacing?.['padding-top']?.value?.[breakpoint] ||
      attributes?.spacing?.['padding-bottom']?.value?.[breakpoint] ||
      attributes?.spacing?.['padding-left']?.value?.[breakpoint] ||
      attributes?.spacing?.['padding-right']?.value?.[breakpoint]
    );
  };

  return (
    <PanelBody title={__('Spacing Settings', 'webentor')} initialOpen={false}>
      <TabPanel
        activeClass="is-active"
        className="w-responsive-settings-tabs"
        initialTabName={breakpoints[0]}
        tabs={breakpoints.map((breakpoint) => ({
          name: breakpoint,
          title: `${breakpoint}${hasSpacingSettingsForBreakpoint(breakpoint) ? '*' : ''}`, // Add * if spacing is set on this breakpoint
        }))}
      >
        {(tab) => (
          <SpacingSettings {...props} breakpoint={tab.name} twTheme={twTheme} />
        )}
      </TabPanel>
    </PanelBody>
  );
};
