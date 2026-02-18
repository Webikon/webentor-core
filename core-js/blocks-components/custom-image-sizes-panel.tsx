import { BlockEditProps } from '@wordpress/blocks';
import {
  __experimentalNumberControl as NumberControl,
  TabPanel,
  ToggleControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

type Props = {
  attributes: BlockEditProps['attributes'];
  imgSizeAttribute: string;
  onEnabledChange: (enabled: boolean, breakpoint: string) => void;
  onWidthChange?: (width: number, breakpoint: string) => void;
  onHeightChange?: (height: number, breakpoint: string) => void;
  onCropChange?: (crop: boolean, breakpoint: string) => void;
  alwaysEnabled?: boolean;
  hideHeight?: boolean;
  hideWidth?: boolean;
  hideCrop?: boolean;
  noticeBefore?: () => React.ReactNode;
  noticeAfter?: () => React.ReactNode;
};

/**
 * Display the custom image sizes tabs.
 *
 * Used in blocks like e-gallery and e-image.
 */
export const CustomImageSizesPanel: React.FC<Props> = (props: Props) => {
  const {
    attributes,
    imgSizeAttribute,
    onEnabledChange,
    onWidthChange,
    onHeightChange,
    onCropChange,
    alwaysEnabled,
    hideHeight,
    hideWidth,
    hideCrop,
    noticeBefore,
    noticeAfter,
  } = props;

  const breakpoints = applyFilters('webentor.core.twBreakpoints', ['basic']);

  const hasSizeSettingsForBreakpoint = (attributes, breakpoint) => {
    return (
      attributes?.[imgSizeAttribute]?.enabled?.[breakpoint] ||
      attributes?.[imgSizeAttribute]?.width?.[breakpoint] ||
      attributes?.[imgSizeAttribute]?.height?.[breakpoint]
    );
  };

  return (
    <div>
      <p className="wbtr:uppercase">{__('Custom Image sizes', 'webentor')}</p>

      {noticeBefore && noticeBefore()}

      <div>
        Help: These sizes are defined <strong>UP TO</strong> specific
        breakpoint, e.g. if you define sizes for `sm`, it means image would be
        displayed on screens up to `sm` (max-width:480px). Always define{' '}
        <strong>basic</strong> breakpoint first as it would be used as default
        image size.
      </div>

      {noticeAfter && noticeAfter()}

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
                    [imgSizeAttribute, 'width', tab.name],
                    '0',
                  ),
                );
                setAttributes(
                  setImmutably(
                    attributes,
                    [imgSizeAttribute, 'height', tab.name],
                    '0',
                  ),
                );
                setAttributes(
                  setImmutably(
                    attributes,
                    [imgSizeAttribute, 'crop', tab.name],
                    false,
                  ),
                );
              }}
            >
              Reset sizes
            </Button> */}

            {/* Enable custom size */}
            {!alwaysEnabled && (
              <ToggleControl
                label={__('Enable custom sizes', 'webentor')}
                checked={
                  attributes?.[imgSizeAttribute]?.enabled?.[tab.name] || false
                }
                className="wbtr:mb-2!"
                onChange={(enabled) =>
                  onEnabledChange && onEnabledChange(enabled, tab.name)
                }
              />
            )}

            {(attributes?.[imgSizeAttribute]?.enabled?.[tab.name] ||
              alwaysEnabled) && (
              <>
                <div className="wbtr:mb-2">
                  If only one of the sizes is set and <strong>Crop</strong> is
                  disabled, the image will resize, but also keep its aspect
                  ratio.
                </div>

                {/* Custom image size with with, heigh and crop */}
                <div className="wbtr:flex wbtr:gap-2">
                  {/* Width number control */}
                  {!hideWidth && (
                    <NumberControl
                      label={__('Width', 'webentor')}
                      value={
                        attributes?.[imgSizeAttribute]?.width?.[tab.name] || '0'
                      }
                      min={0}
                      onChange={(width: string) =>
                        onWidthChange && onWidthChange(Number(width), tab.name)
                      }
                      className="wbtr:mb-2!"
                    />
                  )}

                  {/* Height number control */}
                  {!hideHeight && (
                    <NumberControl
                      label={__('Height', 'webentor')}
                      value={
                        attributes?.[imgSizeAttribute]?.height?.[tab.name] ||
                        '0'
                      }
                      min={0}
                      onChange={(height: string) =>
                        onHeightChange &&
                        onHeightChange(Number(height), tab.name)
                      }
                      className="wbtr:mb-2!"
                    />
                  )}
                </div>

                {/* Toggle crop */}
                {!hideCrop && (
                  <ToggleControl
                    label={__('Crop', 'webentor')}
                    help={__(
                      'Only if both width and height are set, the image will be cropped to the specified size.',
                      'webentor',
                    )}
                    checked={
                      attributes?.[imgSizeAttribute]?.crop?.[tab.name] || false
                    }
                    onChange={(crop) =>
                      onCropChange && onCropChange(crop, tab.name)
                    }
                  />
                )}
              </>
            )}
          </div>
        )}
      </TabPanel>
    </div>
  );
};
