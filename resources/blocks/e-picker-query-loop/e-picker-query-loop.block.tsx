import { ContentPicker } from '@10up/block-components';
import {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
  BlockEditProps,
  registerBlockType,
  TemplateArray,
} from '@wordpress/blocks';
import {
  Notice,
  PanelBody,
  SelectControl,
  TextControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';
import { usePostTypes } from '@webentorCore/blocks-utils/_use-post-types';

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
  query: {
    postType: string[];
    posts: [];
    queryId: string;
  };
  template?: TemplateArray;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;
  const { query } = attributes;
  const { postType, posts, queryId } = query;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Filter allowed blocks used in webentor/e-query-loop inner block
   */
  const allowedBlocks = applyFilters(
    'webentor.core.e-picker-query-loop.allowedBlocks',
    // Allow only singular 'e-post-template' block to be added as child.
    ['webentor/e-post-template'],
    blockProps,
    parentBlockProps,
  ) as string[];

  /**
   * Filter template used in webentor/e-query-loop inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template ?? [
    ['webentor/e-post-template', ['webentor/l-post-card']],
  ];
  const template = applyFilters(
    'webentor.core.e-picker-query-loop.template',
    defaultTemplate,
    blockProps,
    parentBlockProps,
  ) as TemplateArray;

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    allowedBlocks,
    template,
    templateLock: 'all',
  });

  const { postTypesSelectOptions } = usePostTypes();

  const setQuery = (newQuery) =>
    setAttributes({ query: { ...query, ...newQuery } });

  const onPostTypeChange = (newValue) => {
    const updateQuery = { postType: newValue };

    setQuery(updateQuery);
  };

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  return (
    <>
      <InspectorControls>
        <PanelBody title="Loop Settings" initialOpen={true}>
          {/* TODO: Maybe rework to nicer UI */}
          <SelectControl
            __nextHasNoMarginBottom
            options={postTypesSelectOptions}
            value={Array.isArray(postType) ? postType : [postType]}
            label={__('Post type')}
            multiple
            onChange={onPostTypeChange}
            help={__(
              'First select post type(s) from which you would be able to pick posts',
              'webentor',
            )}
          />

          <div className="wbtr:mb-3 wbtr:w-full wbtr:border wbtr:border-editor-border wbtr:p-2">
            <p>
              {__('Posts which would be displayed in the loop', 'webentor')}
            </p>
            {postType?.length > 0 ? (
              <ContentPicker
                onPickChange={(pickedContent) => {
                  setQuery({
                    posts: pickedContent,
                  });
                }}
                content={posts || []}
                mode="post"
                maxContentItems={20}
                isOrderable
                label={__('Select posts', 'webentor')}
                contentTypes={Array.isArray(postType) ? postType : [postType]}
              />
            ) : (
              <Notice status="error" isDismissible={false}>
                {__(
                  'Post type selection is required to select posts',
                  'webentor',
                )}
              </Notice>
            )}
          </div>

          <TextControl
            label={__('Query ID', 'webentor')}
            value={queryId}
            onChange={(value) => {
              setQuery({
                queryId: value,
              });
            }}
            help={__(
              'This can be used to filter query params via `webentor/query_loop_args` hook.',
            )}
          />
        </PanelBody>
      </InspectorControls>

      <div
        {...innerBlocksProps}
        className={`${innerBlocksProps.className} wbtr:relative wbtr:p-2 wbtr:pt-4`}
      >
        <div className="wbtr:pointer-events-none wbtr:absolute wbtr:inset-0 wbtr:h-full wbtr:w-full wbtr:border wbtr:border-editor-border wbtr:p-2 wbtr:pt-4"></div>

        <div className="wbtr:absolute wbtr:top-[2px] wbtr:left-2 wbtr:mb-1 wbtr:text-10 wbtr:opacity-50">
          {__('Picker Query Loop', 'webentor')}
        </div>

        {children}
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
