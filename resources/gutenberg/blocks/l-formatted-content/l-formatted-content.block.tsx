import {
  InnerBlocks,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';

import block from './block.json';

/**
 * Edit component.
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#edit
 *
 * @param {object}   props                      					The block props.
 * @returns {Function}                                    Render the edit screen
 */

type AttributesType = {
  coverImage: string;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes } = props;

  const blockProps = useBlockProps();
  const innerBlocksProps = useInnerBlocksProps(blockProps, {});

  const classes = [];

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <div
      {...blockProps}
      className={`${blockProps.className} w-flexible-container ${classes.join(' ')} border border-dashed border-editor-border p-2`}
    >
      <div
        {...innerBlocksProps}
        className={`${innerBlocksProps.className} wbtr-border wbtr-border-editor-border wbtr-p-4 format-content`}
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
