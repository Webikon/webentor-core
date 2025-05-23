import { store as blockEditorStore } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import {
  Button,
  ColorPalette,
  Dropdown,
  SelectControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';

import {
  getColorBySlug,
  getColorSlugByColor,
  isEmpty,
  setImmutably,
} from '@webentorCore/_utils';

import { BlockPanelProps } from '../../../types';
import { prepareTailwindBorderClassesFromSettings } from '../../../utils';
import { getBorderProperties } from './properties';

interface BorderSettingsProps extends BlockPanelProps {
  breakpoint: string;
}

interface BorderSide {
  width?: string; // E.g. '1', '2', '4',...
  style?: string; // E.g. 'solid', 'dashed',...
  color?: string; // E.g. 'black', 'red',...
}

interface BorderValue {
  top?: BorderSide;
  right?: BorderSide;
  bottom?: BorderSide;
  left?: BorderSide;
  linked?: boolean;
}

const WebentorBorderControl = ({
  label,
  value,
  onChange,
  colors,
  borderClasses,
  twTheme,
}: {
  label: string;
  value?: BorderSide;
  onChange: (value: BorderSide) => void;
  colors: any;
  borderClasses: string[];
  twTheme: any;
}) => {
  const properties = getBorderProperties(twTheme);

  return (
    <div className="wbtr:flex wbtr:items-center wbtr:gap-2">
      <Dropdown
        className="wbtr:border-control-dropdown"
        contentClassName="wbtr:p-4"
        renderToggle={({ isOpen, onToggle }) => (
          <Button
            onClick={onToggle}
            aria-expanded={isOpen}
            className={borderClasses.join(' ')}
          >
            {label}
          </Button>
        )}
        renderContent={() => (
          <div className="wbtr:flex wbtr:flex-col wbtr:gap-4">
            {properties.map((property) => (
              <SelectControl
                key={property.name}
                label={property.label}
                value={value?.[property.name]}
                options={property.values}
                onChange={(selectValue) =>
                  onChange({ ...value, [property.name]: selectValue })
                }
                className="wbtr:w-24"
              />
            ))}

            <div>
              <p className="wbtr:uppercase">{__('Color', 'webentor')}</p>
              <ColorPalette
                colors={colors}
                value={getColorBySlug(colors, value?.color)} // Get as hex value
                onChange={(color) =>
                  onChange({
                    ...value,
                    color: getColorSlugByColor(colors, color), // Save as slug
                  })
                }
                disableCustomColors
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export const BorderSettings = ({
  attributes,
  setAttributes,
  name,
  breakpoint,
  twTheme,
}: BorderSettingsProps) => {
  if (!attributes?.border) {
    return null;
  }

  const currentBorder: BorderValue = {
    ...(attributes.border.border?.value?.[breakpoint] || {}),
  };

  const blockSettings = getBlockType(name)?.attributes;
  const defaultBorderValue = blockSettings?.border?.default;

  const isLinked = currentBorder.linked ?? true;

  const borderTopClasses = prepareTailwindBorderClassesFromSettings(
    attributes,
    'border',
    'top',
  );

  const borderRightClasses = prepareTailwindBorderClassesFromSettings(
    attributes,
    'border',
    'right',
  );

  const borderBottomClasses = prepareTailwindBorderClassesFromSettings(
    attributes,
    'border',
    'bottom',
  );

  const borderLeftClasses = prepareTailwindBorderClassesFromSettings(
    attributes,
    'border',
    'left',
  );

  const borderClasses = [
    ...borderTopClasses,
    ...borderRightClasses,
    ...borderBottomClasses,
    ...borderLeftClasses,
  ];

  const colors = useSelect((select) => {
    return select(blockEditorStore).getSettings().colors;
  }, []);

  const onChange = (
    value: BorderSide,
    side?: 'top' | 'right' | 'bottom' | 'left',
  ) => {
    if (!side) return;

    if (isLinked) {
      // When linked, update all sides with the same value
      setAttributes(
        setImmutably(attributes, ['border', 'border', 'value', breakpoint], {
          ...currentBorder,
          top: value,
          right: value,
          bottom: value,
          left: value,
          linked: isLinked,
        }),
      );
    } else {
      // When not linked, update only the specified side
      setAttributes(
        setImmutably(attributes, ['border', 'border', 'value', breakpoint], {
          ...currentBorder,
          [side]: value,
          linked: isLinked,
        }),
      );
    }
  };

  const toggleLinked = () => {
    setAttributes(
      setImmutably(
        attributes,
        ['border', 'border', 'value', breakpoint, 'linked'],
        !isLinked,
      ),
    );
  };

  const resetBorder = () => {
    setAttributes(
      setImmutably(
        attributes,
        ['border', 'border', 'value'],
        defaultBorderValue?.border?.value,
      ),
    );
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '8px',
    alignItems: 'center',
    justifyItems: 'center',
  };

  return (
    <div className="wbtr:my-2 wbtr:flex wbtr:flex-col wbtr:gap-2 wbtr:border wbtr:border-editor-border wbtr:p-2">
      <p className="wbtr:text-12 wbtr:uppercase">{__('Border', 'webentor')}</p>

      <div style={containerStyle}>
        {isLinked ? (
          <>
            <div style={{ gridColumn: 'span 3', gridRow: 'span 3' }}>
              <WebentorBorderControl
                label={__('All Borders', 'webentor')}
                value={currentBorder.top}
                onChange={(value) => onChange(value, 'top')}
                colors={colors}
                borderClasses={borderClasses}
                twTheme={twTheme}
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ gridColumn: '2', gridRow: '1' }}>
              <WebentorBorderControl
                label={__('Top', 'webentor')}
                value={currentBorder.top}
                onChange={(value) => onChange(value, 'top')}
                colors={colors}
                borderClasses={borderTopClasses}
                twTheme={twTheme}
              />
            </div>
            <div style={{ gridColumn: '3', gridRow: '2' }}>
              <WebentorBorderControl
                label={__('Right', 'webentor')}
                value={currentBorder.right}
                onChange={(value) => onChange(value, 'right')}
                colors={colors}
                borderClasses={borderRightClasses}
                twTheme={twTheme}
              />
            </div>
            <div style={{ gridColumn: '2', gridRow: '3' }}>
              <WebentorBorderControl
                label={__('Bottom', 'webentor')}
                value={currentBorder.bottom}
                onChange={(value) => onChange(value, 'bottom')}
                colors={colors}
                borderClasses={borderBottomClasses}
                twTheme={twTheme}
              />
            </div>
            <div style={{ gridColumn: '1', gridRow: '2' }}>
              <WebentorBorderControl
                label={__('Left', 'webentor')}
                value={currentBorder.left}
                onChange={(value) => onChange(value, 'left')}
                colors={colors}
                borderClasses={borderLeftClasses}
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
              ? __('Unlink sides', 'webentor')
              : __('Link sides', 'webentor')
          }
        />

        <Button
          variant="tertiary"
          onClick={resetBorder}
          disabled={isEmpty(currentBorder)}
          label={__('Reset to defaults', 'webentor')}
          showTooltip
        >
          {__('Reset', 'webentor')}
        </Button>
      </div>
    </div>
  );
};
