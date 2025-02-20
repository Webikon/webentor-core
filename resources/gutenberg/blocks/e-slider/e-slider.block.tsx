import {
  InnerBlocks,
  RichText,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import block from './block.json';

/**
 * Edit component.
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#edit
 *
 * @param {object}   props                      					The block props.
 * @returns {Function}                                    Render the edit screen
 */

// TODO extend with slider/responsive settings
type AttributesType = {
  coverImage: string;
  sliderTitle: string;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes } = props;

  const blockProps = useBlockProps();
  const innerBlocksProps = useInnerBlocksProps(
    {},
    {
      allowedBlocks: ['webentor/l-flexible-container', 'webentor/e-query-loop'],
    },
  );

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <div {...blockProps}>
      <RichText
        className="mb-4 text-h2"
        label={__('Slider Title', 'webentor')}
        value={attributes.sliderTitle}
        onChange={(value) => props.setAttributes({ sliderTitle: value })}
        placeholder={__('Enter slider title', 'webentor')}
      />

      <div
        {...innerBlocksProps}
        className={`${innerBlocksProps.className} slider-content border border-editor-border p-4`}
      />
    </div>
  );
};

/**
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#save
 *
 * @return {null} Dynamic blocks do not save the HTML.
 */
const BlockSave = () => <InnerBlocks.Content />;

/**
 * Register block.
 */
registerBlockType(block, {
  edit: BlockEdit,
  save: BlockSave,
});
