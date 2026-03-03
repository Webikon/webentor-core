import { BoxModelControl } from '../../components/BoxModelControl';
import { DisabledSliderInfo } from '../../components/DisabledSliderInfo';
import { BlockPanelProps } from '../../types';
import { isSliderEnabledForBreakpoint } from '../../utils';
import { getMarginSides, getPaddingSides } from './properties';

interface SpacingSettingsProps extends BlockPanelProps {
  breakpoint: string;
}

export const SpacingSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  twTheme,
}: SpacingSettingsProps) => {
  if (!attributes?.spacing) {
    return null;
  }

  const isSliderEnabled = isSliderEnabledForBreakpoint(
    name,
    attributes,
    breakpoint,
  );

  return (
    <div style={{ marginTop: '16px' }}>
      {isSliderEnabled && <DisabledSliderInfo />}

      <BoxModelControl
        type="margin"
        sides={getMarginSides(twTheme)}
        attributes={attributes}
        setAttributes={setAttributes}
        attributeKey="spacing"
        breakpoint={breakpoint}
        disabled={isSliderEnabled}
      />

      <BoxModelControl
        type="padding"
        sides={getPaddingSides(twTheme)}
        attributes={attributes}
        setAttributes={setAttributes}
        attributeKey="spacing"
        breakpoint={breakpoint}
        disabled={isSliderEnabled}
      />
    </div>
  );
};
