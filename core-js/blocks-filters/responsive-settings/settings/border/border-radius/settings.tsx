import { getBlockType } from '@wordpress/blocks';
import { Button, SelectControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';

import { isEmpty, setImmutably } from '@webentorCore/_utils';

import { InheritedIndicator } from '../../../components/InheritedIndicator';
import {
  getEffectiveObjectValue,
  getObjectInheritedFromBreakpoint,
} from '../../../utils';
import { BlockPanelProps } from '../../../types';
import { getBorderRadiusValues } from './properties';

interface BorderRadiusSettingsProps extends BlockPanelProps {
  breakpoint: string;
}

interface BorderRadiusValue {
  topLeft?: string;
  topRight?: string;
  bottomRight?: string;
  bottomLeft?: string;
  linked?: boolean;
}

type CornerKey = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

const WebentorBorderRadiusControl = ({
  label,
  value,
  onChange,
  twTheme,
  inheritedValue,
  inheritedFrom,
}: {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  twTheme: any;
  inheritedValue?: string;
  inheritedFrom?: string | null;
}) => {
  const allValues = getBorderRadiusValues(twTheme);
  const isInherited = !value && !!inheritedValue && !!inheritedFrom;

  let options = allValues;
  if (isInherited) {
    const inheritedLabel =
      allValues.find((o) => o.value === inheritedValue)?.label ??
      inheritedValue;
    options = [
      {
        label: sprintf(__('%s (from %s)', 'webentor'), inheritedLabel, inheritedFrom),
        value: '',
      },
      ...allValues.filter((o) => o.value !== ''),
    ];
  }

  return (
    <SelectControl
      label={label}
      value={value ?? ''}
      options={options}
      onChange={onChange}
      className={`wbtr:w-24${isInherited ? ' wbtr-inherited-value' : ''}`}
    />
  );
};

export const BorderRadiusSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  breakpoints,
  twTheme,
}: BorderRadiusSettingsProps) => {
  if (!attributes?.border) {
    return null;
  }

  const currentBorderRadius: BorderRadiusValue = {
    ...(attributes.border.borderRadius?.value?.[breakpoint] || {}),
  };

  const blockSettings = getBlockType(name)?.attributes;
  const defaultBorderRadius = blockSettings?.border?.default;

  const isLinked = currentBorderRadius.linked ?? true;

  const onChange = (
    value: string,
    corner?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft',
  ) => {
    if (!corner) return;

    if (isLinked) {
      setAttributes(
        setImmutably(
          attributes,
          ['border', 'borderRadius', 'value', breakpoint],
          {
            ...currentBorderRadius,
            topLeft: value,
            topRight: value,
            bottomRight: value,
            bottomLeft: value,
            linked: isLinked,
          },
        ),
      );
    } else {
      setAttributes(
        setImmutably(
          attributes,
          ['border', 'borderRadius', 'value', breakpoint],
          {
            ...currentBorderRadius,
            [corner]: value,
            linked: isLinked,
          },
        ),
      );
    }
  };

  const toggleLinked = () => {
    setAttributes(
      setImmutably(
        attributes,
        ['border', 'borderRadius', 'value', breakpoint, 'linked'],
        !isLinked,
      ),
    );
  };

  const resetBorderRadius = () => {
    setAttributes(
      setImmutably(
        attributes,
        ['border', 'borderRadius', 'value'],
        defaultBorderRadius?.borderRadius?.value, // Reset to defaults
      ),
    );
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '8px',
    alignItems: 'center',
    justifyItems: 'center',
  };

  const radiusInheritedFrom = breakpoints?.length
    ? getObjectInheritedFromBreakpoint(
        attributes,
        'border',
        'borderRadius',
        breakpoint,
        breakpoints,
      )
    : null;

  // Resolve inherited per-corner values for placeholder display
  const effectiveRadius = breakpoints?.length
    ? getEffectiveObjectValue<BorderRadiusValue>(
        attributes,
        'border',
        'borderRadius',
        breakpoint,
        breakpoints,
      )
    : undefined;

  const getCornerInherited = (corner: CornerKey) => {
    const explicitVal = currentBorderRadius?.[corner];
    if (explicitVal) return { value: undefined, from: null };
    const inherited = effectiveRadius?.[corner];
    return { value: inherited || undefined, from: radiusInheritedFrom };
  };

  return (
    <div className="wbtr:my-2 wbtr:flex wbtr:flex-col wbtr:gap-2 wbtr:border wbtr:border-editor-border wbtr:p-2">
      <p className="wbtr:text-12 wbtr:uppercase">
        {__('Border Radius', 'webentor')}
      </p>
      {radiusInheritedFrom && (
        <InheritedIndicator fromBreakpoint={radiusInheritedFrom} />
      )}

      <div style={containerStyle}>
        {isLinked ? (
          <>
            <div style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
              <WebentorBorderRadiusControl
                label={__('All Corners', 'webentor')}
                value={currentBorderRadius?.topLeft}
                onChange={(value) => onChange(value, 'topLeft')}
                twTheme={twTheme}
                inheritedValue={getCornerInherited('topLeft').value}
                inheritedFrom={getCornerInherited('topLeft').from}
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ gridColumn: '1', gridRow: '1' }}>
              <WebentorBorderRadiusControl
                label={__('Top Left', 'webentor')}
                value={currentBorderRadius?.topLeft}
                onChange={(value) => onChange(value, 'topLeft')}
                twTheme={twTheme}
                inheritedValue={getCornerInherited('topLeft').value}
                inheritedFrom={getCornerInherited('topLeft').from}
              />
            </div>
            <div style={{ gridColumn: '2', gridRow: '1' }}>
              <WebentorBorderRadiusControl
                label={__('Top Right', 'webentor')}
                value={currentBorderRadius?.topRight}
                onChange={(value) => onChange(value, 'topRight')}
                twTheme={twTheme}
                inheritedValue={getCornerInherited('topRight').value}
                inheritedFrom={getCornerInherited('topRight').from}
              />
            </div>
            <div style={{ gridColumn: '2', gridRow: '2' }}>
              <WebentorBorderRadiusControl
                label={__('Bottom Right', 'webentor')}
                value={currentBorderRadius?.bottomRight}
                onChange={(value) => onChange(value, 'bottomRight')}
                twTheme={twTheme}
                inheritedValue={getCornerInherited('bottomRight').value}
                inheritedFrom={getCornerInherited('bottomRight').from}
              />
            </div>
            <div style={{ gridColumn: '1', gridRow: '2' }}>
              <WebentorBorderRadiusControl
                label={__('Bottom Left', 'webentor')}
                value={currentBorderRadius?.bottomLeft}
                onChange={(value) => onChange(value, 'bottomLeft')}
                twTheme={twTheme}
                inheritedValue={getCornerInherited('bottomLeft').value}
                inheritedFrom={getCornerInherited('bottomLeft').from}
              />
            </div>
          </>
        )}
      </div>

      <div className="wbtr:flex wbtr:justify-between">
        <Button
          icon={isLinked ? link : linkOff}
          onClick={toggleLinked}
          label={
            isLinked
              ? __('Unlink corners', 'webentor')
              : __('Link corners', 'webentor')
          }
        />

        <Button
          variant="tertiary"
          onClick={resetBorderRadius}
          disabled={isEmpty(currentBorderRadius)}
          label={__('Reset to defaults', 'webentor')}
          showTooltip
        >
          {__('Reset', 'webentor')}
        </Button>
      </div>
    </div>
  );
};
