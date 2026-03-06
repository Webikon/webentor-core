import { Icon, SelectControl, Tooltip } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import {
  sidesBottom,
  sidesHorizontal,
  sidesLeft,
  sidesRight,
  sidesTop,
  sidesVertical,
} from '@wordpress/icons';

import { setImmutably } from '@webentorCore/_utils';

import { SelectOption } from '../types';
import { getEffectiveValue, getInheritedFromBreakpoint } from '../utils';
import { LinkedValuesControl, LinkMode } from './LinkedValuesControl';

interface Side {
  /** Attribute property name, e.g. 'margin-top' */
  name: string;
  label: string;
  values: SelectOption[];
}

interface BoxModelControlProps {
  type: 'margin' | 'padding';
  sides: Side[];
  attributes: Record<string, any>;
  setAttributes: (attrs: Record<string, any>) => void;
  /** Attribute group key, e.g. 'spacing' */
  attributeKey: string;
  breakpoint: string;
  /** Ordered breakpoint names for cascade indicators */
  breakpoints?: string[];
  disabled?: boolean;
}

// ── Prefix helpers ──────────────────────────────────────────────────
// Spacing values are stored as full Tailwind classes (e.g. "mt-4").
// When linking sides we need to map the scale part to each side's prefix.

/** Extract the TW utility prefix from a side's value list (e.g. "mt" from "mt-4"). */
const getSidePrefix = (side: Side): string | null => {
  const entry = side.values.find((v) => v.value !== '');
  if (!entry) return null;
  const match = entry.value.match(/^([a-z]+)-/);
  return match ? match[1] : null;
};

/** Extract the scale/key portion from a TW class: "mt-4" → "4", "mt-auto" → "auto". */
const extractScale = (value: string): string | null => {
  const match = value.match(/^[a-z]+-(.+)$/);
  return match ? match[1] : null;
};

/** Build the correct TW class for a target side given a scale: ("mr", "4") → "mr-4". */
const buildValue = (prefix: string, scale: string): string =>
  `${prefix}-${scale}`;

/**
 * Visual box-model control for margin or padding.
 * Two states: linked (H+V axis selects) or unlinked (4-corner grid).
 */
