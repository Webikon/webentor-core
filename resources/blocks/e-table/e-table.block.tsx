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
 * @param {object}   props.attributes           					Block attributes.
 * @param {string}   props.className            					Class name for the block.
 * @param {Function} props.setAttributes        					Sets the value for block attributes.
 * @returns {Function} Render the edit screen
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
   * Filter allowed blocks used in webentor/e-table inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.e-table.allowedBlocks',
    ['webentor/e-table-row'],
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/e-table inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template ?? [
    [
      'webentor/e-table-row',
      [['webentor/e-table-cell', 'webentor/e-table-cell']],
    ],
    [
      'webentor/e-table-row',
      ['webentor/e-table-cell', 'webentor/e-table-cell'],
    ],
    [
      'webentor/e-table-row',
      ['webentor/e-table-cell', 'webentor/e-table-cell'],
    ],
  ];
  const template: TemplateArray = applyFilters(
    'webentor.core.e-table.template',
    defaultTemplate,
    blockProps,
    parentBlockProps,
  );

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    allowedBlocks,
    template,
    renderAppender: false, // Disable the default appender
  });

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <div {...blockProps}>
      <div className="wp-block-table">
        <table className="wbtr:w-full">
          <tbody {...innerBlocksProps}>
            {children}

            <tr></tr>
          </tbody>
        </table>

        <div className="wbtr:my-2">
          <WebentorBlockAppender
            rootClientId={props.clientId}
            text={__('Add rows', 'webentor')}
          />
        </div>
      </div>
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
