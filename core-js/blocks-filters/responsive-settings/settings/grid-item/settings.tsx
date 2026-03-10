/**
 * GridItemSettings — grid child controls (column span, row span, order).
 *
 * Contextual: only shows when the parent block's display is 'grid'.
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useBlockParent } from '../../../../blocks-utils/_use-block-parent';
import { DisabledSliderInfo } from '../../components/DisabledSliderInfo';
import { InheritedIndicator } from '../../components/InheritedIndicator';
import { ResponsiveSelectGroup } from '../../components/ResponsiveSelectGroup';
import {
  getDisplayInheritedFromBreakpoint,
  getEffectiveParentDisplayValue,
} from '../../migration';
import { SettingsComponentProps } from '../../types';
import { isSliderEnabledForBreakpoint } from '../../utils';
import { getGridItemProperties } from './properties';

const SECTION_STYLE = {
  marginTop: '16px',
  border: '1px solid #e0e0e0',
  padding: '8px',
};

export const GridItemSettings = ({
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

  if (effectiveParentDisplay !== 'grid') return null;
  if (!attributes?.gridItem) return null;

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
          {__('Grid Item settings', 'webentor')}
        </h3>
        {parentInheritedFrom && (
          <InheritedIndicator fromBreakpoint={parentInheritedFrom} />
        )}
        <div style={{ marginBottom: '8px', fontSize: '12px' }}>
          {__(
            'Parent block display setting is set to `Grid`, so current block also acts as grid item.',
            'webentor',
          )}
        </div>
        {isSliderEnabled && <DisabledSliderInfo />}
        <ResponsiveSelectGroup
          attributeKey="gridItem"
          properties={getGridItemProperties(twTheme)}
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
