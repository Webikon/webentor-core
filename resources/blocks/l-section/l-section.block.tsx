import {
  InnerBlocks,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
  useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
  BlockEditProps,
  registerBlockType,
  TemplateArray,
} from '@wordpress/blocks';
import {
  Button,
  __experimentalNumberControl as NumberControl,
  PanelBody,
  PanelRow,
  TabPanel,
  ToggleControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';
import { WebentorBlockAppender } from '@webentorCore/blocks-components';
import { useBlockParent } from '@webentorCore/blocks-utils/_use-block-parent';

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
  template?: TemplateArray;
  img?: { id: number; url: string; alt: string };
  mobileImg?: { id: number; url: string; alt: string };
  imgSize?: {
    height: {
      [key: string]: string;
    };
  };
};

const hasSizeSettingsForBreakpoint = (
  attributes: AttributesType,
  breakpoint: string,
) => {
  return attributes?.imgSize?.height?.[breakpoint] || false;
};

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes, isSelected } = props;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Filter allowed blocks used in webentor/l-section inner block
   */
  const allowedBlocks: string[] = applyFilters(
    'webentor.core.l-section.allowedBlocks',
    null,
    blockProps,
    parentBlockProps,
  );

  /**
   * Filter template used in webentor/l-section inner block
   */
  const defaultTemplate: TemplateArray = attributes?.template ?? [];
  const template: TemplateArray = applyFilters(
    'webentor.core.l-section.template',
    defaultTemplate,
    blockProps,
    parentBlockProps,
  );

  const { children, ...innerBlocksProps } = useInnerBlocksProps(
    {},
    {
      allowedBlocks,
      template,
      renderAppender: false, // Disable default appender
    },
  );

  // Preview image for block inserter
  if (attributes.coverImage) {
    return <img src={attributes.coverImage} width="468" />;
  }

  const hasInnerBlocks = children && React.Children.count(children) > 0;

  const breakpoints = applyFilters('webentor.core.twBreakpoints', ['basic']);

  const onSelectImage = (media) => {
    setAttributes({
      img: { id: media.id, url: media.url, alt: media.alt },
    });
  };

  const removeImage = () => {
    setAttributes({ img: null });
  };

  const onSelectMobileImage = (media) => {
    setAttributes({
      mobileImg: { id: media.id, url: media.url, alt: media.alt },
    });
  };

  const removeMobileImage = () => {
    setAttributes({ mobileImg: null });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title="Background Image Settings" initialOpen={true}>
          <PanelRow>
            <div className="wbtr:flex wbtr:flex-col">
              <p className="wbtr:mb-2 wbtr:uppercase">
                {__('Desktop Image', 'webentor')}
              </p>
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={onSelectImage}
                  allowedTypes={['image']}
                  value={attributes?.img?.id}
                  render={({ open }) => (
                    <Button
                      onClick={open}
                      className={
                        attributes?.img?.id
                          ? 'wbtr:h-fit! wbtr:w-fit! wbtr:p-0!'
                          : ''
                      }
                      variant={attributes?.img?.id ? undefined : 'secondary'}
                    >
                      {attributes?.img?.id ? (
                        <img
                          src={attributes.img.url}
                          alt={attributes.img?.alt}
                          width="100%"
                        />
                      ) : (
                        __('Select Desktop Image', 'webentor')
                      )}
                    </Button>
                  )}
                />
              </MediaUploadCheck>

              {attributes?.img?.id && (
                <Button
                  onClick={removeImage}
                  className="wbtr:h-fit! wbtr:w-fit!"
                  variant="link"
                  isDestructive
                >
                  {__('Remove Desktop Image', 'webentor')}
                </Button>
              )}
            </div>
          </PanelRow>

          <PanelRow>
            <div className="wbtr:flex wbtr:flex-col">
              <p className="wbtr:mb-2 wbtr:uppercase">
                {__('Mobile Image', 'webentor')}
              </p>
              <div className="wbtr:mb-2">
                Used for devices up to 480px screen width.
              </div>
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={onSelectMobileImage}
                  allowedTypes={['image']}
                  value={attributes?.mobileImg?.id}
                  render={({ open }) => (
                    <Button
                      onClick={open}
                      className={
                        attributes?.mobileImg?.id
                          ? 'wbtr:h-fit! wbtr:w-fit! wbtr:p-0!'
                          : ''
                      }
                      variant={
                        attributes?.mobileImg?.id ? undefined : 'secondary'
                      }
                    >
                      {attributes?.mobileImg?.id ? (
                        <img
                          src={attributes.mobileImg.url}
                          alt={attributes.mobileImg?.alt}
                          width="100%"
                        />
                      ) : (
                        __('Select Mobile Image', 'webentor')
                      )}
                    </Button>
                  )}
                />
              </MediaUploadCheck>

              {attributes?.mobileImg?.id && (
                <Button
                  onClick={removeMobileImage}
                  className="wbtr:h-fit! wbtr:w-fit!"
                  variant="link"
                  isDestructive
                >
                  {__('Remove Mobile Image', 'webentor')}
                </Button>
              )}
            </div>
          </PanelRow>

          <PanelRow>
            <div>
              <p className="wbtr:mt-4 wbtr:uppercase">
                {__('Custom Image sizes', 'webentor')}
              </p>

              <div>
                Notice: This is not height used for the section/hero. Please set
                section height <strong>Container Settings</strong>. <br />
                Image Height settings below are needed just so image can be
                properly optimized, resized and cropped on frontend.
              </div>

              <div className="wbtr:my-2">
                Help: These sizes are defined <strong>UP TO</strong> specific
                breakpoint, e.g. if you define sizes for `sm`, it means it would
                be applied on screens up to `sm` (max-width:480px). Always
                define <strong>basic</strong> breakpoint first as it would be
                used as default image height.
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
                    <NumberControl
                      label={__('Image Height', 'webentor')}
                      value={attributes.imgSize?.height?.[tab.name] || '0'}
                      help={__(
                        'This will help the image to be properly resized and cropped on frontend. Leave 0 to use default height.',
                        'webentor',
                      )}
                      min={0}
                      onChange={(height) =>
                        setAttributes(
                          setImmutably(
                            attributes,
                            ['imgSize', 'height', tab.name],
                            height,
                          ),
                        )
                      }
                      className="wbtr:mb-2!"
                    />

                    <ToggleControl
                      label={__('Crop Image', 'webentor')}
                      help={__(
                        'If enabled, the image will be cropped to the specified height. If disabled, the image will be still resized, but keeps its aspect ratio which can cause image to be stretched.',
                        'webentor',
                      )}
                      checked={attributes.imgSize?.crop?.[tab.name] || true}
                      onChange={(crop) =>
                        setAttributes(
                          setImmutably(
                            attributes,
                            ['imgSize', 'crop', tab.name],
                            crop,
                          ),
                        )
                      }
                    />
                  </div>
                )}
              </TabPanel>
            </div>
          </PanelRow>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps} className={`w-section ${blockProps.className}`}>
        <div
          {...innerBlocksProps}
          className={`${innerBlocksProps.className} container wbtr:relative wbtr:z-[2] wbtr:flex wbtr:flex-col`}
        >
          {children}

          {/* Only show appender if no inner blocks or if the block is selected */}
          {(!hasInnerBlocks || isSelected) && (
            <div className="wbtr:my-2 wbtr:flex wbtr:items-center wbtr:justify-center">
              <WebentorBlockAppender
                rootClientId={props.clientId}
                text={__('Add Section Content', 'webentor')}
              />
            </div>
          )}
        </div>

        {attributes?.img?.id && (
          <>
            <div className="wbtr:absolute wbtr:inset-0 wbtr:z-[1] wbtr:bg-black wbtr:opacity-20"></div>
            <img
              src={attributes.img.url}
              alt="banner-img"
              className="wbtr:absolute wbtr:top-0 wbtr:left-0 wbtr:hidden wbtr:!h-full wbtr:!w-full wbtr:object-cover wbtr:md:block"
            />
            <img
              src={attributes.mobileImg?.url || attributes.img.url}
              alt="banner-img"
              className="wbtr:absolute wbtr:top-0 wbtr:left-0 wbtr:block wbtr:!h-full wbtr:!w-full wbtr:object-cover wbtr:md:hidden"
            />
          </>
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
const BlockSave = () => <InnerBlocks.Content />;

/**
 * Register block.
 */
registerBlockType(block, {
  edit: BlockEdit,
  save: BlockSave,
});
