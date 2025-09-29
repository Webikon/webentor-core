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
import { __ } from '@wordpress/i18n';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

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
  template?: TemplateArray;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes } = props;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Filter allowed blocks used in webentor/e-slider inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.e-slider.allowedBlocks',
    [
      'webentor/l-flexible-container',
      'webentor/e-query-loop',
      'webentor/e-picker-query-loop',
    ],
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/e-slider inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template;
  const template: TemplateArray = applyFilters(
    'webentor.core.e-slider.template',
    defaultTemplate,
    blockProps,
    parentBlockProps,
  );

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
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
      className={`${innerBlocksProps.className} slider-content wbtr:relative wbtr:border wbtr:border-editor-border wbtr:p-2 wbtr:pt-4`}
    >
      <div className="wbtr:absolute wbtr:top-[2px] wbtr:left-2 wbtr:mb-1 wbtr:text-10 wbtr:opacity-50">
        {__('Slider', 'webentor')}
      </div>

      {children}
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
