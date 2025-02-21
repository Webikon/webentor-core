// import {
//   InspectorControls,
//   useBlockProps,
//   useInnerBlocksProps,
// } from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';

import block from './block.json';

// import {
//   PanelBody,
//   PanelRow,
//   SelectControl,
//   ToggleControl,
// } from '@wordpress/components';
// import { __ } from '@wordpress/i18n';

/**
 * Edit component.
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#edit
 *
 * @param {object}   props                      					The block props.
 * @returns {Function}                                    Render the edit screen
 */

type AttributesType = {
  coverImage: string;
  sticky: string;
  hasContainer: boolean;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes } = props;

  // const blockProps = useBlockProps();
  // const innerBlocksProps = useInnerBlocksProps(blockProps, {});

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <>
      {/* <InspectorControls>
        <PanelBody title="Block Settings" initialOpen={true}>
          <PanelRow>
            <SelectControl
              label={__('Sticky type', 'webentor-blocks')}
              value={attributes.sticky}
              options={[
                { label: __('Not sticky', 'webentor-blocks'), value: '' },
                { label: __('Sticky', 'webentor-blocks'), value: 'sticky' },
                {
                  label: __('Sticky w/ hide on scroll', 'webentor-blocks'),
                  value: 'sticky-hide-scroll',
                },
              ]}
              onChange={(sticky) => setAttributes({ sticky })}
            />
          </PanelRow>

          <PanelRow>
            <ToggleControl
              label={__('Has container?', 'webentor-blocks')}
              checked={attributes.hasContainer}
              onChange={(hasContainer) => setAttributes({ hasContainer })}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>

      <div
        {...innerBlocksProps}
        className={`${blockProps.className} ${innerBlocksProps.className} l-header border border-dashed border-editor-border p-2`}
      /> */}

      {/* Custom header */}

      <div className="header wbtr:bg-gray-50 wbtr:p-5 wbtr:text-center">
        Header which will be displayed dynamically on FE
      </div>
    </>
  );
};

/**
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#save
 *
 * @return {null} Dynamic blocks do not save the HTML.
 */
const BlockSave = () => null;

/**
 * Register block.
 */
registerBlockType(block, {
  edit: BlockEdit,
  save: BlockSave,
});
