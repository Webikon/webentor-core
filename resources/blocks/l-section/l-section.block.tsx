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

import { WebentorBlockAppender } from '@webentorCore/blocks-components';
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
  const { attributes, setAttributes, isSelected } = props;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Filter allowed blocks used in webentor/l-section inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.l-section.allowedBlocks',
    null,
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/l-section inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template ?? [];
  const template: TemplateArray = applyFilters(
    'webentor.core.l-section.template',
    defaultTemplate,
    blockProps,
    parentBlockProps,
  );

  const { children, ...innerBlocksProps } = useInnerBlocksProps(
    {},
    {
      allowedBlocks,
      template,
      renderAppender: false, // Disable default appender
    },
  );

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  const hasInnerBlocks = children && React.Children.count(children) > 0;

  return (
    <>
      <div {...blockProps} className={`w-section ${blockProps.className}`}>
        <div
          {...innerBlocksProps}
          className={`${innerBlocksProps.className} container wbtr:relative wbtr:flex wbtr:flex-col`}
        >
          {children}

          {/* Only show appender if no inner blocks or if the block is selected */}
          {(!hasInnerBlocks || isSelected) && (
            <div className="wbtr:my-2 wbtr:flex wbtr:items-center wbtr:justify-center">
              <WebentorBlockAppender
                rootClientId={props.clientId}
                text={__('Add Section Content', 'webentor')}
              />
            </div>
          )}
        </div>
      </div>
    </>
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
