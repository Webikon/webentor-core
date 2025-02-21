import { Image, Link, MediaToolbar } from '@10up/block-components';
import {
  BlockControls,
  InspectorControls,
  useBlockProps,
} from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';
import {
  __experimentalNumberControl as NumberControl,
  PanelBody,
  PanelRow,
} from '@wordpress/components';
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
  link: {
    title: string;
    url: string;
    opensInNewTab: boolean;
  };
  imgId: number;
  width: string;
  height: string;
  imageSize: string;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;

  const blockProps = useBlockProps();

  const imageWidth = 40;
  const imageHeight = 40;

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

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

  const handleImageSelect = (image) => {
    setAttributes({ imgId: image.id });
  };
  const handleImageRemove = () => {
    setAttributes({ imgId: null });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title="Block Settings" initialOpen={true}>
          <PanelRow>
            {/* External link */}
            <Link
              value={attributes?.link?.title}
              url={attributes?.link?.url}
              opensInNewTab={attributes?.link?.opensInNewTab}
              onTextChange={handleLinkTextChange}
              onLinkChange={handleLinkChange}
              onLinkRemove={handleLinkRemove}
              placeholder="Enter Link Text here..."
            />
          </PanelRow>
          <PanelRow>
            {/* Custom image size with with, heigh and crop */}
            <div className="wbtr:flex wbtr:gap-2">
              <NumberControl
                label={__('Width', 'webentor')}
                value={attributes?.width || ''}
                onChange={(width) => setAttributes({ width })}
                required
              />

              <NumberControl
                label={__('Height', 'webentor')}
                value={attributes?.height || ''}
                onChange={(height) => setAttributes({ height })}
                required
              />
            </div>
          </PanelRow>
        </PanelBody>
      </InspectorControls>

      <BlockControls>
        <MediaToolbar
          isOptional
          id={attributes.imgId}
          onSelect={handleImageSelect}
          onRemove={handleImageRemove}
        />
      </BlockControls>

      <div {...blockProps} className={blockProps.className}>
        <Image
          id={attributes.imgId}
          size={attributes.imageSize}
          onSelect={handleImageSelect}
          allowedTypes={['image/svg+xml']}
          labels={{
            title: 'Select Image',
            instructions: 'Upload or pick one from your media library.',
          }}
          width={attributes?.width || imageWidth}
          height={attributes?.height || imageHeight}
        />
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
