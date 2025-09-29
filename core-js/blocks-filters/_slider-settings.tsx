import { InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  TabPanel,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '../_utils';

const initSliderSettings = () => {
  const withInspectorControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      // We are checking for these attributes to be present in the block
      // Attributes should be defined as defaults in app/blocks.php
      if (props.name !== 'webentor/e-slider') {
        return <BlockEdit {...props} />;
      }

      const breakpoints = applyFilters('webentor.core.twBreakpoints', [
        'basic',
      ]);

      const { attributes, setAttributes } = props;

      return (
        <Fragment>
          <InspectorControls>
            <PanelBody title={__('Slider Settings', 'webentor')} initialOpen>
              {/* Not responsive settings */}
              <ToggleControl
                label={__('Loop Slides', 'webentor')}
                checked={attributes?.slider?.loop ?? true}
                onChange={(checked) =>
                  setAttributes(
                    setImmutably(attributes, ['slider', 'loop'], checked),
                  )
                }
              />

              <ToggleControl
                label={__('Autoplay', 'webentor')}
                checked={attributes?.slider?.autoplay ?? false}
                onChange={(checked) =>
                  setAttributes(
                    setImmutably(attributes, ['slider', 'autoplay'], checked),
                  )
                }
              />

              {attributes?.slider?.autoplay && (
                <TextControl
                  label={__('Autoplay Speed', 'webentor')}
                  value={attributes?.slider?.autoplaySpeed ?? '3000'}
                  onChange={(value) =>
                    setAttributes(
                      setImmutably(
                        attributes,
                        ['slider', 'autoplaySpeed'],
                        value,
                      ),
                    )
                  }
                  type="number"
                />
              )}

              {attributes?.slider?.autoplay && (
                <ToggleControl
                  label={__('Autoplay Control', 'webentor')}
                  checked={attributes?.slider?.autoplayControl ?? false}
                  help={__(
                    'Autoplay Control will show timer and play/pause button.',
                    'webentor',
                  )}
                  onChange={(checked) =>
                    setAttributes(
                      setImmutably(
                        attributes,
                        ['slider', 'autoplayControl'],
                        checked,
                      ),
                    )
                  }
                />
              )}

              <ToggleControl
                label={__('Show Arrows', 'webentor')}
                checked={attributes?.slider?.showArrows ?? false}
                onChange={(checked) =>
                  setAttributes(
                    setImmutably(attributes, ['slider', 'showArrows'], checked),
                  )
                }
              />

              {attributes?.slider?.showArrows && (
                <ToggleControl
                  label={__('Arrows Inside Container', 'webentor')}
                  checked={attributes?.slider?.arrowsInsideContainer ?? false}
                  onChange={(checked) =>
                    setAttributes(
                      setImmutably(
                        attributes,
                        ['slider', 'arrowsInsideContainer'],
                        checked,
                      ),
                    )
                  }
                />
              )}

              <ToggleControl
                label={__('Show Pagination', 'webentor')}
                checked={attributes?.slider?.showPagination ?? false}
                onChange={(checked) =>
                  setAttributes(
                    setImmutably(
                      attributes,
                      ['slider', 'showPagination'],
                      checked,
                    ),
                  )
                }
              />

              {attributes?.slider?.showPagination && (
                <ToggleControl
                  label={__('Pagination Inside Container', 'webentor')}
                  checked={
                    attributes?.slider?.paginationInsideContainer ?? false
                  }
                  onChange={(checked) =>
                    setAttributes(
                      setImmutably(
                        attributes,
                        ['slider', 'paginationInsideContainer'],
                        checked,
                      ),
                    )
                  }
                />
              )}

              <ToggleControl
                label={__('Dark Mode', 'webentor')}
                help={__(
                  'Use Dark Mode when slider background is dark and you need inner elements and text to be in inverted color, e.g. light.',
                  'webentor',
                )}
                checked={attributes?.slider?.darkMode ?? false}
                onChange={(checked) =>
                  setAttributes(
                    setImmutably(attributes, ['slider', 'darkMode'], checked),
                  )
                }
              />

              <TextControl
                label={__('Slider ID', 'webentor')}
                value={attributes?.slider?.id ?? ''}
                onChange={(value) =>
                  setAttributes(
                    setImmutably(attributes, ['slider', 'id'], value),
                  )
                }
                help={__(
                  'This ID can be used to filter slider params via `webentor/slider/view/swiper_params` hook.',
                )}
              />

              <hr />

              {/* Responsive settings */}
              <TabPanel
                activeClass="is-active"
                className="w-responsive-settings-tabs"
                initialTabName={breakpoints[0]}
                tabs={
                  breakpoints.map((breakpoint) => ({
                    name: breakpoint,
                    title: breakpoint,
                  })) || []
                }
              >
                {(tab) => (
                  <div
                    // className="mt-4"
                    style={{ marginTop: '16px' }}
                  >
                    <ToggleControl
                      label={__('Enable Slider', 'webentor')}
                      checked={
                        attributes?.slider?.enabled?.value?.[tab.name] ?? true
                      }
                      onChange={(checked) =>
                        setAttributes(
                          setImmutably(
                            attributes,
                            ['slider', 'enabled', 'value', tab.name],
                            checked,
                          ),
                        )
                      }
                    />

                    <ToggleControl
                      label={__('Centered slides', 'webentor')}
                      checked={
                        attributes?.slider?.centeredSlides?.value?.[tab.name] ??
                        false
                      }
                      onChange={(checked) =>
                        setAttributes(
                          setImmutably(
                            attributes,
                            ['slider', 'centeredSlides', 'value', tab.name],
                            checked,
                          ),
                        )
                      }
                    />

                    <TextControl
                      label={__('Slides per view', 'webentor')}
                      value={
                        attributes?.slider?.slidesPerView?.value?.[tab.name] ??
                        ''
                      }
                      onChange={(value) =>
                        setAttributes(
                          setImmutably(
                            attributes,
                            ['slider', 'slidesPerView', 'value', tab.name],
                            value,
                          ),
                        )
                      }
                      type="number"
                    />

                    <TextControl
                      label={__('Space Between Slides', 'webentor')}
                      value={
                        attributes?.slider?.spaceBetween?.value?.[tab.name] ??
                        ''
                      }
                      onChange={(value) =>
                        setAttributes(
                          setImmutably(
                            attributes,
                            ['slider', 'spaceBetween', 'value', tab.name],
                            value,
                          ),
                        )
                      }
                      type="number"
                    />
                  </div>
                )}
              </TabPanel>
            </PanelBody>
          </InspectorControls>

          <BlockEdit {...props}></BlockEdit>
        </Fragment>
      );
    };
  }, 'withInspectorControls');
  addFilter(
    'editor.BlockEdit',
    'webentor/blockEdit/sliderSettings',
    withInspectorControls,
    11, // Displayed first before Responsive settings
  );
};

export { initSliderSettings };
