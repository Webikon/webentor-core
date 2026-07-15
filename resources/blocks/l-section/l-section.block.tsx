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
  PanelBody,
  PanelRow,
  RangeControl,
  ToggleControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '@webentorCore/_utils';
import {
  CustomImageSizesPanel,
  WebentorBlockAppender,
} from '@webentorCore/blocks-components';
import { collectClassTokensFromAttributes } from '@webentorCore/blocks-filters/responsive-settings/utils';
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
  video?: { id: number; url: string; mime: string };
  disableVideoOnMobile?: boolean;
  lazyloadVideo?: boolean;
  lazyloadImage?: boolean;
  imgSize?: {
    height: {
      [key: string]: string;
    };
  };
  overlay?: {
    enabled?: boolean;
    opacity?: number;
    color?: string;
  };
  bgSettings?: Record<string, unknown>;
};

const OVERLAY_DEFAULT_OPACITY = 20;
const OVERLAY_DEFAULT_COLOR = '#000000';

const BlockEdit: React.FC<BlockEditProps<AttributesType>> = (props) => {
  const { attributes, setAttributes, isSelected } = props;

  const blockProps = useBlockProps();
  const parentBlockProps = useBlockParent();

  /**
   * Split responsive classes between wrapper and inner container, mirroring
   * the PHP split in data.php:
   *   webentor/block_classes        → wrapper (spacing, sizing, border, colors, …)
   *   webentor/block_custom_classes → container (layout.display, flexbox, grid)
   *
   * The editor.BlockListBlock HOC puts ALL responsive classes on the block
   * wrapper (blockProps.className). We collect the container-bound tokens
   * directly from the attribute values and move them to the inner div.
   *
   * This MUST use the registry-free collectClassTokensFromAttributes (not the
   * registry-driven computeClassesByAttribute): l-section is compiled into the
   * webentor-core bundle, where the responsive-settings registry is NOT
   * populated (initResponsiveSettings runs in the consumer/theme bundle), so a
   * registry-driven generator would return nothing here. The helper maps a
   * `hidden` display to `opacity-30` (visual dim) rather than a real
   * `display:none`, so the block stays visible/selectable in the editor.
   * Frontend hiding is handled separately in PHP (data.php).
   *
   * The `hidden` dim indicator (opacity-30/opacity-100) is kept on the WRAPPER,
   * not moved to the inner container, so the whole section preview dims —
   * mirroring the PHP fix where `display:none` hides the whole <section>.
   */
  const containerClassTokens = collectClassTokensFromAttributes(attributes, [
    'layout',
    'flexbox',
    'grid',
  ]);
  // Keep hide-indicator tokens on the wrapper (remove from the container set).
  for (const token of [...containerClassTokens]) {
    if (/(^|:)opacity-(30|100)$/.test(token)) {
      containerClassTokens.delete(token);
    }
  }
  const wrapperClassName = (blockProps.className ?? '')
    .split(/\s+/)
    .filter((c: string) => c && !containerClassTokens.has(c))
    .join(' ');
  const containerResponsiveClasses = [...containerClassTokens].join(' ');

  /**
   * Extension hooks for the Background Image Settings panel. Consumers inject
   * extra controls (e.g. a variants dropdown) before and/or after the built-in
   * settings, mirroring `webentor.core.button.extensionComponent`. Controls
   * read/write the free-form `bgSettings` attribute via `setAttributes`.
   */
  const BgSettingsBefore = applyFilters(
    'webentor.core.l-section.bgSettingsBefore',
    <></>,
    props,
  ) as React.ReactNode;
  const BgSettingsAfter = applyFilters(
    'webentor.core.l-section.bgSettingsAfter',
    <></>,
    props,
  ) as React.ReactNode;

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

  const onSelectVideo = (media) => {
    setAttributes({
      video: { id: media.id, url: media.url, mime: media.mime },
    });
  };

  const removeVideo = () => {
    setAttributes({ video: null });
  };

  const handleEnabledChange = (enabled: boolean, breakpoint: string) => {
    // Set custom size enabled/disabled
    // For some reason, this doesn't work with setImmutably
    setAttributes({
      imgSize: {
        ...attributes?.imgSize,
        enabled: {
          ...attributes?.imgSize?.enabled,
          [breakpoint]: enabled,
        },
      },
    });
  };

  const handleHeightChange = (height: number, breakpoint: string) => {
    setAttributes(
      setImmutably(attributes, ['imgSize', 'height', breakpoint], height),
    );
  };

  const handleCropChange = (crop: boolean, breakpoint: string) => {
    setAttributes(
      setImmutably(attributes, ['imgSize', 'crop', breakpoint], crop),
    );
  };

  const handleOverlayChange = (
    key: 'enabled' | 'opacity' | 'color',
    value: boolean | number | string,
  ) => {
    setAttributes(setImmutably(attributes, ['overlay', key], value));
  };

  const overlayEnabled = !!attributes?.overlay?.enabled;
  const overlayOpacity =
    attributes?.overlay?.opacity ?? OVERLAY_DEFAULT_OPACITY;
  const overlayColor = attributes?.overlay?.color ?? OVERLAY_DEFAULT_COLOR;

  return (
    <>
      <InspectorControls>
        <PanelBody title="Background Image Settings" initialOpen={false}>
          {BgSettingsBefore}

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
            <div className="wbtr:flex wbtr:w-full wbtr:flex-col">
              <p className="wbtr:mb-2 wbtr:uppercase">
                {__('Background Video', 'webentor')}
              </p>
              <div className="wbtr:mb-2">
                {__(
                  'Plays muted, looped and autoplays. The image above is used as fallback (and while the video lazyloads).',
                  'webentor',
                )}
              </div>
              <MediaUploadCheck>
                <MediaUpload
                  onSelect={onSelectVideo}
                  allowedTypes={['video']}
                  value={attributes?.video?.id}
                  render={({ open }) => (
                    <Button
                      onClick={open}
                      variant="secondary"
                      className="wbtr:w-fit!"
                    >
                      {attributes?.video?.id
                        ? __('Replace Video', 'webentor')
                        : __('Select Video', 'webentor')}
                    </Button>
                  )}
                />
              </MediaUploadCheck>

              {attributes?.video?.id && (
                <Button
                  onClick={removeVideo}
                  className="wbtr:h-fit! wbtr:w-fit!"
                  variant="link"
                  isDestructive
                >
                  {__('Remove Video', 'webentor')}
                </Button>
              )}

              {attributes?.video?.id && (
                <div className="wbtr:mt-3">
                  <ToggleControl
                    __nextHasNoMarginBottom
                    label={__('Disable video on mobile', 'webentor')}
                    help={__(
                      'On screens up to 480px the video is neither shown nor loaded; the image is used instead.',
                      'webentor',
                    )}
                    checked={attributes?.disableVideoOnMobile ?? true}
                    onChange={(value) =>
                      setAttributes({ disableVideoOnMobile: value })
                    }
                  />
                  <ToggleControl
                    __nextHasNoMarginBottom
                    label={__('Lazyload video', 'webentor')}
                    help={__(
                      'Load the video only when the section scrolls into view.',
                      'webentor',
                    )}
                    checked={attributes?.lazyloadVideo ?? true}
                    onChange={(value) =>
                      setAttributes({ lazyloadVideo: value })
                    }
                  />
                </div>
              )}
            </div>
          </PanelRow>

          <PanelRow>
            <div className="wbtr:flex wbtr:w-full wbtr:flex-col">
              <p className="wbtr:mb-2 wbtr:uppercase">
                {__('Background Image', 'webentor')}
              </p>
              <ToggleControl
                __nextHasNoMarginBottom
                label={__('Lazyload background image', 'webentor')}
                help={__(
                  'Off by default — section backgrounds are usually above the fold (LCP).',
                  'webentor',
                )}
                checked={attributes?.lazyloadImage ?? false}
                onChange={(value) => setAttributes({ lazyloadImage: value })}
              />
            </div>
          </PanelRow>

          <PanelRow>
            <CustomImageSizesPanel
              attributes={attributes}
              imgSizeAttribute="imgSize"
              onEnabledChange={handleEnabledChange}
              onHeightChange={handleHeightChange}
              onCropChange={handleCropChange}
              alwaysEnabled
              hideWidth
              noticeBefore={() => (
                <>
                  <div>
                    Notice: This is not height used for the section/hero. Please
                    set section height <strong>Container Settings</strong>.{' '}
                    <br />
                    Image Height settings below are needed just so image can be
                    properly optimized, resized and cropped on frontend.
                  </div>
                  <br />
                </>
              )}
            />
          </PanelRow>

          <PanelRow>
            <div className="wbtr:flex wbtr:w-full wbtr:flex-col">
              <p className="wbtr:mb-2 wbtr:uppercase">
                {__('Overlay', 'webentor')}
              </p>
              <ToggleControl
                __nextHasNoMarginBottom
                label={__('Enable overlay', 'webentor')}
                checked={overlayEnabled}
                onChange={(value) => handleOverlayChange('enabled', value)}
              />

              {overlayEnabled && (
                <>
                  <RangeControl
                    __nextHasNoMarginBottom
                    label={__('Overlay opacity (%)', 'webentor')}
                    value={overlayOpacity}
                    min={0}
                    max={100}
                    onChange={(value) =>
                      handleOverlayChange(
                        'opacity',
                        value ?? OVERLAY_DEFAULT_OPACITY,
                      )
                    }
                  />

                  <div className="wbtr:mt-2 wbtr:flex wbtr:items-center wbtr:gap-2">
                    <label htmlFor="w-section-overlay-color">
                      {__('Overlay color', 'webentor')}
                    </label>
                    <input
                      id="w-section-overlay-color"
                      type="color"
                      value={overlayColor}
                      onChange={(event) =>
                        handleOverlayChange('color', event.target.value)
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </PanelRow>

          {BgSettingsAfter}
        </PanelBody>
      </InspectorControls>

      {
        applyFilters(
          'webentor.core.l-section.output',
          <div
            {...blockProps}
            className={`w-section ${overlayEnabled ? 'w-section--has-overlay' : ''} ${wrapperClassName}`}
          >
            <div
              {...innerBlocksProps}
              className={`${innerBlocksProps.className} w-section-inner container wbtr:relative wbtr:flex wbtr:flex-col ${containerResponsiveClasses}`}
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
                {overlayEnabled && (
                  <div
                    className="w-section-overlay wbtr:absolute wbtr:inset-0"
                    style={{
                      backgroundColor: overlayColor,
                      opacity: overlayOpacity / 100,
                    }}
                  ></div>
                )}
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

            {attributes?.video?.url && (
              <video
                src={attributes.video.url}
                autoPlay
                muted
                loop
                playsInline
                className="wbtr:absolute wbtr:top-0 wbtr:left-0 wbtr:!h-full wbtr:!w-full wbtr:object-cover"
              />
            )}
          </div>,
          props,
          blockProps,
          innerBlocksProps,
          children,
        ) as React.ReactNode
      }
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
