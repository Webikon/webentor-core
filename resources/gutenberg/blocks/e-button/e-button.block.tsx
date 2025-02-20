import { useBlockProps } from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';

import { WebentorButton } from '@webentorCore/blocks-components';

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
  // button: WebentorButtonAttributes;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;

  const blockProps = useBlockProps();

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <div {...blockProps} className={`${blockProps.className}`}>
      <WebentorButton
        attributes={attributes}
        setAttributes={setAttributes}
        attributeName="button"
      />
    </div>
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
