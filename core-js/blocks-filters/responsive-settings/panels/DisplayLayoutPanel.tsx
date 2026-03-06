/**
 * DisplayLayoutPanel — Thin panel wrapper for panelGroup='displayLayout'.
 *
 * Groups presets, layout, sizing, flexbox, grid, flex-item, and grid-item
 * into a single "Display & Layout Settings" panel. Each module renders
 * conditionally (e.g. flexbox only shows when display=flex).
 *
 * The panel also supports a filter hook for injecting content before tabs
 * (e.g. preset buttons or block-specific UI).
 */
import { PanelBody } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

import { BreakpointResetButton } from '../components/BreakpointResetButton';
import { ResponsiveTabPanel } from '../components/ResponsiveTabPanel';
import { getDisplayValue, getParentDisplayValue } from '../migration';
import { registry } from '../registry';
import { PresetSettings } from '../settings/presets/settings';
import { BlockPanelProps, ClassGenContext } from '../types';

export const DisplayLayoutPanel = (props: BlockPanelProps) => {
  const { attributes, setAttributes, breakpoints } = props;
  const modules = registry.getByPanelGroup('displayLayout');

  const parentBlock = useBlockParent();

  const hasAnyAttributes = modules.some((def) =>
    Object.keys(def.attributeSchema).some((key) => !!attributes?.[key]),
  );

  if (!hasAnyAttributes) return null;

  const context: ClassGenContext = {
    blockName: props.name,
    supports: {},
    parentBlockAttributes: parentBlock?.attributes,
  };

  const hasActiveSettings = (breakpoint: string): boolean => {
    return modules.some((def) =>
      def.hasActiveSettings(attributes, breakpoint, context),
    );
  };

  const hasNonDefaults = breakpoints.some((bp) => hasActiveSettings(bp));

  const beforeTabsContent = applyFilters(
    'webentor.displayLayoutPanel.beforeTabs',
    null,
    props,
  );

  // Show presets above tabs (they apply globally, not per-breakpoint)
  const showPresets = !!attributes?._preset || attributes?._preset === '';

  return (
    <PanelBody
      title={
        __('Display & Layout Settings', 'webentor') +
        (hasNonDefaults ? ' *' : '')
      }
      initialOpen={true}
    >
      {showPresets && <PresetSettings {...props} />}
      {beforeTabsContent}
      <ResponsiveTabPanel
        breakpoints={breakpoints}
        hasActiveSettings={hasActiveSettings}
        screens={props.twTheme?.screens as Record<string, any>}
      >
        {(breakpoint) => (
          <>
            <BreakpointResetButton
              panelGroup="displayLayout"
              breakpoint={breakpoint}
              attributes={attributes}
              setAttributes={setAttributes}
            />
            {modules.map((def) => (
              <def.SettingsComponent
                key={def.name}
                {...props}
                breakpoint={breakpoint}
              />
            ))}
          </>
        )}
      </ResponsiveTabPanel>
    </PanelBody>
  );
};
