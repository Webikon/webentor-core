/**
 * BreakpointResetButton — Clears all setting values for a specific
 * breakpoint within a panel group. Renders as a small button at the
 * top of each breakpoint tab.
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { registry } from '../registry';
import { PanelGroup } from '../types';

interface BreakpointResetButtonProps {
  panelGroup: PanelGroup;
  breakpoint: string;
  attributes: Record<string, any>;
  setAttributes: (attrs: Record<string, any>) => void;
}

export const BreakpointResetButton = ({
  panelGroup,
  breakpoint,
  attributes,
  setAttributes,
}: BreakpointResetButtonProps) => {
  const modules = registry.getByPanelGroup(panelGroup);

  const hasAnyValues = modules.some((def) => {
    // Check all attribute keys the module owns.
    for (const key of Object.keys(def.attributeSchema)) {
      const attrGroup = attributes?.[key];
      if (!attrGroup || typeof attrGroup !== 'object') continue;
      if (
        Object.values(attrGroup).some(
          (prop: any) => prop?.value?.[breakpoint] !== undefined,
        )
      )
        return true;
    }
    return false;
  });

  if (!hasAnyValues) return null;

  const handleReset = () => {
    const patch: Record<string, any> = {};

    for (const def of modules) {
      // Iterate all attribute keys in the module's schema.
      for (const key of Object.keys(def.attributeSchema)) {
        const attrGroup = attributes?.[key];
        if (!attrGroup || typeof attrGroup !== 'object') continue;

        const updatedGroup = { ...attrGroup };
        let changed = false;

        for (const [propName, propData] of Object.entries(updatedGroup)) {
          const prop = propData as any;
          if (prop?.value?.[breakpoint] !== undefined) {
            const { [breakpoint]: _, ...rest } = prop.value;
            updatedGroup[propName] = { ...prop, value: rest };
            changed = true;
          }
        }

        if (changed) {
          patch[key] = updatedGroup;
        }
      }
    }

    if (Object.keys(patch).length) {
      setAttributes(patch);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '8px',
      }}
    >
      <Button
        variant="tertiary"
        isDestructive
        size="small"
        onClick={handleReset}
      >
        {__('Reset breakpoint', 'webentor')}
      </Button>
    </div>
  );
};
