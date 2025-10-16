import {
  BlockControls,
  store as blockEditorStore,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
} from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';
import {
  Button,
  PanelBody,
  PanelRow,
  SelectControl,
  ToggleControl,
  ToolbarGroup,
  ToolbarItem,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';
import { CustomImageSizesPanel } from '@webentorCore/blocks-components';
import { BorderPanel } from '@webentorCore/blocks-filters/responsive-settings/settings/border/panel';
import { prepareTailwindBorderClassesFromSettings } from '@webentorCore/blocks-filters/responsive-settings/utils';
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
  images: {
    id: number;
    url: string;
    alt: string;
  }[];
  lazyload: boolean;
  openInLightbox: boolean;
  aspectRatio: string;
  objectFit: string;
  objectPosition: string;
  imageSize: string;
  customSize: {
    enabled: {
      [key: string]: boolean;
    };
    width: {
      [key: string]: string;
    };
    height: {
      [key: string]: string;
    };
    crop: {
      [key: string]: boolean;
    };
  };
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;
  const { images } = attributes;

  const blockProps = useBlockProps();

  const imageHeight = 150;
  const imageWidth = 150;

  const { clientId } = props;
  const { getSettings } = useSelect(blockEditorStore, []);
  const { imageSizes } = useSelect(() => {
    const settings = getSettings();

    return {
      imageSizes: settings.imageSizes,
    };
  }, [clientId]);

  const imageSizeOptions = imageSizes.map(({ name, slug }) => ({
    value: slug,
    label: name,
  }));

  const breakpoints: string[] = applyFilters('webentor.core.twBreakpoints', [
    'basic',
  ]);
  const twTheme: WebentorConfig['theme'] = applyFilters(
    'webentor.core.twTheme',
    {},
  );

  const handleGallerySelect = (images: unknown) => {
    setAttributes({ images });
  };

  const handleGalleryRemove = () => {
    setAttributes({ images: null });
  };

  const handleEnabledChange = (enabled: boolean, breakpoint: string) => {
    // Set custom size enabled/disabled
    // For some reason, this doesn't work with setImmutably
    setAttributes({
      customSize: {
        ...attributes.customSize,
        enabled: {
          ...attributes.customSize?.enabled,
          [breakpoint]: enabled,
        },
      },
    });
  };

  const handleWidthChange = (width: number, breakpoint: string) => {
    setAttributes(
      setImmutably(attributes, ['customSize', 'width', breakpoint], width),
    );
  };

  const handleHeightChange = (height: number, breakpoint: string) => {
    setAttributes(
      setImmutably(attributes, ['customSize', 'height', breakpoint], height),
    );
  };

  const handleCropChange = (crop: boolean, breakpoint: string) => {
    setAttributes(
      setImmutably(attributes, ['customSize', 'crop', breakpoint], crop),
    );
  };

  const GalleryMediaUpload = (
    variant?: 'link' | 'primary' | 'secondary' | 'tertiary',
  ) => (
    <MediaUploadCheck>
      <MediaUpload
        onSelect={handleGallerySelect}
        allowedTypes={['image']}
        value={images?.map(({ id }) => id)}
        gallery
        multiple
        render={({ open }) => (
          <Button onClick={open} variant={variant}>
            {images?.length > 0
              ? __('Edit Gallery Images', 'webentor')
              : __('Select Gallery Images', 'webentor')}
          </Button>
        )}
      />
    </MediaUploadCheck>
  );

  const borderClasses = prepareTailwindBorderClassesFromSettings(
    attributes,
    'border',
    ['top', 'right', 'bottom', 'left'],
  );

  return (
    <>
      <InspectorControls>
        <PanelBody title="Gallery Settings" initialOpen={true}>
          <PanelRow>{GalleryMediaUpload('secondary')}</PanelRow>

          <PanelRow>
            <ToggleControl
              label={__('Lazyload', 'webentor')}
              checked={attributes.lazyload}
              onChange={(lazyload) => setAttributes({ lazyload })}
            />
          </PanelRow>

          <PanelRow>
            {/* Open in lightbox */}
            <ToggleControl
              label={__('Open in lightbox', 'webentor')}
              checked={attributes.openInLightbox}
              onChange={(openInLightbox) => setAttributes({ openInLightbox })}
            />
          </PanelRow>

          {/* Aspect ratio select */}
          <PanelRow>
            <SelectControl
              label={__('Aspect Ratio', 'webentor')}
              value={attributes.aspectRatio}
              options={[
                { label: 'Auto', value: 'auto' },
                { label: 'Square', value: 'square' },
                { label: 'Video (16:9)', value: 'video' },
              ]}
              onChange={(aspectRatio) => setAttributes({ aspectRatio })}
            />
          </PanelRow>

          {/* Object fit select */}
          <PanelRow>
            <SelectControl
              label={__('Object Fit', 'webentor')}
              value={attributes.objectFit}
              options={[
                { label: 'None', value: 'none' },
                { label: 'Fill', value: 'fill' },
                { label: 'Contain', value: 'contain' },
                { label: 'Cover', value: 'cover' },
                { label: 'Scale down', value: 'scale-down' },
              ]}
              onChange={(objectFit) => setAttributes({ objectFit })}
            />
          </PanelRow>

          {/* Object position select */}
          {attributes.objectFit && attributes.objectFit !== 'none' && (
            <PanelRow>
              <SelectControl
                label={__('Object Position', 'webentor')}
                value={attributes.objectPosition}
                options={[
                  { label: 'Top', value: 'top' },
                  { label: 'Right Top', value: 'right-top' },
                  { label: 'Right', value: 'right' },
                  { label: 'Right Bottom', value: 'right-bottom' },
                  { label: 'Bottom', value: 'bottom' },
                  { label: 'Left Top', value: 'left-top' },
                  { label: 'Left', value: 'left' },
                  { label: 'Left Bottom', value: 'left-bottom' },
                  { label: 'Center', value: 'center' },
                ]}
                onChange={(objectPosition) => setAttributes({ objectPosition })}
              />
            </PanelRow>
          )}

          {/* Image size select with fetch for image sizes get_intermediate_image_sizes() */}
          <PanelRow>
            <SelectControl
              label={__('Image Size', 'webentor')}
              value={attributes.imageSize}
              options={imageSizeOptions}
              onChange={(imageSize) => setAttributes({ imageSize })}
              help={__(
                'These sizes are automatically generated by WordPress. If you want to use custom image sizes, you can do so by enabling them below.',
                'webentor',
              )}
            />
          </PanelRow>

          <PanelRow>
            <CustomImageSizesPanel
              attributes={attributes}
              imgSizeAttribute="customSize"
              onEnabledChange={handleEnabledChange}
              onWidthChange={handleWidthChange}
              onHeightChange={handleHeightChange}
              onCropChange={handleCropChange}
            />
          </PanelRow>
        </PanelBody>

        <BorderPanel {...props} breakpoints={breakpoints} twTheme={twTheme} />
      </InspectorControls>

      <BlockControls>
        <ToolbarGroup>
          <ToolbarItem as="div">{GalleryMediaUpload()}</ToolbarItem>
          <ToolbarItem as={Button} onClick={handleGalleryRemove}>
            {__('Remove Gallery', 'webentor')}
          </ToolbarItem>
        </ToolbarGroup>
      </BlockControls>

      <div {...blockProps} className={`${blockProps.className} w-gallery`}>
        {images?.length > 0 ? (
          images.map((image) => (
            <img
              src={image.url}
              key={image.id}
              width={attributes.customSize?.width?.basic || imageWidth}
              height={attributes.customSize?.height?.basic || imageHeight}
              className={`w-gallery__item object-${attributes.objectFit} object-${attributes.objectPosition} aspect-${attributes.aspectRatio} ${borderClasses.join(' ')}`}
            />
          ))
        ) : (
          <div className="wbtr:py-4 wbtr:text-gray-500">
            <div className="wbtr:mb-4">
              Gallery is empty, please select some images.
            </div>
            <div>{GalleryMediaUpload('secondary')}</div>
          </div>
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
