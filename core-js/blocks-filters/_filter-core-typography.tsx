import { registerBlockExtension } from '@10up/block-components';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow } from '@wordpress/components';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { WebentorTypographyPickerSelect } from '../blocks-components';

const BLOCKS = [
  'core/paragraph',
  'core/heading',
  'core/list',
  'core/post-title',
];

/**
 * BlockEdit
 *
 * a react component that will get mounted in the editor when the block
 * is selected. It is recommended to use Slots like `BlockControls` or
 * `InspectorControls` in here to put settings into the blocks
 * toolbar or sidebar.
 *
 * @param {object} props block props
 * @returns {JSX}
 */
function BlockEdit(props) {
  const { customTypography } = props.attributes;

  const options = applyFilters('webentor.core.customTypographyKeys', []);

  return (
    <InspectorControls group="styles">
      <PanelBody title={__('Custom Typography', 'webentor')} initialOpen={true}>
        <PanelRow>
          <WebentorTypographyPickerSelect
            value={customTypography}
            onChange={(value) => {
              props.setAttributes({ customTypography: value });
            }}
            options={options}
          />
        </PanelRow>
      </PanelBody>
    </InspectorControls>
  );
}

/**
 * generateClassNames
 *
 * a function to generate the new className string that should
 * get added to the wrapping element of the block.
 *
 * @param {object} attributes block attributes
 * @returns {string}
 */
function generateClassNames(attributes) {
  return attributes?.customTypography ?? '';
}

/**
 * a function to generate the new inline style object that should
 * get added to the wrapping element of the block.
 *
 * @param attributes
 * @returns
 */
function inlineStyleGenerator() {
  return {};
}

function initCustomTypographyFilter() {
  registerBlockExtension(BLOCKS, {
    extensionName: 'webentor/core/addCustomTypography',
    attributes: {
      customTypography: {
        type: 'string',
        default: '',
      },
    },
    inlineStyleGenerator: inlineStyleGenerator,
    classNameGenerator: generateClassNames,
    order: 'before',
    Edit: BlockEdit,
  });

  /**
   * Globally disable typography settings for blocks
   *
   * @param {object} settings block settings
   * @param {string} name block name
   * @returns {object} settings
   */
  addFilter(
    'blocks.registerBlockType',
    'webentor/core/disableTypography',
    function (settings) {
      if (settings?.supports?.typography) {
        settings.supports.typography = null;
      }

      return settings;
    },
  );
}

export { initCustomTypographyFilter };
