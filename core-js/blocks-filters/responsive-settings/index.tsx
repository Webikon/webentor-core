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
import { createHigherOrderComponent } from '@wordpress/compose';
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
   * WP Core block spacing support injection.
   * Injects `supports.webentor.spacing` into configured WP Core blocks so the
   * responsive spacing panel appears automatically. Runs at priority 5,
   * before the attribute-merging filter at priority 10.
   *
   * The block list is filterable via `webentor.core.wpCoreBlocksWithSpacing`.
   */
  addFilter(
    'blocks.registerBlockType',
    'webentor/core/injectWpCoreBlockSpacingSupport',
    (settings, name) => {
      const wpCoreBlocks = applyFilters(
        'webentor.core.wpCoreBlocksWithSpacing',
        ['core/paragraph', 'core/heading'],
      ) as string[];

      if (!wpCoreBlocks.includes(name)) return settings;

      settings.supports = {
        ...settings.supports,
        webentor: {
          ...settings.supports?.webentor,
          spacing: true,
        },
        spacing: {
          ...settings.supports?.spacing,
          padding: false,
          margin: false,
        },
      };

      return settings;
    },
    5,
  );

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
    // No-op: prevents @10up/block-components from injecting responsive classes
    // into saved markup via blocks.getSaveContent.extraProps, which breaks
    // static core blocks (core/paragraph, core/heading) and triggers React
    // hooks warnings (generateClassNames uses hooks but the save filter
    // calls it outside React component context).
    classNameGenerator: () => '',
    order: 'after',
    Edit: BlockEdit,
  });

  /**
   * Editor-only responsive classes via editor.BlockListBlock.
   * Replaces the @10up classNameGenerator approach so that:
   * 1. Hooks (useBlockProps, useBlockParent) are called in component context
   * 2. Classes are only applied in the editor, not injected into saved HTML
   */
  const addResponsiveClassesHOC = createHigherOrderComponent(
    (BlockListBlock) => (props) => {
      const { attributes, className = '' } = props;
      const responsiveClasses = generateClassNames(attributes);

      if (!responsiveClasses) {
        return <BlockListBlock {...props} />;
      }

      return (
        <BlockListBlock
          {...props}
          className={`${className} ${responsiveClasses}`.trim()}
        />
      );
    },
    'addResponsiveClasses',
  );

  addFilter(
    'editor.BlockListBlock',
    'webentor/core/addResponsiveClasses',
    addResponsiveClassesHOC,
  );
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
