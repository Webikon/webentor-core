/**
 * LayoutSettings — display mode selector.
 *
 * Rendered inside the DisplayLayoutPanel at order: 10.
 * Reads from v2 'layout' attribute with v1 'display' fallback.
 */
import { getBlockSupport } from '@wordpress/blocks';
import { Fragment } from '@wordpress/element';

import { camelize } from '@webentorCore/_utils';

import { DisabledSliderInfo } from '../../components/DisabledSliderInfo';
import { ResponsiveSelectGroup } from '../../components/ResponsiveSelectGroup';
import { PropertyDefinition, SettingsComponentProps } from '../../types';
import { isSliderEnabledForBreakpoint } from '../../utils';
import { resolveSupportKeys } from '../../support-keys';
import { getLayoutProperties } from './properties';

export const LayoutSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  breakpoints,
  twTheme,
}: SettingsComponentProps) => {
  // Accept both v2 'layout' and v1 'display' attribute keys
  if (!attributes?.layout && !attributes?.display) {
    return null;
  }

  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );
  const layoutProperties = getLayoutProperties(name, twTheme);

  // Resolve supports: check both 'layout' and 'display' keys
  const resolved = resolveSupportKeys(
    getBlockSupport(name, 'webentor') as Record<string, any>,
  );
  const supports = resolved.layout;

  const isPropertyVisible = (property: PropertyDefinition) => {
    if (supports === true) return true;
    return supports?.[camelize(property.name)] === true;
  };

  // Use v2 key if available, fallback to v1 for un-migrated blocks
  const attributeKey = attributes?.layout ? 'layout' : 'display';

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
