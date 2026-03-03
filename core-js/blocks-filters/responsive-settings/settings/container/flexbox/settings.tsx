import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { LayoutModeSettings } from '../../../components/LayoutModeSettings';
import { BlockPanelProps } from '../../../types';
import { getFlexboxItemProperties, getFlexboxProperties } from './properties';

interface FlexboxSettingsProps extends BlockPanelProps {
  breakpoint: string;
}

export const FlexboxSettings = (props: FlexboxSettingsProps) => {
  const { twTheme } = props;

  return (
    <Fragment>
      <LayoutModeSettings
        {...props}
        displayValue="flex"
        container={{
          attributeKey: 'flexbox',
          title: __('Flexbox settings', 'webentor'),
          properties: getFlexboxProperties(twTheme),
        }}
        item={{
          attributeKey: 'flexboxItem',
          title: __('Flex Item settings', 'webentor'),
          description: __(
            'Parent block display setting is set to `Flex`, so current block also acts as flex item.',
            'webentor',
          ),
          properties: getFlexboxItemProperties(twTheme),
        }}
      />
    </Fragment>
  );
};
