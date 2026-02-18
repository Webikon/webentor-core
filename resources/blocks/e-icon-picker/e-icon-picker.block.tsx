import { Icon, IconPicker, Link } from '@10up/block-components';
import {
  ColorPalette,
  InspectorControls,
  useBlockProps,
} from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';
import {
  __experimentalNumberControl as NumberControl,
  PanelBody,
  PanelRow,
  ToggleControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { getColorBySlug, getColorSlugByColor } from '@webentorCore/_utils';
import { WebentorConfig } from '@webentorCore/types/_webentor-config';

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
  link: {
    title: string;
    url: string;
    opensInNewTab: boolean;
  };
  inheritSize?: boolean;
  width: string;
  height: string;
  color: string;
  icon: {
    name: string;
    iconSet: string;
  };
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;

  const blockProps = useBlockProps();

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  const twTheme: WebentorConfig['theme'] = applyFilters(
    'webentor.core.twTheme',
    {},
  );

  const themeColors = applyFilters(
    'webentor.core.e-icon-picker.colors',
    twTheme?.colors || {},
  );

  const paletteColors = Object.entries(themeColors).map(([key, value]) => ({
    name: key,
    color: value,
    slug: `text-${key}`, // Color slug is TW class name
  }));

  const handleLinkTextChange = (value) =>
    setAttributes({
      link: {
        ...attributes.link,
        title: value,
      },
    });

  const handleLinkChange = (value) =>
    setAttributes({
      link: {
        url: value?.url,
        opensInNewTab: value?.opensInNewTab,
        title: value?.title ?? attributes?.link?.title,
      },
    });

  const handleLinkRemove = () => {
    setAttributes({ link: null });
  };

  const handleIconSelection = (value) =>
    setAttributes({ icon: { name: value.name, iconSet: value.iconSet } });

  return (
    <>
      <InspectorControls>
        <PanelBody title="Block Settings" initialOpen={true}>
          <IconPicker value={attributes?.icon} onChange={handleIconSelection} />
          {/* <InlineIconPicker
            value={null}
            onChange={handleIconSelection}
            className="icon-picker-preview"
            style={{
              width: attributes?.inheritSize
                ? 'auto'
                : attributes?.width
                  ? `${attributes?.width}px`
                  : '24px',
              height: attributes?.inheritSize
                ? 'auto'
                : attributes?.height
                  ? `${attributes?.height}px`
                  : '24px',
            }}
          /> */}

          <div className="wbtr:mt-4">
            <p className="components-base-control__label wbtr:mb-2">
              {__('Icon Color', 'webentor')}
            </p>
            <ColorPalette
              colors={paletteColors}
              value={getColorBySlug(paletteColors, attributes?.color)}
              disableCustomColors
              onChange={(color) => {
                setAttributes({
                  color: getColorSlugByColor(paletteColors, color),
                });
              }}
            />
          </div>

          <PanelRow>
            {/* External link */}
            <div className="wbtr:w-full wbtr:border wbtr:border-editor-border wbtr:p-2">
              <p>{__('Link Icon to URL', 'webentor')}</p>

              <div className="wbtr:flex wbtr:gap-2">
                <Link
                  value={attributes?.link?.title}
                  url={attributes?.link?.url}
                  opensInNewTab={attributes?.link?.opensInNewTab}
                  onTextChange={handleLinkTextChange}
                  onLinkChange={handleLinkChange}
                  onLinkRemove={handleLinkRemove}
                  placeholder="Enter Link Text here..."
                />
              </div>
            </div>
          </PanelRow>

          <PanelRow>
            {/* Custom image size with with, heigh and crop */}
            <div className="wbtr:flex wbtr:gap-2">
              <NumberControl
                label={__('Width', 'webentor')}
                value={attributes?.width || ''}
                onChange={(width) => setAttributes({ width })}
                required
                disabled={attributes?.inheritSize}
              />

              <NumberControl
                label={__('Height', 'webentor')}
                value={attributes?.height || ''}
                onChange={(height) => setAttributes({ height })}
                required
                disabled={attributes?.inheritSize}
              />
            </div>
          </PanelRow>

          <PanelRow>
            <ToggleControl
              label={__('Inherit size from SVG', 'webentor')}
              checked={attributes?.inheritSize}
              onChange={(inheritSize) => setAttributes({ inheritSize })}
              help={__(
                "Use only when SVG have properly defined width and height and you don't want to set custom size.",
                'webentor',
              )}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps} className={blockProps.className}>
        {attributes?.icon?.name ? (
          <Icon
            name={attributes?.icon?.name}
            iconSet={attributes?.icon?.iconSet}
            className={`icon-picker-preview ${attributes?.color}`}
            style={{
              width: attributes?.inheritSize
                ? 'auto'
                : attributes?.width
                  ? `${attributes?.width}px`
                  : '24px',
              height: attributes?.inheritSize
                ? 'auto'
                : attributes?.height
                  ? `${attributes?.height}px`
                  : '24px',
            }}
          />
        ) : (
          <span className="wbtr:text-10">{__('Pick icon', 'webentor')}</span>
        )}
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
