import { getBlockSupport } from '@wordpress/blocks';
import { Fragment } from '@wordpress/element';

import { camelize } from '@webentorCore/_utils';

import { DisabledSliderInfo } from '../../../components/DisabledSliderInfo';
import { ResponsiveSelectGroup } from '../../../components/ResponsiveSelectGroup';
import { PropertyDefinition } from '../../../registry';
import { BlockPanelProps } from '../../../types';
import { isSliderEnabledForBreakpoint } from '../../../utils';
import { getDisplayProperties } from './properties';

interface DisplaySettingsProps extends BlockPanelProps {
  breakpoint: string;
}

export const DisplaySettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  twTheme,
}: DisplaySettingsProps) => {
  if (!attributes?.display) {
    return null;
  }

  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );
  const displayProperties = getDisplayProperties(name, twTheme);
  const supports = getBlockSupport(name, 'webentor.display');

  const isPropertyVisible = (property: PropertyDefinition) => {
    if (supports === true) return true;
    return supports?.[camelize(property.name)] === true;
  };

  return (
    <Fragment>
      <div style={{ marginTop: '16px' }}>
        {isSliderEnabled && <DisabledSliderInfo />}
        <ResponsiveSelectGroup
          attributeKey="display"
          properties={displayProperties}
          attributes={attributes}
          setAttributes={setAttributes}
          breakpoint={breakpoint}
          disabled={isSliderEnabled}
          isPropertyVisible={isPropertyVisible}
        />
      </div>
    </Fragment>
  );
};
