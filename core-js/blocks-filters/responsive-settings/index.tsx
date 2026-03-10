/**
 * Responsive Settings — Entry point.
 *
 * This module provides per-breakpoint block controls for spacing, layout,
 * sizing, flexbox, grid, flex/grid item, border, and presets.
 *
 * Architecture:
 * - Each setting module self-registers with the SettingsRegistry via side-effect imports
 * - Panel components (SpacingPanel, DisplayLayoutPanel, BorderPanel) query the
 *   registry for their panelGroup and render each module's SettingsComponent
 * - BlockEdit renders the panels in InspectorControls
 *
 * @see ./registry.ts — SettingsRegistry singleton
 * @see ./migration.ts — display value helpers
 */
import { registerBlockExtension } from '@10up/block-components';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';

import { WebentorConfig } from '../../types/_webentor-config';
import { AppliedClassesViewer } from './components/AppliedClassesViewer';
import { DebugPanel } from './components/DebugPanel';
import {
  BlockLinkPanel,
  BorderPanel,
  DisplayLayoutPanel,
  SpacingPanel,
} from './panels';
import { registry } from './registry';
import { generateClassNames, inlineStyleGenerator } from './utils';

// Side-effect imports: each module self-registers with the SettingsRegistry.
// Order doesn't matter — each module declares its own panelGroup and order.
import './settings/block-link';
import './settings/border';
import './settings/flex-item';
import './settings/flexbox';
import './settings/grid';
import './settings/grid-item';
import './settings/layout';
import './settings/presets';
import './settings/sizing';
import './settings/spacing';

const initResponsiveSettings = () => {
  /**
   * Attribute registration filter.
   * Iterates over all registered setting modules and merges their
   * attribute schemas into blocks that declare support for them.
   */
  addFilter(
    'blocks.registerBlockType',
    'webentor/addResponsiveSettingsAttributes',
    (settings, name) => {
      const allDefs = registry.getAll();

      for (const def of allDefs) {
        const supportedByRegistry = registry.isSupported(
          settings?.supports,
          def,
        );
        if (!supportedByRegistry) continue;

        // Merge attribute schemas from the module definition
        for (const [attrKey, schema] of Object.entries(def.attributeSchema)) {
          settings.attributes = {
            ...settings.attributes,
            [attrKey]: {
              ...schema,
              default:
                settings.attributes?.[attrKey]?.default || schema.default,
            },
          };
        }

        // Custom attribute initialiser (e.g. display flex default)
        if (def.initAttributes) {
          settings = def.initAttributes(settings, name);
        }
      }

      return settings;
    },
  );

  registerBlockExtension('*', {
    extensionName: 'webentor.core.addResponsiveSettings',
    attributes: {},
    inlineStyleGenerator,
    classNameGenerator: generateClassNames,
    order: 'after',
    Edit: BlockEdit,
  });
};

/**
 * BlockEdit — renders InspectorControls panels for responsive settings.
 *
 * Uses panel wrappers (SpacingPanel, DisplayLayoutPanel, BorderPanel, BlockLinkPanel)
 * which internally query the registry for their panelGroup's modules.
 *
 * Responsive settings migration is handled globally in PHP.
 */
const BlockEdit = (props: any) => {
  const breakpoints = applyFilters('webentor.core.twBreakpoints', [
    'basic',
  ]) as string[];
  const twTheme = applyFilters(
    'webentor.core.twTheme',
    {},
  ) as WebentorConfig['theme'];

  return (
    <Fragment>
      <BlockControls>
        <ToolbarGroup>
          <AppliedClassesViewer
            {...props}
            breakpoints={breakpoints}
            twTheme={twTheme}
          />
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <SpacingPanel {...props} breakpoints={breakpoints} twTheme={twTheme} />
        <DisplayLayoutPanel
          {...props}
          breakpoints={breakpoints}
          twTheme={twTheme}
        />
        <BorderPanel {...props} breakpoints={breakpoints} twTheme={twTheme} />
        <BlockLinkPanel
          {...props}
          breakpoints={breakpoints}
          twTheme={twTheme}
        />
        <DebugPanel {...props} breakpoints={breakpoints} twTheme={twTheme} />
      </InspectorControls>
    </Fragment>
  );
};

export { initResponsiveSettings };
