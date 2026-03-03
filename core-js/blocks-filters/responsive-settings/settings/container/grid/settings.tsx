import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { LayoutModeSettings } from '../../../components/LayoutModeSettings';
import { BlockPanelProps } from '../../../types';
import { getGridItemProperties, getGridProperties } from './properties';

interface GridSettingsProps extends BlockPanelProps {
  breakpoint: string;
}

export const GridSettings = (props: GridSettingsProps) => {
  const { twTheme } = props;

  return (
    <Fragment>
      <LayoutModeSettings
        {...props}
        displayValue="grid"
        container={{
          attributeKey: 'grid',
          title: __('Grid settings', 'webentor'),
          properties: getGridProperties(twTheme),
        }}
        item={{
          attributeKey: 'gridItem',
          title: __('Grid Item settings', 'webentor'),
          description: __(
            'Parent block display setting is set to `Grid`, so current block also acts as grid item.',
            'webentor',
          ),
          properties: getGridItemProperties(twTheme),
        }}
      />
    </Fragment>
  );
};
