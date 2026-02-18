import { PanelBody, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { isEmpty } from '@webentorCore/_utils';
import { BlockPanelProps } from '@webentorCore/block-filters/responsive-settings/types';

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
      <TabPanel
        activeClass="is-active"
        className="w-responsive-settings-tabs"
        initialTabName={breakpoints[0]}
        tabs={breakpoints.map((breakpoint) => ({
          name: breakpoint,
          title: `${breakpoint}${checkIfHasAnyBorderSettings(breakpoint) ? '*' : ''}`,
        }))}
      >
        {(tab) => (
          <>
            <BorderSettings
              {...props}
              breakpoint={tab.name}
              twTheme={twTheme}
            />

            <BorderRadiusSettings
              {...props}
              breakpoint={tab.name}
              twTheme={twTheme}
            />
          </>
        )}
      </TabPanel>
    </PanelBody>
  );
};
