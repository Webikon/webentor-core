/**
 * BlockLinkPanel — Standalone panel for block link settings.
 *
 * Block link is non-responsive, so this panel renders without
 * breakpoint tabs. Separated from DisplayLayoutPanel to avoid
 * confusion about its scope.
 */
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { registry } from '../registry';
import { BlockPanelProps } from '../types';

export const BlockLinkPanel = (props: BlockPanelProps) => {
  const { attributes } = props;
  const modules = registry.getByPanelGroup('blockLink');

  const hasAnyAttributes = modules.some((def) =>
    Object.keys(def.attributeSchema).some((key) => !!attributes?.[key]),
  );

  if (!hasAnyAttributes) return null;

  const hasNonDefaults = modules.some((def) =>
    def.hasActiveSettings(attributes, 'basic'),
  );

  return (
    <PanelBody
      title={__('Block Link', 'webentor') + (hasNonDefaults ? ' *' : '')}
      initialOpen={false}
    >
      {modules.map((def) => (
        <def.SettingsComponent key={def.name} {...props} breakpoint="basic" />
      ))}
    </PanelBody>
  );
};
