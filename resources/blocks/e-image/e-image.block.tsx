import { Image, Link, MediaToolbar } from '@10up/block-components';
import {
  BlockControls,
  store as blockEditorStore,
  InspectorControls,
  useBlockProps,
} from '@wordpress/block-editor';
import { BlockEditProps, registerBlockType } from '@wordpress/blocks';
import {
  __experimentalNumberControl as NumberControl,
  PanelBody,
  PanelRow,
  SelectControl,
  TabPanel,
  ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';

import block from './block.json';

const hasSizeSettingsForBreakpoint = (attributes, breakpoint) => {
  return attributes?.customSize?.enabled?.[breakpoint];
};

/**
 * Edit component.
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#edit
 *
 * @param {object}   props                      					The block props.
 * @returns {Function}                                    Render the edit screen
 */

type AttributesType = {
  coverImage: string;
  lazyload: boolean;
  openInLightbox: boolean;
  fullWidth: boolean;
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
  imgId: number;
  focalPoint: {
    x: number;
    y: number;
  };
  link: {
    url: string;
    title: string;
    opensInNewTab: boolean;
  };
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes } = props;

  const blockProps = useBlockProps();

  const imageWidth = 600;
  const imageHeight = 600;

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  const breakpoints = applyFilters('webentor.core.twBreakpoints', ['basic']);

  const handleLinkTextChange = (value: string) =>
    setAttributes({
      link: {
        ...attributes.link,
        title: value,
      },
    });

  const handleLinkChange = (value: unknown) =>
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

  const handleImageSelect = (image: unknown) => {
    setAttributes({ imgId: image?.id });
  };
  const handleImageRemove = () => {
    setAttributes({ imgId: null });
  };

  // const handleFocalPointChange = (value) => {
  //   setAttributes({ focalPoint: value });
  // };

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

  return (
    <>
      <InspectorControls>
        <PanelBody title="Block Settings" initialOpen={true}>
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

          {/* TODO maybe move to BlockControls toolbar */}
          {!attributes.openInLightbox && (
            <PanelRow>
              <div className="wbtr:w-full wbtr:border wbtr:border-editor-border wbtr:p-2">
                <p>{__('Link Image to URL', 'webentor')}</p>

                <div className="wbtr:flex wbtr:gap-2">
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
                </div>
              </div>
            </PanelRow>
          )}

          {/* Full width */}
          <PanelRow>
            <ToggleControl
              label={__('Make image full width', 'webentor')}
              checked={attributes.fullWidth}
              onChange={(fullWidth) => setAttributes({ fullWidth })}
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
            <div>
              <p className="wbtr:uppercase">
                {__('Custom Image sizes', 'webentor')}
              </p>

              <div>
                Help: These sizes are defined <strong>UP TO</strong> specific
                breakpoint, e.g. if you define sizes for `sm`, it means image
                would be displayed on screens up to `sm` (max-width:480px).{' '}
                Always define <strong>basic</strong> breakpoint first as it
                would be used as default image size.
              </div>

              <TabPanel
                activeClass="is-active"
                className="w-responsive-settings-tabs"
                initialTabName={breakpoints[0]}
                tabs={
                  breakpoints.map((breakpoint) => ({
                    name: breakpoint,
                    title: `${breakpoint}${hasSizeSettingsForBreakpoint(attributes, breakpoint) ? '*' : ''}`, // Add * if spacing is set on this breakpoint
                  })) || []
                }
              >
                {(tab) => (
                  <div
                    className="wbtr:mt-4 wbtr:flex wbtr:flex-wrap wbtr:justify-center wbtr:gap-x-4"
                    key={tab.name}
                  >
                    {/* <Button
                        onClick={() => {
                          setAttributes(
                            setImmutably(
                              attributes,
                              ['customSize', 'width', tab.name],
                              '0',
                            ),
                          );
                          setAttributes(
                            setImmutably(
                              attributes,
                              ['customSize', 'height', tab.name],
                              '0',
                            ),
                          );
                          setAttributes(
                            setImmutably(
                              attributes,
                              ['customSize', 'crop', tab.name],
                              false,
                            ),
                          );
                        }}
                      >
                        Reset sizes
                      </Button> */}

                    {/* Enable custom size */}
                    <ToggleControl
                      label={__('Enable custom sizes', 'webentor')}
                      checked={
                        attributes.customSize?.enabled?.[tab.name] || false
                      }
                      className="wbtr:mb-2!"
                      onChange={(enabled) => {
                        // Set custom size enabled/disabled
                        // For some reason, this doesn't work with setImmutably
                        setAttributes({
                          customSize: {
                            ...attributes.customSize,
                            enabled: {
                              ...attributes.customSize?.enabled,
                              [tab.name]: enabled,
                            },
                          },
                        });
                      }}
                    />

                    {attributes.customSize?.enabled?.[tab.name] && (
                      <>
                        <div className="wbtr:mb-2">
                          If only one of the sizes is set and{' '}
                          <strong>Crop</strong> is disabled, the image will
                          resize, but also keep its aspect ratio.
                        </div>

                        {/* Custom image size with with, heigh and crop */}
                        <div className="wbtr:flex wbtr:gap-2">
                          {/* Width number control */}
                          <NumberControl
                            label={__('Width', 'webentor')}
                            value={
                              attributes.customSize?.width?.[tab.name] || '0'
                            }
                            min={0}
                            onChange={(width) =>
                              setAttributes(
                                setImmutably(
                                  attributes,
                                  ['customSize', 'width', tab.name],
                                  width,
                                ),
                              )
                            }
                            className="wbtr:mb-2!"
                          />

                          {/* Height number control */}
                          <NumberControl
                            label={__('Height', 'webentor')}
                            value={
                              attributes.customSize?.height?.[tab.name] || '0'
                            }
                            min={0}
                            onChange={(height) =>
                              setAttributes(
                                setImmutably(
                                  attributes,
                                  ['customSize', 'height', tab.name],
                                  height,
                                ),
                              )
                            }
                            className="wbtr:mb-2!"
                          />
                        </div>

                        {/* Toggle crop */}
                        <ToggleControl
                          label={__('Crop', 'webentor')}
                          help={__(
                            'Only if both width and height are set, the image will be cropped to the specified size.',
                            'webentor',
                          )}
                          checked={
                            attributes.customSize.crop?.[tab.name] || false
                          }
                          onChange={(crop) =>
                            setAttributes(
                              setImmutably(
                                attributes,
                                ['customSize', 'crop', tab.name],
                                crop,
                              ),
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                )}
              </TabPanel>
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
          className="wbtr:rounded-[inherit]"
          // focalPoint={attributes.focalPoint}
          // onChangeFocalPoint={handleFocalPointChange}
          labels={{
            title: 'Select Image',
            instructions: 'Upload or pick one from your media library.',
          }}
          width={attributes.customSize?.width || imageWidth}
          height={attributes.customSize?.height || imageHeight}
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
