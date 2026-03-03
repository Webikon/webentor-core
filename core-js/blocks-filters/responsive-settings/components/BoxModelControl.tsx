import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';

import { SelectOption } from '../types';
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
  disabled?: boolean;
}

const LINK_MODES: LinkMode[] = ['all', 'horizontal', 'vertical', 'individual'];

const LINK_MODE_LABELS: Record<LinkMode, string> = {
  all: 'All sides linked',
  horizontal: 'Left + Right linked',
  vertical: 'Top + Bottom linked',
  individual: 'Individual sides',
};

/**
 * Resolves which sides are grouped together for a given link mode.
 * Returns arrays of side names that should receive the same value when one changes.
 */
const getLinkedGroups = (
  sides: Side[],
  mode: LinkMode,
): Record<string, string[]> => {
  const names = sides.map((s) => s.name);
  const top = names.find((n) => n.includes('top'));
  const bottom = names.find((n) => n.includes('bottom'));
  const left = names.find((n) => n.includes('left'));
  const right = names.find((n) => n.includes('right'));

  switch (mode) {
    case 'all':
      return { all: names };
    case 'horizontal':
      return {
        horizontal: [left, right].filter(Boolean) as string[],
        top: top ? [top] : [],
        bottom: bottom ? [bottom] : [],
      };
    case 'vertical':
      return {
        vertical: [top, bottom].filter(Boolean) as string[],
        left: left ? [left] : [],
        right: right ? [right] : [],
      };
    case 'individual':
    default:
      return Object.fromEntries(names.map((n) => [n, [n]]));
  }
};

/**
 * Visual box-model control for margin or padding.
 * Renders a box-shaped layout with top/right/bottom/left select controls
 * and link mode cycling (all → horizontal → vertical → individual).
 */
export const BoxModelControl = ({
  type,
  sides,
  attributes,
  setAttributes,
  attributeKey,
  breakpoint,
  disabled = false,
}: BoxModelControlProps) => {
  const linkModeKey = `_${type}LinkMode`;
  const currentLinkMode: LinkMode =
    attributes[attributeKey]?.[linkModeKey]?.value?.[breakpoint] || 'individual';

  const cycleLinkMode = () => {
    const idx = LINK_MODES.indexOf(currentLinkMode);
    const next = LINK_MODES[(idx + 1) % LINK_MODES.length];
    setAttributes(
      setImmutably(
        attributes,
        [attributeKey, linkModeKey, 'value', breakpoint],
        next,
      ),
    );
  };

  const handleChange = (sideName: string, value: string) => {
    const groups = getLinkedGroups(sides, currentLinkMode);
    // Find which group this side belongs to
    const linkedSides = Object.values(groups).find((g) =>
      g.includes(sideName),
    ) ?? [sideName];

    let newAttrs = { ...attributes };
    for (const linkedSide of linkedSides) {
      newAttrs = setImmutably(
        newAttrs,
        [attributeKey, linkedSide, 'value', breakpoint],
        value,
      );
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

  const topSide = sides.find((s) => s.name.includes('top'));
  const bottomSide = sides.find((s) => s.name.includes('bottom'));
  const leftSide = sides.find((s) => s.name.includes('left'));
  const rightSide = sides.find((s) => s.name.includes('right'));

  const getValue = (side?: Side) =>
    side
      ? (attributes[attributeKey]?.[side.name]?.value?.[breakpoint] ?? '')
      : '';

  const renderSelect = (side: Side | undefined, showLabel = true) => {
    if (!side) return null;
    return (
      <SelectControl
        label={showLabel ? side.label : undefined}
        hideLabelFromVision={!showLabel}
        value={getValue(side)}
        options={side.values}
        disabled={disabled}
        onChange={(val) => handleChange(side.name, val)}
        __nextHasNoMarginBottom
      />
    );
  };

  const isAllLinked = currentLinkMode === 'all';

  return (
    <div className="wbtr:my-2 wbtr:flex wbtr:flex-col wbtr:gap-2 wbtr:border wbtr:border-editor-border wbtr:p-2">
      <p className="wbtr:text-12 wbtr:uppercase">
        {type === 'margin' ? __('Margin', 'webentor') : __('Padding', 'webentor')}
      </p>

      <div className="wbtr:text-11 wbtr:text-center wbtr:opacity-60">
        {LINK_MODE_LABELS[currentLinkMode]}
      </div>

      {isAllLinked ? (
        <div style={{ maxWidth: '200px', margin: '0 auto' }}>
          {topSide && renderSelect(topSide, true)}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: 'auto auto auto',
            gap: '4px',
            alignItems: 'end',
          }}
        >
          <div style={{ gridColumn: '2', gridRow: '1' }}>
            {renderSelect(topSide)}
          </div>
          <div style={{ gridColumn: '1', gridRow: '2' }}>
            {renderSelect(leftSide)}
          </div>
          <div style={{ gridColumn: '3', gridRow: '2' }}>
            {renderSelect(rightSide)}
          </div>
          <div style={{ gridColumn: '2', gridRow: '3' }}>
            {renderSelect(bottomSide)}
          </div>
        </div>
      )}

      <LinkedValuesControl
        isLinked={currentLinkMode !== 'individual'}
        onToggle={cycleLinkMode}
        onReset={resetAll}
        resetDisabled={!hasAnyValue}
        linkLabel={__('Link sides', 'webentor')}
        unlinkLabel={__('Unlink sides', 'webentor')}
      />
    </div>
  );
};
