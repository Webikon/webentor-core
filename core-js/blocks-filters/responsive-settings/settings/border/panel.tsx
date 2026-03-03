import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { isEmpty } from '@webentorCore/_utils';
import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';

import { ResponsiveTabPanel } from '../../components/ResponsiveTabPanel';
import { BorderRadiusSettings } from './border-radius/settings';
import { BorderSettings } from './border/settings';

export const BorderPanel = (props: BlockPanelProps) => {
  const { attributes, breakpoints, twTheme } = props;

  if (!attributes?.border) {
    return null;
  }

  const checkIfHasAnyBorderSettings = (breakpoint: string): boolean => {
    const properties = ['border', 'borderRadius'];
    return properties.some((property) => {
      return !isEmpty(attributes?.border?.[property]?.value?.[breakpoint]);
    });
  };

  return (
    <PanelBody title={__('Border Settings', 'webentor')} initialOpen={false}>
      <ResponsiveTabPanel
        breakpoints={breakpoints}
        hasActiveSettings={checkIfHasAnyBorderSettings}
      >
        {(breakpoint) => (
          <>
            <BorderSettings
              {...props}
              breakpoint={breakpoint}
              twTheme={twTheme}
            />
            <BorderRadiusSettings
              {...props}
              breakpoint={breakpoint}
              twTheme={twTheme}
            />
          </>
        )}
      </ResponsiveTabPanel>
    </PanelBody>
  );
};
