import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';
import { PanelBody, PanelRow, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

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
  menuId: string;
  direction: string;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes, clientId } = props;

  const blockProps = useBlockProps();

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  const menus = useSelect(
    (select) => {
      const { getMenus } = select('core');
      const menus = getMenus();

      return menus;
    },
    [clientId],
  );

  // TODO: check if works with Polylang
  const menuOptions = menus?.map((menu) => ({
    label: menu.name,
    value: menu.id,
  }));
  // Prepend default option
  menuOptions?.unshift({ label: '-', value: '' });

  if (!menus) {
    return 'Loading menus...';
  }

  return (
    <>
      <InspectorControls>
        <PanelBody title="Block Settings" initialOpen={true}>
          <PanelRow>
            <SelectControl
              label={__('Nav Menu', 'webentor')}
              value={attributes.menuId}
              options={menuOptions}
              onChange={(menuId) => setAttributes({ menuId })}
            />
          </PanelRow>

          <PanelRow>
            <SelectControl
              label={__('Direction', 'webentor')}
              value={attributes.direction}
              options={[
                { label: 'Row', value: 'direction-row' },
                { label: 'Column', value: 'direction-col' },
              ]}
              onChange={(direction) => setAttributes({ direction })}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps} className={`${blockProps.className}`}>
        <div className="wbtr:bg-editor-border wbtr:p-2">
          {`Menu: `}
          {/* Find item in menuOptions which matches menuId */}
          {
            menuOptions?.find((item) => +item.value == +attributes.menuId)
              ?.label
          }
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
