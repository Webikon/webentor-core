/**
 * LayoutSettings — display mode selector.
 *
 * Rendered inside the DisplayLayoutPanel at order: 10.
 */
import { getBlockSupport } from '@wordpress/blocks';
import { Fragment } from '@wordpress/element';

import { camelize } from '@webentorCore/_utils';

import { DisabledSliderInfo } from '../../components/DisabledSliderInfo';
import { ResponsiveSelectGroup } from '../../components/ResponsiveSelectGroup';
import { PropertyDefinition, SettingsComponentProps } from '../../types';
import { isSliderEnabledForBreakpoint } from '../../utils';
import { getLayoutProperties } from './properties';

export const LayoutSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  breakpoints,
  twTheme,
}: SettingsComponentProps) => {
  if (!attributes?.layout) {
    return null;
  }

  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );
  const layoutProperties = getLayoutProperties(name, twTheme);

  const webentorSupports = getBlockSupport(name, 'webentor') as
    | Record<string, any>
    | undefined;
  const supports = webentorSupports?.layout;

  const isPropertyVisible = (property: PropertyDefinition) => {
    if (supports === true) return true;
    return supports?.[camelize(property.name)] === true;
  };

  const attributeKey = 'layout';

  return (
    <Fragment>
      <div style={{ marginTop: '16px' }}>
        {isSliderEnabled && <DisabledSliderInfo />}
        <ResponsiveSelectGroup
          attributeKey={attributeKey}
          properties={layoutProperties}
          attributes={attributes}
          setAttributes={setAttributes}
          breakpoint={breakpoint}
          breakpoints={breakpoints}
          disabled={isSliderEnabled}
          isPropertyVisible={isPropertyVisible}
        />
      </div>
    </Fragment>
  );
};
