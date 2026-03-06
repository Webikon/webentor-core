/**
 * FlexboxSettings — flex container controls.
 *
 * Only renders when the current block's display is 'flex' at the
 * active breakpoint. Flex-item controls are handled by a separate module.
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { DisabledSliderInfo } from '../../components/DisabledSliderInfo';
import { InheritedIndicator } from '../../components/InheritedIndicator';
import { ResponsiveSelectGroup } from '../../components/ResponsiveSelectGroup';
import {
  getDisplayInheritedFromBreakpoint,
  getEffectiveDisplayValue,
} from '../../migration';
import { SettingsComponentProps } from '../../types';
import { isSliderEnabledForBreakpoint } from '../../utils';
import { getFlexboxProperties } from './properties';

const SECTION_STYLE = {
  marginTop: '16px',
  border: '1px solid #e0e0e0',
  padding: '8px',
};

export const FlexboxSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  breakpoints,
  twTheme,
}: SettingsComponentProps) => {
  const effectiveDisplay = getEffectiveDisplayValue(
    attributes,
    breakpoint,
    breakpoints,
  );
  const isCurrentFlex = effectiveDisplay === 'flex';

  if (!isCurrentFlex || !attributes?.flexbox) {
    return null;
  }

  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );

  const inheritedFrom = getDisplayInheritedFromBreakpoint(
    attributes,
    breakpoint,
    breakpoints,
  );

  return (
    <Fragment>
      <div style={SECTION_STYLE}>
        <h3 style={{ marginBottom: '8px' }}>
          {__('Flexbox settings', 'webentor')}
        </h3>
        {inheritedFrom && <InheritedIndicator fromBreakpoint={inheritedFrom} />}
        {isSliderEnabled && <DisabledSliderInfo />}
        <ResponsiveSelectGroup
          attributeKey="flexbox"
          properties={getFlexboxProperties(twTheme)}
          attributes={attributes}
          setAttributes={setAttributes}
          breakpoint={breakpoint}
          breakpoints={breakpoints}
          disabled={isSliderEnabled}
        />
      </div>
    </Fragment>
  );
};
