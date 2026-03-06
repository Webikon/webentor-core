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
 * @see ./migration.ts — display value helpers (v1/v2 dual-read)
 * @see ./support-keys.ts — backward-compatible support key resolution
 */
import { registerBlockExtension } from '@10up/block-components';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { ToolbarGroup } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { AppliedClassesViewer } from './components/AppliedClassesViewer';
import { DebugPanel } from './components/DebugPanel';
import { includedBlocks } from './constants';
import {
  BlockLinkPanel,
  BorderPanel,
  DisplayLayoutPanel,
  SpacingPanel,
} from './panels';
import { registry } from './registry';
import { resolveSupportKeys } from './support-keys';
import { BlockPanelProps } from './types';
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
   * Also normalizes v1 support keys to v2 via resolveSupportKeys().
   */
  addFilter(
    'blocks.registerBlockType',
    'webentor/addResponsiveSettingsAttributes',
    (settings, name) => {
      // Normalize support keys so downstream code only sees v2 names
      const webentorSupports = resolveSupportKeys(
        settings?.supports?.webentor,
      );

      const allDefs = registry.getAll();

      for (const def of allDefs) {
        const supportedByRegistry = registry.isSupported(
          { ...settings?.supports, webentor: webentorSupports },
          def,
        );

        // Legacy fallback: includedBlocks arrays (currently all empty)
        const supportedByLegacy = Array.isArray(def.supportKey)
          ? def.supportKey.some((k) => includedBlocks[k]?.includes(name))
          : includedBlocks[def.supportKey]?.includes(name);

        if (!supportedByRegistry && !supportedByLegacy) continue;

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

      // Add migration version attribute to all blocks that have any responsive settings
      if (settings.attributes?.display || settings.attributes?.layout) {
        settings.attributes._responsiveSettingsVersion = {
          type: 'number',
          default: 2,
        };
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
 * v1→v2 attribute migration is handled globally in PHP.
 */
const BlockEdit = (props: BlockPanelProps) => {
  const breakpoints: string[] = applyFilters('webentor.core.twBreakpoints', [
    'basic',
  ]);
  const twTheme: WebentorConfig['theme'] = applyFilters(
    'webentor.core.twTheme',
    {},
  );

  return (
    <Fragment>
      <BlockControls>
        <ToolbarGroup>
          <AppliedClassesViewer {...props} breakpoints={breakpoints} twTheme={twTheme} />
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <SpacingPanel
          {...props}
          breakpoints={breakpoints}
          twTheme={twTheme}
        />
        <DisplayLayoutPanel
          {...props}
          breakpoints={breakpoints}
          twTheme={twTheme}
        />
        <BorderPanel
          {...props}
          breakpoints={breakpoints}
          twTheme={twTheme}
        />
        <BlockLinkPanel
          {...props}
          breakpoints={breakpoints}
          twTheme={twTheme}
        />
        <DebugPanel
          {...props}
          breakpoints={breakpoints}
          twTheme={twTheme}
        />
      </InspectorControls>
    </Fragment>
  );
};

export { initResponsiveSettings };
