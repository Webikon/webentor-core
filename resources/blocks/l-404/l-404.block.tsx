import { RichText, useBlockProps } from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

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
  title: string;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;

  const blockProps = useBlockProps();

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <>
      <div {...blockProps} className={`${blockProps.className}`}>
        <div className="md:wbtr:pt-8 wbtr:flex wbtr:w-full wbtr:flex-col wbtr:items-center wbtr:gap-8 wbtr:border wbtr:border-editor-border wbtr:px-4 wbtr:pt-5 wbtr:pb-4">
          <div className="wbtr:flex wbtr:w-full wbtr:flex-col wbtr:items-center wbtr:gap-4">
            <span className="wbtr:font-heading wbtr:text-80 wbtr:text-gray-800">
              404
            </span>

            <RichText
              className="wbtr:text-gray-800 wbtr:uppercase"
              tagName="h2"
              placeholder={__('Title (required)', 'webentor')}
              value={attributes.title}
              onChange={(title) => setAttributes({ title })}
            />
          </div>

          <WebentorButton
            attributes={attributes}
            setAttributes={setAttributes}
            attributeName="button"
            hideLink
          />
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
const BlockSave = () => null;

/**
 * Register block.
 */
registerBlockType(block, {
  edit: BlockEdit,
  save: BlockSave,
});
