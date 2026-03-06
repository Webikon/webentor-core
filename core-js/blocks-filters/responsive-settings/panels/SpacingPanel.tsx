/**
 * SpacingPanel — Thin panel wrapper for panelGroup='spacing'.
 *
 * Renders a single PanelBody with responsive breakpoint tabs,
 * then loops over all setting modules registered to the 'spacing'
 * panel group and renders each one's SettingsComponent inline.
 */
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BreakpointResetButton } from '../components/BreakpointResetButton';
import { ResponsiveTabPanel } from '../components/ResponsiveTabPanel';
import { registry } from '../registry';
import { BlockPanelProps } from '../types';

export const SpacingPanel = (props: BlockPanelProps) => {
  const { attributes, setAttributes, breakpoints } = props;
  const modules = registry.getByPanelGroup('spacing');

  const hasAnyAttributes = modules.some((def) =>
    Object.keys(def.attributeSchema).some((key) => !!attributes?.[key]),
  );

  if (!hasAnyAttributes) return null;

  const hasActiveSettings = (breakpoint: string): boolean => {
    return modules.some((def) => def.hasActiveSettings(attributes, breakpoint));
  };

  // Panel-level check: any breakpoint has non-default values
  const hasNonDefaults = breakpoints.some((bp) => hasActiveSettings(bp));

  return (
    <PanelBody
      title={__('Spacing Settings', 'webentor') + (hasNonDefaults ? ' *' : '')}
      initialOpen={false}
    >
      <ResponsiveTabPanel
        breakpoints={breakpoints}
        hasActiveSettings={hasActiveSettings}
        screens={props.twTheme?.screens as Record<string, any>}
      >
        {(breakpoint) => (
          <>
            <BreakpointResetButton
              panelGroup="spacing"
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
