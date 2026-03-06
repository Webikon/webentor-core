/**
 * FlexItemSettings — flex child controls (grow, shrink, basis, order).
 *
 * Contextual: only shows when the parent block's display is 'flex'.
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import { DisabledSliderInfo } from '../../components/DisabledSliderInfo';
import { InheritedIndicator } from '../../components/InheritedIndicator';
import { ResponsiveSelectGroup } from '../../components/ResponsiveSelectGroup';
import {
  getDisplayInheritedFromBreakpoint,
  getEffectiveParentDisplayValue,
} from '../../migration';
import { SettingsComponentProps } from '../../types';
import { isSliderEnabledForBreakpoint } from '../../utils';
import { getFlexItemProperties } from './properties';

const SECTION_STYLE = {
  marginTop: '16px',
  border: '1px solid #e0e0e0',
  padding: '8px',
};

export const FlexItemSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  breakpoints,
  twTheme,
}: SettingsComponentProps) => {
  const parentBlock = useBlockParent();
  const effectiveParentDisplay = getEffectiveParentDisplayValue(
    parentBlock?.attributes,
    breakpoint,
    breakpoints,
  );

  if (effectiveParentDisplay !== 'flex') return null;

  const hasFlexItem = attributes?.flexItem;
  if (!hasFlexItem) return null;

  const attributeKey = 'flexItem';
  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );

  const parentInheritedFrom = parentBlock?.attributes
    ? getDisplayInheritedFromBreakpoint(
        parentBlock.attributes,
        breakpoint,
        breakpoints,
      )
    : null;

  return (
    <Fragment>
      <div style={SECTION_STYLE}>
        <h3 style={{ marginBottom: '8px' }}>
          {__('Flex Item settings', 'webentor')}
        </h3>
        {parentInheritedFrom && (
          <InheritedIndicator fromBreakpoint={parentInheritedFrom} />
        )}
        <div style={{ marginBottom: '8px', fontSize: '12px' }}>
          {__(
            'Parent block display setting is set to `Flex`, so current block also acts as flex item.',
            'webentor',
          )}
        </div>
        {isSliderEnabled && <DisabledSliderInfo />}
        <ResponsiveSelectGroup
          attributeKey={attributeKey}
          properties={getFlexItemProperties(twTheme)}
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
