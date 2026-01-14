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
  __experimentalNumberControl as NumberControl,
  PanelBody,
  SelectControl,
  TextControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';
import { usePostTypes } from '@webentorCore/blocks-utils/_use-post-types';

import block from './block.json';
import { TOOLSPANEL_DROPDOWNMENU_PROPS } from './constants';
import { TaxonomyControls } from './taxonomy-controls';

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
    perPage: number;
    postType: string[];
    queryId: string;
    taxQuery: Record<string, string[]>;
    parents: number[];
  };
  template?: TemplateArray;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;
  const { query } = attributes;
  const {
    // order,
    // orderBy,
    // author: authorIds,
    postType,
    // sticky,
    // inherit,
    taxQuery,
    // parents,
  } = query;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Filter allowed blocks used in webentor/e-query-loop inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.e-query-loop.allowedBlocks',
    // Allow only singular 'e-post-template' block to be added as child.
    ['webentor/e-post-template'],
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/e-query-loop inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template ?? [
    ['webentor/e-post-template', ['webentor/l-post-card']],
  ];
  const template: TemplateArray = applyFilters(
    'webentor.core.e-query-loop.template',
    defaultTemplate,
    blockProps,
    parentBlockProps,
  );

  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    allowedBlocks,
    template,
    templateLock: 'all',
  });

  const { postTypesTaxonomiesMap, postTypesSelectOptions } = usePostTypes();

  // TODO: add settings for these
  const showTaxControl = true;
  // const showAuthorControl = false;
  // const showSearchControl = false;

  const setQuery = (newQuery) =>
    setAttributes({ query: { ...query, ...newQuery } });

  const onPostTypeChange = (newValue) => {
    // Taxonomies are supported only for single post type, so we need to handle that
    const singlePostType =
      Array.isArray(newValue) && newValue.length === 1 ? newValue[0] : newValue;

    const updateQuery = { postType: singlePostType };
    // We need to dynamically update the `taxQuery` property,
    // by removing any not supported taxonomy from the query.
    const supportedTaxonomies = postTypesTaxonomiesMap[singlePostType];
    const updatedTaxQuery = Object.entries(taxQuery || {}).reduce(
      (accumulator, [taxonomySlug, terms]) => {
        if (supportedTaxonomies.includes(taxonomySlug)) {
          accumulator[taxonomySlug] = terms;
        }
        return accumulator;
      },
      {},
    );
    updateQuery.taxQuery = Object.keys(updatedTaxQuery).length
      ? updatedTaxQuery
      : undefined;

    if (singlePostType !== 'post') {
      updateQuery.sticky = '';
    }
    // We need to reset `parents` because they are tied to each post type.
    updateQuery.parents = [];
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
          <NumberControl
            label={__('Posts Per Page', 'webentor')}
            min={1}
            max={20}
            step="1"
            value={query.perPage}
            onChange={(value) => {
              if (isNaN(value) || value < 1 || value > 100) {
                return;
              }
              setQuery({
                perPage: value,
              });
            }}
          />

          <SelectControl
            __nextHasNoMarginBottom
            options={postTypesSelectOptions}
            value={Array.isArray(postType) ? postType : [postType]}
            label={__('Post type')}
            multiple
            onChange={onPostTypeChange}
            help={__(
              'WordPress contains different types of content and they are divided into collections called “Post types”. By default there are a few different ones such as blog posts and pages, but plugins could add more.',
            )}
          />

          <TextControl
            label={__('Query ID', 'webentor')}
            value={query.queryId}
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

        <ToolsPanel
          className="block-library-query-toolspanel__filters"
          label={__('Filters')}
          resetAll={() => {
            setQuery({
              author: '',
              parents: [],
              search: '',
              taxQuery: null,
            });
            // setQuerySearch('');
          }}
          dropdownMenuProps={TOOLSPANEL_DROPDOWNMENU_PROPS}
        >
          {showTaxControl && !Array.isArray(query.postType) && (
            <ToolsPanelItem
              label={__('Taxonomies')}
              hasValue={() =>
                Object.values(taxQuery || {}).some((terms) => !!terms.length)
              }
              onDeselect={() => setQuery({ taxQuery: null })}
            >
              <TaxonomyControls onChange={setQuery} query={query} />
            </ToolsPanelItem>
          )}

          {/* {showAuthorControl && (
            <ToolsPanelItem
              hasValue={() => !!authorIds}
              label={__('Authors')}
              onDeselect={() => setQuery({ author: '' })}
            >
              <AuthorControl value={authorIds} onChange={setQuery} />
            </ToolsPanelItem>
          )} */}

          {/* {showSearchControl && (
            <ToolsPanelItem
              hasValue={() => !!querySearch}
              label={__('Keyword')}
              onDeselect={() => setQuerySearch('')}
            >
              <TextControl
                __nextHasNoMarginBottom
                label={__('Keyword')}
                value={querySearch}
                onChange={setQuerySearch}
              />
            </ToolsPanelItem>
          )} */}
        </ToolsPanel>
      </InspectorControls>

      <div
        {...innerBlocksProps}
        className={`${innerBlocksProps.className} wbtr:relative wbtr:p-2 wbtr:pt-4`}
      >
        <div className="wbtr:pointer-events-none wbtr:absolute wbtr:inset-0 wbtr:h-full wbtr:w-full wbtr:border wbtr:border-editor-border wbtr:p-2 wbtr:pt-4"></div>

        <div className="wbtr:absolute wbtr:top-[2px] wbtr:left-2 wbtr:mb-1 wbtr:text-10 wbtr:opacity-50">
          {__('Query Loop', 'webentor')}
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
