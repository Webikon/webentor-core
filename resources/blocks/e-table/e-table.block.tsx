import {
  InnerBlocks,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { WebentorBlockAppender } from '@webentorCore/blocks-components';

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
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes } = props;

  const blockProps = useBlockProps();
  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    allowedBlocks: ['webentor/e-table-row'],
    template: [
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
    ],
    renderAppender: false, // Disable the default appender
  });

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <div {...blockProps}>
      <div className="wp-block-table">
        <table className="w-full">
          <tbody {...innerBlocksProps}>
            {children}

            <tr></tr>
          </tbody>
        </table>

        <div className="my-2">
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
