/**
 * Presets module registration.
 *
 * panelGroup: displayLayout, order: 0 (renders first, above layout/sizing)
 * Provides one-click layout configurations that populate the individual
 * settings below.
 *
 * Support keys: dedicated 'presets' opt-in plus 'layout' so existing
 * blocks keep the current preset UI behavior during the v2 support-key migration.
 */
import { registry } from '../../registry';
import { ClassGenContext } from '../../types';

/**
 * Preset custom classes are stored in _presetClasses and output directly.
 * These are non-decomposable classes needed for edge cases like
 * flex-wrap + gap + equal columns.
 */
const generatePresetClasses = (
  attributes: Record<string, any>,
  breakpoint: string,
  _context: ClassGenContext,
): string[] => {
  if (breakpoint !== 'basic') return [];

  const presetClasses = attributes?._presetClasses;
  if (!Array.isArray(presetClasses)) return [];

  return presetClasses;
};

/**
 * Presets are registered for attribute schema + class generation only.
 * The UI (PresetSettings) is rendered directly by DisplayLayoutPanel
 * above the breakpoint tabs, since presets apply globally.
 */
registry.register({
  name: 'presets',
  panelGroup: 'displayLayout',
  order: 0,
  attributeKey: '_preset',
  supportKey: ['presets', 'layout'],
  attributeSchema: {
    _preset: { type: 'string', default: '' },
    _presetClasses: { type: 'array', default: [] },
  },
  SettingsComponent: () => null,
  generateClasses: generatePresetClasses,
  hasActiveSettings: () => {
    // Presets are rendered above the tabs (non-responsive) — never flag a tab
    return false;
  },
});
