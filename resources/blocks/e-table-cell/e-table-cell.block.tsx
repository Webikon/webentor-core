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
  PanelRow,
  ToggleControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

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
  rowSpan: number;
  colSpan: number;
  showAsTh: boolean;
  coverImage: string;
  template?: TemplateArray;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;
  const { rowSpan, colSpan, showAsTh } = attributes;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Filter allowed blocks used in webentor/e-table-cell inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.e-table-cell.allowedBlocks',
    ['core/paragraph', 'core/heading', 'core/list'],
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/e-table-cell inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template ?? [
    ['core/paragraph', { placeholder: __('Add cell content', 'webentor') }],
  ];
  const template: TemplateArray = applyFilters(
    'webentor.core.e-table-cell.template',
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

  const CellContent = (
    <div {...innerBlocksProps}>
      <div className="wbtr:mb-1 wbtr:text-10 wbtr:opacity-50">
        {__('Cell Content', 'webentor')}
      </div>

      {children}
    </div>
  );

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Block Settings', 'webentor')} initialOpen={true}>
          <PanelRow>
            <NumberControl
              label={__('Row Span', 'webentor')}
              help={__(
                'Set the number of rows this cell should span.',
                'webentor',
              )}
              value={rowSpan}
              onChange={(rowSpan) => setAttributes({ rowSpan })}
              min={0}
            />
          </PanelRow>

          <PanelRow>
            <NumberControl
              label={__('Col Span', 'webentor')}
              help={__(
                'Set the number of columns this cell should span.',
                'webentor',
              )}
              value={colSpan}
              onChange={(colSpan) => setAttributes({ colSpan })}
              min={0}
            />
          </PanelRow>

          <PanelRow>
            <ToggleControl
              label={__('Render as <th>> (head) cell', 'webentor')}
              checked={showAsTh}
              onChange={(showAsTh) => setAttributes({ showAsTh })}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>

      {showAsTh ? (
        <th
          className={`wbtr:border wbtr:border-dashed wbtr:border-black wbtr:p-2`}
          rowSpan={rowSpan}
          colSpan={colSpan}
        >
          {CellContent}
        </th>
      ) : (
        <td
          className={`wbtr:border wbtr:border-dashed wbtr:border-black wbtr:p-2`}
          rowSpan={rowSpan}
          colSpan={colSpan}
        >
          {CellContent}
        </td>
      )}
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
  // TODO: extract icon to icon set
  icon: {
    src: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 14"
        style={{ minWidth: 16, minHeight: 16, width: 16, height: 16 }}
      >
        <path d="M2 6h4V2H2v4Zm0 2v4h4V8H2Zm10-2V2H8v4h4Zm0 2H8v4h4V8ZM2 0h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  },
});