export const BoxModelControl = ({
  type,
  sides,
  attributes,
  setAttributes,
  attributeKey,
  breakpoint,
  breakpoints,
  disabled = false,
}: BoxModelControlProps) => {
  const linkModeKey = `_${type}LinkMode`;
  const currentLinkMode: LinkMode =
    (attributes[attributeKey]?.[linkModeKey]?.value?.[breakpoint] as
      | LinkMode
      | undefined) || 'linked';

  const topSide = sides.find((s) => s.name.includes('top'));
  const bottomSide = sides.find((s) => s.name.includes('bottom'));
  const leftSide = sides.find((s) => s.name.includes('left'));
  const rightSide = sides.find((s) => s.name.includes('right'));

  const isLinked = currentLinkMode === 'linked';

  const getValue = (side?: Side): string =>
    side
      ? (attributes[attributeKey]?.[side.name]?.value?.[breakpoint] ?? '')
      : '';

  // ── Mode toggle: sync pairs when switching to linked ──────────
  const setLinkMode = (nextMode: LinkMode) => {
    let newAttrs = setImmutably(
      attributes,
      [attributeKey, linkModeKey, 'value', breakpoint],
      nextMode,
    );

    // Sync pairs when switching to linked: left→right, top→bottom
    if (nextMode === 'linked') {
      if (leftSide && rightSide) {
        const leftVal = getValue(leftSide);
        if (leftVal) {
          const scale = extractScale(leftVal);
          const rightPrefix = getSidePrefix(rightSide);
          if (scale && rightPrefix) {
            newAttrs = setImmutably(
              newAttrs,
              [attributeKey, rightSide.name, 'value', breakpoint],
              buildValue(rightPrefix, scale),
            );
          }
        }
      }
      if (topSide && bottomSide) {
        const topVal = getValue(topSide);
        if (topVal) {
          const scale = extractScale(topVal);
          const bottomPrefix = getSidePrefix(bottomSide);
          if (scale && bottomPrefix) {
            newAttrs = setImmutably(
              newAttrs,
              [attributeKey, bottomSide.name, 'value', breakpoint],
              buildValue(bottomPrefix, scale),
            );
          }
        }
      }
    }

    setAttributes(newAttrs);
  };

  // ── Value change with pair propagation in linked mode ─────────
  const handleChange = (sideName: string, value: string) => {
    // Determine which sides to update together
    let targetSides: Side[];

    if (isLinked) {
      const isHorizontal =
        sideName.includes('left') || sideName.includes('right');
      if (isHorizontal) {
        targetSides = [leftSide, rightSide].filter(Boolean) as Side[];
      } else {
        targetSides = [topSide, bottomSide].filter(Boolean) as Side[];
      }
    } else {
      const side = sides.find((s) => s.name === sideName);
      targetSides = side ? [side] : [];
    }

    let newAttrs = { ...attributes };

    if (!value) {
      for (const side of targetSides) {
        newAttrs = setImmutably(
          newAttrs,
          [attributeKey, side.name, 'value', breakpoint],
          '',
        );
      }
    } else {
      const scale = extractScale(value);
      for (const side of targetSides) {
        const prefix = getSidePrefix(side);
        const mapped = scale && prefix ? buildValue(prefix, scale) : value;
        newAttrs = setImmutably(
          newAttrs,
          [attributeKey, side.name, 'value', breakpoint],
          mapped,
        );
      }
    }

    setAttributes(newAttrs);
  };

  const resetAll = () => {
    let newAttrs = { ...attributes };
    for (const side of sides) {
      newAttrs = setImmutably(
        newAttrs,
        [attributeKey, side.name, 'value', breakpoint],
        '',
      );
    }
    setAttributes(newAttrs);
  };

  const hasAnyValue = sides.some(
    (s) => !!attributes[attributeKey]?.[s.name]?.value?.[breakpoint],
  );

  // ── Select renderer with cascade indicators ─────────────────────
  const renderSelect = (
    side: Side | undefined,
    labelOverride?: string,
    hideLabel?: boolean,
  ) => {
    if (!side) return null;

    const explicitValue = getValue(side);
    let options = side.values;
    let inheritedClassName = '';

    if (!explicitValue && breakpoints?.length) {
      const inheritedFrom = getInheritedFromBreakpoint(
        attributes,
        attributeKey,
        side.name,
        breakpoint,
        breakpoints,
      );
      if (inheritedFrom) {
        const inheritedValue = getEffectiveValue(
          attributes,
          attributeKey,
          side.name,
          breakpoint,
          breakpoints,
        );
        if (inheritedValue) {
          const label =
            side.values.find((o) => o.value === inheritedValue)?.label ??
            inheritedValue;
          const placeholderText = sprintf(
            __('%s (from %s)', 'webentor'),
            label,
            inheritedFrom,
          );
          options = [
            { label: placeholderText, value: '' },
            ...side.values.filter((o) => o.value !== ''),
          ];
          inheritedClassName = 'wbtr-inherited-value';
        }
      }
    }

    return (
      <SelectControl
        label={labelOverride ?? side.label}
        hideLabelFromVision={hideLabel}
        value={explicitValue}
        options={options}
        disabled={disabled}
        onChange={(val) => handleChange(side.name, val)}
        className={inheritedClassName}
        __nextHasNoMarginBottom
      />
    );
  };

  return (
    <div className="wbtr:my-2 wbtr:flex wbtr:flex-col wbtr:gap-2 wbtr:border wbtr:border-editor-border wbtr:p-2">
      <div className="wbtr:flex wbtr:items-center wbtr:gap-2">
        <p className="wbtr:mb-0! wbtr:text-12 wbtr:uppercase">
          {type === 'margin'
            ? __('Margin', 'webentor')
            : __('Padding', 'webentor')}
        </p>

        <LinkedValuesControl
          mode={currentLinkMode}
          onModeChange={setLinkMode}
          onReset={resetAll}
          resetDisabled={!hasAnyValue}
        />
      </div>

      {isLinked ? (
        <div className="wbtr:flex wbtr:flex-col wbtr:gap-1.5">
          <div className="wbtr:flex wbtr:items-center wbtr:gap-2">
            <Tooltip text={__('Horizontal', 'webentor')}>
              <span className="wbtr:flex">
                <Icon icon={sidesHorizontal} size={20} />
              </span>
            </Tooltip>
            <div className="wbtr:flex-1">
              {renderSelect(leftSide, __('Horizontal', 'webentor'), true)}
            </div>
          </div>
          <div className="wbtr:flex wbtr:items-center wbtr:gap-2">
            <Tooltip text={__('Vertical', 'webentor')}>
              <span className="wbtr:flex">
                <Icon icon={sidesVertical} size={20} />
              </span>
            </Tooltip>
            <div className="wbtr:flex-1">
              {renderSelect(topSide, __('Vertical', 'webentor'), true)}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
          }}
        >
          <div className="wbtr:flex wbtr:items-center wbtr:gap-1.5">
            <Tooltip text={__('Top', 'webentor')}>
              <span className="wbtr:flex">
                <Icon icon={sidesTop} size={20} />
              </span>
            </Tooltip>
            <div className="wbtr:flex-1">
              {renderSelect(topSide, topSide?.label, true)}
            </div>
          </div>
          <div className="wbtr:flex wbtr:items-center wbtr:gap-1.5">
            <Tooltip text={__('Right', 'webentor')}>
              <span className="wbtr:flex">
                <Icon icon={sidesRight} size={20} />
              </span>
            </Tooltip>
            <div className="wbtr:flex-1">
              {renderSelect(rightSide, rightSide?.label, true)}
            </div>
          </div>
          <div className="wbtr:flex wbtr:items-center wbtr:gap-1.5">
            <Tooltip text={__('Bottom', 'webentor')}>
              <span className="wbtr:flex">
                <Icon icon={sidesBottom} size={20} />
              </span>
            </Tooltip>
            <div className="wbtr:flex-1">
              {renderSelect(bottomSide, bottomSide?.label, true)}
            </div>
          </div>
          <div className="wbtr:flex wbtr:items-center wbtr:gap-1.5">
            <Tooltip text={__('Left', 'webentor')}>
              <span className="wbtr:flex">
                <Icon icon={sidesLeft} size={20} />
              </span>
            </Tooltip>
            <div className="wbtr:flex-1">
              {renderSelect(leftSide, leftSide?.label, true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
