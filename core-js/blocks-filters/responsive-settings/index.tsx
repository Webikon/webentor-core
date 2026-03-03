import { registerBlockExtension } from '@10up/block-components';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';

import { WebentorConfig } from '@webentorCore/types/_webentor-config';

import { includedBlocks } from './constants';
import { registry } from './registry';
import { generateClassNames, inlineStyleGenerator } from './utils';

// Side-effect imports: each module self-registers with the SettingsRegistry
import './settings/block-link';
import './settings/border';
import './settings/container';
import './settings/spacing';

const initResponsiveSettings = () => {
  // Attribute registration driven by the registry instead of 8 hardcoded blocks
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

        // Legacy fallback: includedBlocks arrays (currently all empty)
        const supportedByLegacy = Array.isArray(def.supportKey)
          ? def.supportKey.some((k) => includedBlocks[k]?.includes(name))
          : includedBlocks[def.supportKey]?.includes(name);

        if (!supportedByRegistry && !supportedByLegacy) continue;

        // Merge attribute schemas from the definition
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

        // Custom attribute initialiser (e.g. display defaults)
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

const BlockEdit = (props) => {
  const breakpoints: string[] = applyFilters('webentor.core.twBreakpoints', [
    'basic',
  ]);
  const twTheme: WebentorConfig['theme'] = applyFilters(
    'webentor.core.twTheme',
    {},
  );

  const allSettings = registry.getAll();

  console.log(allSettings);

  return (
    <Fragment>
      <InspectorControls>
        {allSettings.map((setting) => (
          <setting.PanelComponent
            key={setting.name}
            {...props}
            breakpoints={breakpoints}
            twTheme={twTheme}
          />
        ))}
      </InspectorControls>
    </Fragment>
  );
};

export { initResponsiveSettings };
