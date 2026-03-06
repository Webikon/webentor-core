/**
 * LayoutModeSettings — Unified container + item layout settings component.
 *
 * This component is now mainly used as a backward-compat helper.
 * In the v2 architecture, flexbox and grid settings render their own
 * SettingsComponent directly. This component is kept for any external
 * code that still uses it.
 *
 * Uses getDisplayValue/getParentDisplayValue for v1/v2 dual-read.
 */
import { __ } from '@wordpress/i18n';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import { getDisplayValue, getParentDisplayValue } from '../migration';
import { PropertyDefinition } from '../registry';
import { BlockPanelProps } from '../types';
import { isSliderEnabledForBreakpoint } from '../utils';
import { DisabledSliderInfo } from './DisabledSliderInfo';
import { ResponsiveSelectGroup } from './ResponsiveSelectGroup';

interface LayoutSection {
  attributeKey: string;
  title: string;
  properties: PropertyDefinition[];
}

interface LayoutItemSection extends LayoutSection {
  description: string;
}

interface LayoutModeSettingsProps extends BlockPanelProps {
  breakpoint: string;
  /** Display value that activates this layout mode ('flex' | 'grid') */
  displayValue: string;
  /** Container-level properties (shown when current block has this display) */
  container: LayoutSection;
  /** Item-level properties (shown when parent block has this display) */
  item: LayoutItemSection;
}

const SECTION_STYLE = {
  marginTop: '16px',
  border: '1px solid #e0e0e0',
  padding: '8px',
};

export const LayoutModeSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  displayValue,
  container,
  item,
}: LayoutModeSettingsProps) => {
  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );
  const parentBlock = useBlockParent();

  // v2 dual-read: checks layout.display then display.display
  const currentDisplayValue = getDisplayValue(attributes, breakpoint);
  const parentDisplayValue = getParentDisplayValue(
    parentBlock?.attributes,
    breakpoint,
  );

  const isParentMatch = parentDisplayValue === displayValue;
  const isCurrentMatch = currentDisplayValue === displayValue;

  if (!isCurrentMatch && !isParentMatch) {
    return null;
  }

  return (
    <>
      {isCurrentMatch && attributes?.[container.attributeKey] && (
        <div style={SECTION_STYLE}>
          <h3 style={{ marginBottom: '8px' }}>{container.title}</h3>
          {isSliderEnabled && <DisabledSliderInfo />}
          <ResponsiveSelectGroup
            attributeKey={container.attributeKey}
            properties={container.properties}
            attributes={attributes}
            setAttributes={setAttributes}
            breakpoint={breakpoint}
            disabled={isSliderEnabled}
          />
        </div>
      )}

      {isParentMatch && attributes?.[item.attributeKey] && (
        <div style={SECTION_STYLE}>
          <h3 style={{ marginBottom: '8px' }}>{item.title}</h3>
          <div style={{ marginBottom: '8px', fontSize: '12px' }}>
            {item.description}
          </div>
          {isSliderEnabled && <DisabledSliderInfo />}
          <ResponsiveSelectGroup
            attributeKey={item.attributeKey}
            properties={item.properties}
            attributes={attributes}
            setAttributes={setAttributes}
            breakpoint={breakpoint}
            disabled={isSliderEnabled}
          />
        </div>
      )}
    </>
  );
};
