/**
 * DEPRECATED: Use `@webentorCore/block-filters/responsive-settings` instead
 */

import { registerBlockExtension } from '@10up/block-components';
import {
  store as blockEditorStore,
  InspectorControls,
  __experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, TabPanel } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { addFilter, applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { setImmutably } from '../_utils';
import { WebentorConfig } from '../types/_webentor-config';

const initResponsiveSettings = () => {
  // To include any of Responsive settings in a block, you can add "supports" to block.json:
  // "webentor": {
  //   "spacing": true,
  //   "flexbox": true,
  //   "flexboxItem": true,
  //   "display": true,
  //   "blockLink": true
  // }
  // But also if you want to include those settings in other blocks, add them here
  // TODO: Not working for 'core' blocks as we need to find the way to modify their block output and add proper classes
  const includedBlocks = {
    blockLink: [],
    spacing: [],
    display: [],
    grid: [],
    gridItem: [],
    flexbox: [],
    flexboxItem: [],
  };

  const getPixelFromRemValue = (value) => {
    if (value.includes('rem')) {
      // Remove 'rem' from the value
      const remValue = value.replace('rem', '');
      return `${remValue * 16}px`;
    }

    return value;
  };

  // Make sure new attributes are present in blocks so we can conditionally show their settings
  addFilter(
    'blocks.registerBlockType',
    'webentor/addResponsiveSettingsAttributes',
    (settings, name) => {
      if (
        includedBlocks['blockLink'].includes(name) ||
        settings?.supports?.webentor?.blockLink
      ) {
        settings.attributes = {
          ...settings.attributes,
          ...{
            blockLink: {
              type: 'object',
              default: settings.attributes?.blockLink?.default || {},
            },
          },
        };
      }

      if (
        includedBlocks['display'].includes(name) ||
        settings?.supports?.webentor?.display
      ) {
        settings.attributes = {
          ...settings.attributes,
          ...{
            display: {
              type: 'object',
              default: settings.attributes?.display?.default || {
                // Default display is FLEX
                display: {
                  value: {
                    basic: 'flex',
                  },
                },
              },
              blockName: name,
            },
          },
        };
      }

      if (
        includedBlocks['spacing'].includes(name) ||
        settings?.supports?.webentor?.spacing
      ) {
        settings.attributes = {
          ...settings.attributes,
          ...{
            spacing: {
              type: 'object',
              default: settings.attributes?.spacing?.default || {},
            },
          },
        };
      }

      if (
        includedBlocks['grid'].includes(name) ||
        settings?.supports?.webentor?.grid
      ) {
        settings.attributes = {
          ...settings.attributes,
          ...{
            grid: {
              type: 'object',
              default: settings.attributes?.grid?.default || {},
            },
          },
        };
      }

      if (
        includedBlocks['gridItem'].includes(name) ||
        settings?.supports?.webentor?.gridItem
      ) {
        settings.attributes = {
          ...settings.attributes,
          ...{
            gridItem: {
              type: 'object',
              default: settings.attributes?.gridItem?.default || {},
            },
          },
        };
      }

      if (
        includedBlocks['flexbox'].includes(name) ||
        settings?.supports?.webentor?.flexbox
      ) {
        settings.attributes = {
          ...settings.attributes,
          ...{
            flexbox: {
              type: 'object',
              default: settings.attributes?.flexbox?.default || {},
            },
          },
        };
      }

      if (
        includedBlocks['flexboxItem'].includes(name) ||
        settings?.supports?.webentor?.flexboxItem
      ) {
        settings.attributes = {
          ...settings.attributes,
          ...{
            flexboxItem: {
              type: 'object',
              default: settings.attributes?.flexboxItem?.default || {},
            },
          },
        };
      }

      return settings;
    },
  );

  const isSliderEnabledForBreakpoint = (blockName, attributes, breakpoint) => {
    return (
      blockName === 'webentor/e-slider' &&
      attributes?.slider?.enabled?.value?.[breakpoint]
    );
  };

  const DisabledSliderInfoText = () => (
    <div
      // className="text-body my-4 text-12"
      style={{ marginTop: '16px', marginBottom: '16px', fontSize: '12px' }}
    >
      {__(
        'When Slider is enabled for this breakpoint, these settings are ignored.',
        'webentor',
      )}
    </div>
  );

  const hasSpacingSettingsForBreakpoint = (attributes, breakpoint) => {
    return (
      attributes?.spacing?.['margin-top']?.value?.[breakpoint] ||
      attributes?.spacing?.['margin-bottom']?.value?.[breakpoint] ||
      attributes?.spacing?.['margin-left']?.value?.[breakpoint] ||
      attributes?.spacing?.['margin-right']?.value?.[breakpoint] ||
      attributes?.spacing?.['padding-top']?.value?.[breakpoint] ||
      attributes?.spacing?.['padding-bottom']?.value?.[breakpoint] ||
      attributes?.spacing?.['padding-left']?.value?.[breakpoint] ||
      attributes?.spacing?.['padding-right']?.value?.[breakpoint]
    );
  };

  // We are checking for these attributes to be present in the block
  const applyResponsiveSettings = (attributes) => {
    if (
      !attributes?.blockLink &&
      !attributes?.spacing &&
      !attributes?.display &&
      !attributes?.grid &&
      !attributes?.gridItem &&
      !attributes?.flexbox &&
      !attributes?.flexboxItem
    ) {
      return false;
    }

    return true;
  };

  function BlockEdit(props) {
    const { attributes, setAttributes } = props;

    if (!applyResponsiveSettings(attributes)) {
      return null;
    }

    const breakpoints = applyFilters('webentor.core.twBreakpoints', ['basic']);
    const twTheme: WebentorConfig['theme'] = applyFilters(
      'webentor.core.twTheme',
      {},
    );

    // Get spacing values from TW
    const spacingValues = (property = '') => {
      const values = Object.keys(twTheme?.spacing)
        // Sort ASC manually because Object.keys() is sorting keys wrong
        .sort(function (a, b) {
          return a - b;
        })
        .map((key) => ({
          label: `${key * 4}px`,
          value: `${property}-${key}`,
        }));

      // Add none selected option as first item
      values.unshift({
        label: 'None selected',
        value: '',
      });

      return values;
    };

    const flexBasisValues = () => {
      const values = Object.keys(twTheme?.flexBasis)
        .sort(function (a, b) {
          return a - b;
        })
        .map((key) => ({
          label: `${key} (${getPixelFromRemValue(twTheme?.flexBasis[key])})`,
          value: `basis-${key}`,
        }));

      // Add none selected option as first item
      values.unshift({
        label: 'None selected',
        value: '',
      });

      return values;
    };

    // Prepare grid template columns values
    const gridColumnsValues = () => {
      const values = Object.keys(twTheme?.gridTemplateColumns)
        // Sort ASC manually because Object.keys() is sorting keys wrong
        // .sort(function (a, b) {
        //   return a - b;
        // })
        .map((key) => ({
          label: `Columns: ${key}`,
          value: `grid-cols-${key}`,
        }));

      // Add none selected option as first item
      values.unshift({
        label: 'None selected',
        value: '',
      });

      return values;
    };
    // Prepare grid template rows values
    const gridRowsValues = () => {
      const values = Object.keys(twTheme?.gridTemplateRows).map((key) => ({
        label: `Rows: ${key}`,
        value: `grid-rows-${key}`,
      }));

      // Add none selected option as first item
      values.unshift({
        label: 'None selected',
        value: '',
      });

      return values;
    };

    // Prepare grid column span values
    const gridItemColumnSpanValues = () => {
      const values = Object.keys(twTheme?.gridColumn).map((key) => ({
        label: `${key}`,
        value: `col-${key}`,
      }));

      // Add none selected option as first item
      values.unshift({
        label: 'None selected',
        value: '',
      });

      return values;
    };

    // Prepare grid row span values
    const gridItemRowSpanValues = () => {
      const values = Object.keys(twTheme?.gridRow).map((key) => ({
        label: `${key}`,
        value: `row-${key}`,
      }));

      // Add none selected option as first item
      values.unshift({
        label: 'None selected',
        value: '',
      });

      return values;
    };

    // Prepare gap values for Flexbox, and allow to change axis
    const gapValues = (axis = '') => {
      const values = Object.keys(twTheme?.gap)
        // Sort ASC manually because Object.keys() is sorting keys wrong
        .sort(function (a, b) {
          return a - b;
        })
        .map((key) => ({
          label: `${key * 4}px`,
          value: `gap-${axis === 'x' ? 'x-' : axis === 'y' ? 'y-' : ''}${key}`,
        }));

      // Add none selected option as first item
      values.unshift({
        label: 'None selected',
        value: '',
      });

      return values;
    };

    const heightValues = () => {
      const values = Object.keys(twTheme?.height)
        // Sort ASC manually because Object.keys() is sorting keys wrong
        .sort(function (a, b) {
          return a - b;
        })
        .map((key) => ({
          label: `${key} (${getPixelFromRemValue(twTheme?.height[key])})`,
          value: `h-${key}`,
        }));

      // Add none selected option as first item
      values.unshift({
        label: 'None selected',
        value: '',
      });

      return values;
    };

    const alignItemsValues = () => {
      return [
        {
          label: 'None selected',
          value: '',
        },
        {
          label: 'Flex Start',
          value: 'items-start',
        },
        {
          label: 'Flex End',
          value: 'items-end',
        },
        {
          label: 'Center',
          value: 'items-center',
        },
        {
          label: 'Baseline',
          value: 'items-baseline',
        },
        {
          label: 'Stretch',
          value: 'items-stretch',
        },
      ];
    };

    const justifyContentValues = () => {
      return [
        {
          label: 'None selected',
          value: '',
        },
        {
          label: 'Normal',
          value: 'justify-normal',
        },
        {
          label: 'Flex Start',
          value: 'justify-start',
        },
        {
          label: 'Flex End',
          value: 'justify-end',
        },
        {
          label: 'Center',
          value: 'justify-center',
        },
        {
          label: 'Space Between',
          value: 'justify-between',
        },
        {
          label: 'Space Around',
          value: 'justify-around',
        },
        {
          label: 'Space Evenly',
          value: 'justify-evenly',
        },
        {
          label: 'Stretch',
          value: 'justify-stretch',
        },
      ];
    };

    const alignContentValues = () => {
      return [
        {
          label: 'None selected',
          value: '',
        },
        {
          label: 'Normal',
          value: 'content-normal',
        },
        {
          label: 'Flex Start',
          value: 'content-start',
        },
        {
          label: 'Flex End',
          value: 'content-end',
        },
        {
          label: 'Center',
          value: 'content-center',
        },
        {
          label: 'Space Between',
          value: 'content-between',
        },
        {
          label: 'Space Around',
          value: 'content-around',
        },
        {
          label: 'Space Evenly',
          value: 'content-evenly',
        },
        {
          label: 'Baseline',
          value: 'content-baseline',
        },
        {
          label: 'Stretch',
          value: 'content-stretch',
        },
      ];
    };

    const spacingProperties = [
      {
        label: 'Margin Top',
        name: 'margin-top',
        values: [...spacingValues('mt'), { label: 'Auto', value: 'mt-auto' }],
      },
      {
        label: 'Margin Left',
        name: 'margin-left',
        values: [...spacingValues('ml'), { label: 'Auto', value: 'ml-auto' }],
      },
      {
        label: 'Margin Right',
        name: 'margin-right',
        values: [...spacingValues('mr'), { label: 'Auto', value: 'mr-auto' }],
      },
      {
        label: 'Margin Bottom',
        name: 'margin-bottom',
        values: [...spacingValues('mb'), { label: 'Auto', value: 'mb-auto' }],
      },
      {
        label: 'Padding Top',
        name: 'padding-top',
        values: spacingValues('pt'),
      },
      {
        label: 'Padding Left',
        name: 'padding-left',
        values: spacingValues('pl'),
      },
      {
        label: 'Padding Right',
        name: 'padding-right',
        values: spacingValues('pr'),
      },
      {
        label: 'Padding Bottom',
        name: 'padding-bottom',
        values: spacingValues('pb'),
      },
    ];

    const displayProperties = (blockName) =>
      applyFilters('webentor-theme-display-settings', [
        {
          label: 'Display',
          name: 'display',
          help: 'Initial value is "Flex"',
          values: [
            {
              label: 'None selected',
              value: '',
            },
            {
              label: 'Block',
              value: 'block',
            },
            {
              label: 'Hidden',
              value: 'hidden',
            },
            {
              label: 'Flex',
              value: 'flex',
            },
            {
              label: 'Grid',
              value: 'grid',
            },
            {
              label: 'Inline Block',
              value: 'inline-block',
            },
            {
              label: 'Inline',
              value: 'inline',
            },
          ],
          blockName, // Pass block name as an additional property
        },
        {
          label: 'Height',
          name: 'height',
          values: heightValues(),
        },
      ]);

    const gridProperties = [
      {
        label: 'Grid Template Columns',
        name: 'grid-cols',
        values: gridColumnsValues(),
      },
      {
        label: 'Grid Template Rows',
        name: 'grid-rows',
        values: gridRowsValues(),
      },
      {
        label: 'Gap',
        name: 'gap',
        values: gapValues(),
      },
      {
        label: 'Gap X',
        name: 'gap-x',
        values: gapValues('x'),
        help: 'Overrides Gap value',
      },
      {
        label: 'Gap Y',
        name: 'gap-y',
        values: gapValues('y'),
        help: 'Overrides Gap value',
      },
      {
        label: 'Justify Content',
        name: 'justify-content',
        values: justifyContentValues(),
      },
      {
        label: 'Align Items',
        name: 'align-items',
        values: alignItemsValues(),
      },
      {
        label: 'Align Content',
        name: 'align-content',
        values: alignContentValues(),
      },
    ];

    const gridItemProperties = [
      {
        label: 'Grid Column Span',
        name: 'grid-col-span',
        values: gridItemColumnSpanValues(),
      },
      {
        label: 'Grid Row Span',
        name: 'grid-row-span',
        values: gridItemRowSpanValues(),
      },
    ];

    const flexboxProperties = [
      {
        label: 'Flex Gap',
        name: 'gap',
        values: gapValues(),
      },
      {
        label: 'Flex Gap X',
        name: 'gap-x',
        values: gapValues('x'),
        help: 'Overrides Gap value',
      },
      {
        label: 'Flex Gap Y',
        name: 'gap-y',
        values: gapValues('y'),
        help: 'Overrides Gap value',
      },
      {
        label: 'Flex Direction',
        name: 'flex-direction',
        values: [
          {
            label: 'None selected',
            value: '',
          },
          {
            label: 'Row',
            value: 'flex-row',
          },
          {
            label: 'Row Reverse',
            value: 'flex-row-reverse',
          },
          {
            label: 'Column',
            value: 'flex-col',
          },
          {
            label: 'Column Reverse',
            value: 'flex-col-reverse',
          },
        ],
      },
      {
        label: 'Flex Wrap',
        name: 'flex-wrap',
        values: [
          {
            label: 'None selected',
            value: '',
          },
          {
            label: 'Wrap',
            value: 'flex-wrap',
          },
          {
            label: 'Nowrap',
            value: 'flex-nowrap',
          },
          {
            label: 'Wrap Reverse',
            value: 'flex-wrap-reverse',
          },
        ],
      },
      {
        label: 'Justify Content',
        name: 'justify-content',
        values: justifyContentValues(),
      },
      {
        label: 'Align Items',
        name: 'align-items',
        values: alignItemsValues(),
      },
      {
        label: 'Align Content',
        name: 'align-content',
        values: alignContentValues(),
      },
    ];

    // Flexbox properties applicable only on Flexbox child items
    const flexboxItemProperties = [
      {
        label: 'Flex Grow',
        name: 'flex-grow',
        help: 'Applicable only on Flexbox child item',
        values: [
          {
            label: 'None selected',
            value: '',
          },
          {
            label: 'Grow 0',
            value: 'grow-0',
          },
          {
            label: 'Grow 1',
            value: 'grow',
          },
        ],
      },
      {
        label: 'Flex Shrink',
        name: 'flex-shrink',
        help: 'Applicable only on Flexbox child item',
        values: [
          {
            label: 'None selected',
            value: '',
          },
          {
            label: 'Shrink 0',
            value: 'shrink-0',
          },
          {
            label: 'Shrink 1',
            value: 'shrink',
          },
        ],
      },
      {
        label: 'Flex Basis',
        name: 'flex-basis',
        help: 'Applicable only on Flexbox child item',
        values: flexBasisValues(),
      },
    ];

    // Get parent block data
    const { clientId } = props;
    const parentClientId = useSelect(
      (select) => select(blockEditorStore).getBlockRootClientId(clientId),
      [clientId],
    );
    const parentBlock = useSelect(
      (select) => select(blockEditorStore).getBlock(parentClientId),
      [parentClientId],
    );

    return (
      <Fragment>
        <InspectorControls>
          {attributes?.spacing ? (
            <PanelBody
              title={__('Spacing Settings', 'webentor')}
              initialOpen={false}
            >
              <TabPanel
                activeClass="is-active"
                className="w-responsive-settings-tabs"
                initialTabName={breakpoints[0]}
                tabs={
                  breakpoints.map((breakpoint) => ({
                    name: breakpoint,
                    title: `${
                      breakpoint
                    }${hasSpacingSettingsForBreakpoint(attributes, breakpoint) ? '*' : ''}`, // Add * if spacing is set on this breakpoint
                  })) || []
                }
              >
                {(tab) => (
                  <div
                    // className="mt-4 flex flex-wrap justify-center gap-x-4"
                    style={{
                      marginTop: '16px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '16px',
                    }}
                  >
                    {spacingProperties.map((property) => (
                      <div
                        key={property.name + tab.name}
                        // className={
                        //   property.name.includes('top') ||
                        //   property.name.includes('bottom')
                        //     ? 'mx-auto w-9/12'
                        //     : `${property.name.includes('left')}` ||
                        //         property.name.includes('right')
                        //       ? 'w-2/5'
                        //       : ''
                        // }
                        style={{
                          margin:
                            property.name.includes('top') ||
                            property.name.includes('bottom')
                              ? '0 auto'
                              : undefined,
                          width:
                            property.name.includes('top') ||
                            property.name.includes('bottom')
                              ? '75%'
                              : property.name.includes('left') ||
                                  property.name.includes('right')
                                ? '40%'
                                : undefined,
                        }}
                      >
                        <SelectControl
                          label={property.label}
                          value={
                            attributes.spacing?.[property.name]?.value?.[
                              tab.name
                            ]
                          }
                          help={property?.help}
                          options={property.values}
                          onChange={(selected) =>
                            setAttributes(
                              setImmutably(
                                attributes,
                                ['spacing', property.name, 'value', tab.name],
                                selected,
                              ),
                            )
                          }
                        />

                        {/* Horizontal line between margin & padding settings */}
                        {property.name.includes('margin-bottom') && <hr />}
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>
            </PanelBody>
          ) : null}

          {(attributes?.display ||
            attributes?.grid ||
            attributes?.gridItem ||
            attributes?.flexbox ||
            attributes?.flexboxItem) && (
            <PanelBody
              title={__('Container Settings', 'webentor')}
              initialOpen={true}
            >
              <TabPanel
                activeClass="is-active"
                className="w-responsive-settings-tabs"
                initialTabName={breakpoints[0]}
                tabs={
                  breakpoints.map((breakpoint) => ({
                    name: breakpoint,
                    title: `${
                      breakpoint
                    }${attributes?.display?.display?.value?.[breakpoint] ? '*' : ''}`, // Add * if display is set on this breakpoint
                  })) || []
                }
              >
                {(tab) => (
                  <>
                    {attributes?.display ? (
                      <div
                        // className="mt-4"
                        style={{ marginTop: '16px' }}
                      >
                        {isSliderEnabledForBreakpoint(props.name, attributes, [
                          tab.name,
                        ]) && <DisabledSliderInfoText />}

                        {displayProperties(props.name).map((property) => {
                          return (
                            <Fragment key={property.name + tab.name}>
                              <SelectControl
                                label={property.label}
                                value={
                                  attributes.display?.[property.name]?.value?.[
                                    tab.name
                                  ]
                                }
                                disabled={isSliderEnabledForBreakpoint(
                                  props.name,
                                  attributes,
                                  [tab.name],
                                )}
                                help={property?.help}
                                options={property.values}
                                onChange={(selected) =>
                                  setAttributes(
                                    setImmutably(
                                      attributes,
                                      [
                                        'display',
                                        property.name,
                                        'value',
                                        tab.name,
                                      ],
                                      selected,
                                    ),
                                  )
                                }
                              />
                            </Fragment>
                          );
                        })}
                      </div>
                    ) : null}

                    {/* Show when grid is enabled for this block & display === 'grid */}
                    {attributes?.grid &&
                    attributes?.display?.display?.value?.[tab.name] ===
                      'grid' ? (
                      <div
                        // className="mt-4 border border-editor-border p-2"
                        style={{
                          marginTop: '16px',
                          border: '1px solid #e0e0e0',
                          padding: '8px',
                        }}
                      >
                        <h3
                          // className="mb-2"
                          style={{ marginBottom: '8px' }}
                        >
                          {__('Grid settings', 'webentor')}
                        </h3>

                        {gridProperties.map((property) => (
                          <Fragment key={property.name + tab.name}>
                            <SelectControl
                              label={property.label}
                              value={
                                attributes.grid?.[property.name]?.value?.[
                                  tab.name
                                ]
                              }
                              help={property?.help}
                              options={property.values}
                              onChange={(selected) =>
                                setAttributes(
                                  setImmutably(
                                    attributes,
                                    ['grid', property.name, 'value', tab.name],
                                    selected,
                                  ),
                                )
                              }
                            />
                          </Fragment>
                        ))}
                      </div>
                    ) : null}

                    {/* Show when gridItem is enabled for this block & parent block has display === 'grid'  */}
                    {parentBlock?.attributes?.display?.display?.value?.[
                      tab.name
                    ] === 'grid' ? (
                      <div
                        // className="mt-4 border border-editor-border p-2"
                        style={{
                          marginTop: '16px',
                          border: '1px solid #e0e0e0',
                          padding: '8px',
                        }}
                      >
                        <h3
                          // className="mb-2"
                          style={{ marginBottom: '8px' }}
                        >
                          {__('Grid Item settings', 'webentor')}
                        </h3>
                        <div
                          // className="mb-2 text-12"
                          style={{ marginBottom: '8px', fontSize: '12px' }}
                        >
                          {__(
                            'Parent block display setting is set to `Grid`, so current block also acts as grid item.',
                            'webentor',
                          )}
                        </div>

                        {gridItemProperties.map((property) => (
                          <Fragment key={property.name + tab.name}>
                            <SelectControl
                              label={property.label}
                              value={
                                attributes.gridItem?.[property.name]?.value?.[
                                  tab.name
                                ]
                              }
                              help={property?.help}
                              options={property.values}
                              onChange={(selected) =>
                                setAttributes(
                                  setImmutably(
                                    attributes,
                                    [
                                      'gridItem',
                                      property.name,
                                      'value',
                                      tab.name,
                                    ],
                                    selected,
                                  ),
                                )
                              }
                            />
                          </Fragment>
                        ))}
                      </div>
                    ) : null}

                    {/* Show when flexboxItem is enabled for this block & parent block has display === 'flex' */}
                    {attributes?.flexboxItem &&
                    parentBlock?.attributes?.display?.display?.value?.[
                      tab.name
                    ] === 'flex' ? (
                      <div
                        // className="mt-4 border border-editor-border p-2"
                        style={{
                          marginTop: '8px',
                          border: '1px solid #e0e0e0',
                          padding: '8px',
                        }}
                      >
                        <h3
                          // className="mb-2"
                          style={{ marginBottom: '8px' }}
                        >
                          {__('Flex Item settings', 'webentor')}
                        </h3>
                        <div
                          // className="mb-2 mt-1 text-14"
                          style={{
                            marginBottom: '8px',
                            marginTop: '4px',
                            fontSize: '14px',
                          }}
                        >
                          {__(
                            'Parent block display setting is set to `Grid`, so current block also acts as flex item.',
                            'webentor',
                          )}
                        </div>

                        {isSliderEnabledForBreakpoint(props.name, attributes, [
                          tab.name,
                        ]) && <DisabledSliderInfoText />}

                        {flexboxItemProperties.map((property) => (
                          <Fragment key={property.name + tab.name}>
                            <SelectControl
                              label={property.label}
                              value={
                                attributes.flexboxItem?.[property.name]
                                  ?.value?.[tab.name]
                              }
                              disabled={isSliderEnabledForBreakpoint(
                                props.name,
                                attributes,
                                [tab.name],
                              )}
                              help={property?.help}
                              options={property.values}
                              onChange={(selected) =>
                                setAttributes(
                                  setImmutably(
                                    attributes,
                                    [
                                      'flexboxItem',
                                      property.name,
                                      'value',
                                      tab.name,
                                    ],
                                    selected,
                                  ),
                                )
                              }
                            />
                          </Fragment>
                        ))}
                      </div>
                    ) : null}

                    {/* Show when flex is enabled for this block & display === 'flex' */}
                    {attributes?.flexbox &&
                    attributes?.display?.display?.value?.[tab.name] ===
                      'flex' ? (
                      <div
                        // className="mt-4 border border-editor-border p-2"
                        style={{
                          marginTop: '16px',
                          border: '1px solid #e0e0e0',
                          padding: '8px',
                        }}
                      >
                        <h3
                          // className="mb-2"
                          style={{ marginBottom: '8px' }}
                        >
                          {__('Flexbox settings', 'webentor')}
                        </h3>

                        {isSliderEnabledForBreakpoint(props.name, attributes, [
                          tab.name,
                        ]) && <DisabledSliderInfoText />}

                        {flexboxProperties.map((property) => (
                          <Fragment key={property.name + tab.name}>
                            <SelectControl
                              label={property.label}
                              value={
                                attributes.flexbox?.[property.name]?.value?.[
                                  tab.name
                                ]
                              }
                              disabled={isSliderEnabledForBreakpoint(
                                props.name,
                                attributes,
                                [tab.name],
                              )}
                              help={property?.help}
                              options={property.values}
                              onChange={(selected) =>
                                setAttributes(
                                  setImmutably(
                                    attributes,
                                    [
                                      'flexbox',
                                      property.name,
                                      'value',
                                      tab.name,
                                    ],
                                    selected,
                                  ),
                                )
                              }
                            />
                          </Fragment>
                        ))}
                      </div>
                    ) : null}
                  </>
                )}
              </TabPanel>
            </PanelBody>
          )}
        </InspectorControls>

        {attributes?.blockLink !== undefined ? (
          <InspectorControls>
            <div className="w-link-settings" style={{ marginBottom: '16px' }}>
              <h3
                // className="p-4 pb-0"
                style={{ padding: '16px', paddingBottom: '0px' }}
              >
                {__('Block Link', 'webentor')}
              </h3>
              <LinkControl
                value={attributes?.blockLink}
                settings={[
                  {
                    id: 'open_in_new_tab',
                    title: __('New tab?', 'webentor'),
                  },
                ]}
                onChange={(inputValue) =>
                  setAttributes(
                    setImmutably(attributes, ['blockLink'], inputValue),
                  )
                }
                onRemove={() =>
                  setAttributes(setImmutably(attributes, ['blockLink'], null))
                }
                withCreateSuggestion={true}
                createSuggestion={(inputValue) =>
                  setAttributes(
                    setImmutably(attributes, ['blockLink'], inputValue),
                  )
                }
                createSuggestionButtonText={(newValue) =>
                  `${__('New:', 'webentor')} ${newValue}`
                }
              ></LinkControl>
            </div>
          </InspectorControls>
        ) : null}
      </Fragment>
    );
  }

  const prepareTailwindClassesFromSettings = (settings, type) => {
    const classes = [];

    if (settings[type]) {
      Object.entries(settings[type]).forEach(([, prop]) => {
        if (prop?.value) {
          Object.entries(prop?.value).forEach(([bpName, bpPropValue]) => {
            if (type === 'flex' || type === 'flexItem') {
              if (settings?.display?.display?.value?.[bpName] !== 'flex') {
                return;
              }
            }

            if (type === 'grid' || type === 'gridItem') {
              if (settings?.display?.display?.value?.[bpName] !== 'grid') {
                return;
              }
            }

            if (settings?.slider?.enabled?.value?.[bpName]) {
              return;
            }

            if (bpPropValue) {
              const twBreakpoint = bpName === 'basic' ? '' : `${bpName}:`;

              classes.push(`${twBreakpoint}${bpPropValue}`);
            }
          });
        }
      });
    }

    return classes;
  };

  /**
   * generateClassNames
   *
   * a function to generate the new className string that should
   * get added to the wrapping element of the block.
   *
   * @param {object} attributes block attributes
   * @returns {string}
   */
  function generateClassNames(attributes) {
    // We are checking for these attributes to be present in the block
    // Attributes should be defined as defaults in app/blocks.php
    if (!applyResponsiveSettings(attributes)) {
      return '';
    }

    const classes = [];

    // Prepare all Tailwind classes
    const spacingClasses = prepareTailwindClassesFromSettings(
      attributes,
      'spacing',
    );
    const displayClasses = prepareTailwindClassesFromSettings(
      attributes,
      'display',
    );
    const flexboxClasses = prepareTailwindClassesFromSettings(
      attributes,
      'flexbox',
    );
    const flexboxItemClasses = prepareTailwindClassesFromSettings(
      attributes,
      'flexboxItem',
    );
    const gridClasses = prepareTailwindClassesFromSettings(attributes, 'grid');
    const gridItemClasses = prepareTailwindClassesFromSettings(
      attributes,
      'gridItem',
    );

    classes.push(...spacingClasses);
    classes.push(...displayClasses);
    classes.push(...flexboxClasses);
    classes.push(...flexboxItemClasses);
    classes.push(...gridClasses);
    classes.push(...gridItemClasses);

    // console.log(attributes);
    // console.log(classes);

    return classes.join(' ') ?? '';
  }

  /**
   * a function to generate the new inline style object that should
   * get added to the wrapping element of the block.
   *
   * @param attributes
   * @returns
   */
  function inlineStyleGenerator() {
    return {};
  }

  // Register block extension for all blocks
  registerBlockExtension('*', {
    extensionName: 'webentor.core.addResponsiveSettings',
    attributes: {},
    inlineStyleGenerator: inlineStyleGenerator,
    classNameGenerator: generateClassNames,
    order: 'before',
    Edit: BlockEdit,
  });
};

export { initResponsiveSettings };
