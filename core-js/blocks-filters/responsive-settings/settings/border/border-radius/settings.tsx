import { getBlockType } from '@wordpress/blocks';
import { Button, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';

import { isEmpty, setImmutably } from '@webentorCore/_utils';

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

const WebentorBorderRadiusControl = ({
  label,
  value,
  onChange,
  twTheme,
}: {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  twTheme: any;
}) => {
  const values = getBorderRadiusValues(twTheme);

  return (
    <SelectControl
      label={label}
      value={value ?? ''}
      options={values}
      onChange={onChange}
      className="wbtr:w-24"
    />
  );
};

export const BorderRadiusSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
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

  return (
    <div className="wbtr:my-2 wbtr:flex wbtr:flex-col wbtr:gap-2 wbtr:border wbtr:border-editor-border wbtr:p-2">
      <p className="wbtr:text-12 wbtr:uppercase">
        {__('Border Radius', 'webentor')}
      </p>

      <div style={containerStyle}>
        {isLinked ? (
          <>
            <div style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
              <WebentorBorderRadiusControl
                label={__('All Corners', 'webentor')}
                value={currentBorderRadius?.topLeft}
                onChange={(value) => onChange(value, 'topLeft')}
                twTheme={twTheme}
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
              />
            </div>
            <div style={{ gridColumn: '2', gridRow: '1' }}>
              <WebentorBorderRadiusControl
                label={__('Top Right', 'webentor')}
                value={currentBorderRadius?.topRight}
                onChange={(value) => onChange(value, 'topRight')}
                twTheme={twTheme}
              />
            </div>
            <div style={{ gridColumn: '2', gridRow: '2' }}>
              <WebentorBorderRadiusControl
                label={__('Bottom Right', 'webentor')}
                value={currentBorderRadius?.bottomRight}
                onChange={(value) => onChange(value, 'bottomRight')}
                twTheme={twTheme}
              />
            </div>
            <div style={{ gridColumn: '1', gridRow: '2' }}>
              <WebentorBorderRadiusControl
                label={__('Bottom Left', 'webentor')}
                value={currentBorderRadius?.bottomLeft}
                onChange={(value) => onChange(value, 'bottomLeft')}
                twTheme={twTheme}
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
