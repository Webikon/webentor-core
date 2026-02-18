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
   * Filter allowed blocks used in webentor/e-table-row inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.e-table-row.allowedBlocks',
    ['webentor/e-table-cell'],
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/e-table-row inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template ?? [
    ['webentor/e-table-cell'],
    ['webentor/e-table-cell'],
  ];
  const template: TemplateArray = applyFilters(
    'webentor.core.e-table-row.template',
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
    <tr {...innerBlocksProps} className={`${innerBlocksProps.className}`}>
      {children}

      <td>
        <WebentorBlockAppender
          rootClientId={props.clientId}
          text={__('Add cell', 'webentor')}
        />
      </td>
    </tr>
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
  // TODO: extract icon to icon set
  icon: {
    src: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1920"
        style={{ minWidth: 16, minHeight: 16, width: 16, height: 16 }}
      >
        <path
          fillRule="evenodd"
          d="M1694.118 0C1818.692 0 1920 101.308 1920 225.882v1468.236c0 124.574-101.308 225.882-225.882 225.882H225.882C101.308 1920 0 1818.692 0 1694.118V225.882C0 101.308 101.308 0 225.882 0Zm.226 1355.294h-339.05v338.824h339.05v-338.824Zm-564.932 0H790.588v338.824h338.824v-338.824Zm-564.706 0H225.882v338.824h338.824v-338.824Zm564.706-1129.412H790.588v338.824h338.824V225.882Zm-564.706 0H225.882v338.824h338.824V225.882Zm1129.412 0h-338.824v338.824h338.824V225.882Z"
        />
      </svg>
    ),
  },
});
