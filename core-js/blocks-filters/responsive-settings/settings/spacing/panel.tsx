import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { ResponsiveTabPanel } from '../../components/ResponsiveTabPanel';
import { BlockPanelProps } from '../../types';
import { hasSpacingSettingsForBreakpoint } from './properties';
import { SpacingSettings } from './settings';

export const SpacingPanel = (props: BlockPanelProps) => {
  const { attributes, breakpoints, twTheme } = props;

  if (!attributes?.spacing) {
    return null;
  }

  return (
    <PanelBody title={__('Spacing Settings', 'webentor')} initialOpen={false}>
      <ResponsiveTabPanel
        breakpoints={breakpoints}
        hasActiveSettings={(bp) =>
          hasSpacingSettingsForBreakpoint(attributes, bp)
        }
      >
        {(breakpoint) => (
          <SpacingSettings {...props} breakpoint={breakpoint} twTheme={twTheme} />
        )}
      </ResponsiveTabPanel>
    </PanelBody>
  );
};
