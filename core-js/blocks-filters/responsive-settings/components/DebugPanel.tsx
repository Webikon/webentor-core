/**
 * DebugPanel — Collapsible inspector panel showing raw responsive
 * setting attributes. Gated behind window.WEBENTOR_DEBUG_RESPONSIVE_SETTINGS.
 */
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BlockPanelProps } from '../types';

declare global {
  interface Window {
    WEBENTOR_DEBUG_RESPONSIVE_SETTINGS?: boolean;
  }
}

const ATTRIBUTE_KEYS = [
  'layout',
  'sizing',
  'spacing',
  'flexbox',
  'grid',
  'flexItem',
  'gridItem',
  'border',
  '_preset',
  '_presetClasses',
  'blockLink',
  '_responsiveSettingsVersion',

  // v1 keys (stale data can cause phantom asterisks / reset issues)
  'display',
  'flexboxItem',
] as const;

export const DebugPanel = ({ attributes }: BlockPanelProps) => {
  // if (!window.WEBENTOR_DEBUG_RESPONSIVE_SETTINGS) return null;

  const debugData: Record<string, any> = {};
  for (const key of ATTRIBUTE_KEYS) {
    if (attributes?.[key] !== undefined) {
      debugData[key] = attributes[key];
    }
  }

  return (
    <PanelBody
      title={__('Debug: Responsive Settings', 'webentor')}
      initialOpen={false}
    >
      <pre
        style={{
          fontSize: '10px',
          lineHeight: '1.4',
          maxHeight: '400px',
          overflow: 'auto',
          background: '#f0f0f0',
          padding: '8px',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {JSON.stringify(debugData, null, 2)}
      </pre>
    </PanelBody>
  );
};
