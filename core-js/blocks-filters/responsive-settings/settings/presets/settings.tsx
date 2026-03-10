/**
 * PresetSettings — Quick layout preset buttons.
 *
 * Rendered at the top of the DisplayLayoutPanel (order: 0).
 * Selecting a preset populates the underlying layout/flexbox/grid
 * settings and marks the _preset attribute for tracking.
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '../../../../_utils';
import { BlockPanelProps, LayoutPreset } from '../../types';
import { getLayoutPresets } from './presets';

/**
 * Apply a preset's attribute values to the current block.
 * Merges preset values into existing attributes rather than replacing,
 * so non-preset settings are preserved.
 */
const applyPreset = (
  preset: LayoutPreset,
  attributes: Record<string, any>,
  setAttributes: (attrs: Record<string, any>) => void,
) => {
  let newAttrs = { ...attributes };

  // Apply each module's preset values
  for (const [attrKey, presetValues] of Object.entries(preset.applies)) {
    for (const [propName, propValue] of Object.entries(presetValues)) {
      const val = propValue as any;
      if (val?.value) {
        for (const [bp, bpValue] of Object.entries(val.value)) {
          newAttrs = setImmutably(
            newAttrs,
            [attrKey, propName, 'value', bp],
            bpValue,
          );
        }
      }
    }
  }

  // Store preset marker and custom classes
  newAttrs._preset = preset.id;
  if (preset.customClasses?.length) {
    newAttrs._presetClasses = preset.customClasses;
  } else {
    newAttrs._presetClasses = undefined;
  }

  setAttributes(newAttrs);
};

export const PresetSettings = ({
  attributes,
  setAttributes,
  name,
  twTheme,
}: BlockPanelProps) => {
  const activePreset = attributes?._preset;
  const presets = getLayoutPresets(name, twTheme);

  if (!presets.length) {
    return null;
  }

  return (
    <div style={{ marginTop: '8px', marginBottom: '8px' }}>
      <p
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          color: '#757575',
        }}
      >
        {__('Quick Layout Presets', 'webentor')}
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant={activePreset === preset.id ? 'primary' : 'secondary'}
            size="small"
            onClick={() => applyPreset(preset, attributes, setAttributes)}
            title={preset.description}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
