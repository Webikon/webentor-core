import {
  InnerBlocks,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
  BlockEditProps,
  registerBlockType,
  TemplateArray,
} from '@wordpress/blocks';
import { applyFilters } from '@wordpress/hooks';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

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
  template?: TemplateArray;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes } = props;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Filter allowed blocks used in webentor/e-tabs inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.e-tabs.allowedBlocks',
    ['webentor/e-tab-container'],
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/e-tabs inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template ?? [
    ['webentor/e-tab-container'],
  ];
  const template: TemplateArray = applyFilters(
    'webentor.core.e-tabs.template',
    defaultTemplate,
    blockProps,
    parentBlockProps,
  );

  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    allowedBlocks,
    template,
  });

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <div
      {...innerBlocksProps}
      className={`${blockProps.className} ${innerBlocksProps.className} e-tabs wbtr:border wbtr:border-dashed wbtr:border-editor-border wbtr:p-2`}
    />
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
