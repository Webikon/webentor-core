import { useState } from 'react';
import {
  Icon as Icon10up,
  IconPickerToolbarButton,
} from '@10up/block-components';
import { URLInput } from '@wordpress/block-editor';
import {
  Icon,
  Popover,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Button component.
 *
 * @param {object}   props
 * @param {string}   props.attributeName    Attribute name for button object, e.g. "button".
 * @param {string}   props.placement        Popover placement
 * @param {boolean}  props.hideVariant      Whether variants select should be displayed.
 * @param {boolean}  props.hideAction       Whether action select should be displayed.
 * @param {boolean}  props.hideLink         Whether url and open in new tab toggle should be displayed.
 * @param {boolean}  props.hidePopup        Whether popup select should be displayed.
 * @param {string}   props.className        Classes.
 * @param {string}   props.innerClassName   Inner classes.
 * @param {string}   props.buttonClassName  Button classes.
 * @returns {Function}                      Render the component.
 */

/**
 * Button attributes in block.json
 *
  "button": {
    "type": "object",
    "properties": {
      "showButton": {
        "type": "boolean"
      }
      "title": {
        "type": "string"
      },
      "variant": {
        "type": "string",
        enum: [ "primary", "secondary", "tertiary" ],
      },
      "size": {
        "type": "string",
        enum: [ "small", "medium", "large" ],
      },
      "url": {
        "type": "string"
      },
      "newTab": {
        "type": "boolean"
      },
      "showIcon": {
        "type": "boolean"
      },
      "icon": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "iconSet": { "type": "string" }
        }
      },
      "iconPosition": {
        "type": "string",
      }
      "htmlElement": {
        "type": "string"
      }
    },
    "default": {
      "showButton": true,
      "title": "Button",
      "variant": "primary"
      "url": "#",
      "newTab": false,
      "showIcon": false,
      "icon": null,
      "iconPosition": "right",
      "htmlElement": "a"
    }
  }
 */

export const WebentorButton = (props) => {
  const {
    placement,
    className,
    innerClassName,
    hideVariant,
    hideSize,
    hideLink,
    attributeName,
    attributes,
    setAttributes,
  } = props;

  const [visible, setVisible] = useState(false);

  function updateObjectAttribute(obj, attr, value) {
    const tempObj = { ...attributes[obj] };
    tempObj[attr] = value;
    setAttributes({ [obj]: tempObj });
  }

  const buttonClassName = applyFilters(
    'webentor.core.button.className',
    props.buttonClassName,
    props,
  ) as string;

  const variants = applyFilters('webentor.core.button.variants', [
    {
      slug: 'primary',
      label: __('Primary', 'webentor'),
    },
    {
      slug: 'secondary',
      label: __('Secondary', 'webentor'),
    },
    {
      slug: 'tertiary',
      label: __('Tertiary', 'webentor'),
    },
  ]) as { slug: string; label: string }[];

  const sizes = applyFilters('webentor.core.button.sizes', [
    {
      slug: 'small',
      label: __('Small', 'webentor'),
    },
    {
      slug: 'medium',
      label: __('Medium', 'webentor'),
    },
    {
      slug: 'large',
      label: __('Large', 'webentor'),
    },
  ]) as { slug: string; label: string }[];

  const iconPositions = applyFilters('webentor.core.button.iconPositions', [
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
    { label: 'Alone', value: 'alone' },
  ]) as { label: string; value: string }[];

  // This hook allows us to extend button with additional components, settings, etc.
  const ExtensionComponent = applyFilters(
    'webentor.core.button.extensionComponent',
    <></>,
    props,
  ) as React.ReactNode;

  const variant = attributes[attributeName]?.variant
    ? attributes[attributeName]?.variant
    : 'primary';

  const size = attributes[attributeName]?.size
    ? attributes[attributeName]?.size
    : 'medium';

  const handleTogglePopover = () => {
    setVisible(!visible);
  };

  const handleIconSelection = (value) =>
    updateObjectAttribute(attributeName, 'icon', {
      name: value.name,
      iconSet: value.iconSet,
    });

  const ButtonOutput = applyFilters(
    'webentor.core.button.output',
    <button
      type="button"
      className={`btn btn--${variant} btn--size-${size} ${buttonClassName ?? ''} wbtr:prevent-hover ${attributes[attributeName]?.showIcon && attributes[attributeName]?.icon?.name ? 'btn--icon' : ''} ${attributes[attributeName]?.iconPosition ? `btn--icon-${attributes[attributeName]?.iconPosition}` : ''} ${!attributes[attributeName]?.showButton ? 'wbtr:opacity-40' : ''}`}
    >
      <span className="btn__text">
        {attributes[attributeName] && attributes[attributeName]?.title
          ? attributes[attributeName]?.title
          : ''}
      </span>

      {attributes[attributeName]?.showIcon &&
        attributes[attributeName]?.icon?.name && (
          <span className="btn__icon svg-icon">
            <Icon10up
              name={attributes[attributeName]?.icon.name}
              iconSet={attributes[attributeName]?.icon.iconSet}
            />
          </span>
        )}
    </button>,
    props,
    buttonClassName,
  );

  return (
    <span className={`${className ?? ''} wbtr:relative wbtr:inline-block`}>
      {visible && (
        <Popover
          placement={placement ?? 'bottom'}
          shift
          onFocusOutside={handleTogglePopover}
        >
          <div className="wbtr:w-[320px] wbtr:p-2">
            <h4 className="wbtr:flex wbtr:text-14 wbtr:uppercase">
              {__('Button Settings', 'webentor')}
              <button className="wbtr:ml-auto" onClick={handleTogglePopover}>
                <Icon icon="no-alt" />
              </button>
            </h4>

            <hr className="wbtr:mt-2 wbtr:mb-3" />

            <ToggleControl
              label={__('Show button', 'webentor')}
              checked={
                attributes[attributeName] &&
                attributes[attributeName]?.showButton
                  ? attributes[attributeName]?.showButton
                  : false
              }
              onChange={(value) =>
                updateObjectAttribute(attributeName, 'showButton', value)
              }
            />

            <TextControl
              label={__('Button Title', 'webentor')}
              value={
                attributes[attributeName] && attributes[attributeName]?.title
                  ? attributes[attributeName]?.title
                  : ''
              }
              onChange={(value) =>
                updateObjectAttribute(attributeName, 'title', value)
              }
              className="wbtr:mb-3"
            />

            {!hideVariant && (
              <div className="wbtr:mb-3">
                <div className="wbtr:mt-0 wbtr:mb-2 wbtr:text-[11px] wbtr:uppercase">
                  {__('Button Variant', 'webentor')}
                </div>
                {variants.map((item) => {
                  return (
                    <button
                      key={item.slug}
                      onClick={() =>
                        updateObjectAttribute(
                          attributeName,
                          'variant',
                          item.slug,
                        )
                      }
                      className={`wbtr:pr-2 ${variant === item.slug ? 'wbtr:font-bold!' : ''}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {!hideSize && (
              <div className="wbtr:mb-3">
                <div className="wbtr:mt-0 wbtr:mb-2 wbtr:text-[11px] wbtr:uppercase">
                  {__('Button Size', 'webentor')}
                </div>
                {sizes.map((item) => {
                  return (
                    <button
                      key={item.slug}
                      onClick={() =>
                        updateObjectAttribute(attributeName, 'size', item.slug)
                      }
                      className={`wbtr:pr-2 ${
                        attributes[attributeName]?.size === item.slug
                          ? 'wbtr:font-bold!'
                          : ''
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {ExtensionComponent}

            <SelectControl
              label={__('Button HTML Element', 'webentor')}
              value={attributes[attributeName]?.htmlElement}
              options={[
                { label: __('Link (<a>)', 'webentor'), value: 'a' },
                { label: __('Button (<button>)', 'webentor'), value: 'button' },
              ]}
              onChange={(value) =>
                updateObjectAttribute(attributeName, 'htmlElement', value)
              }
            />

            {!hideLink &&
              attributes[attributeName]?.htmlElement != 'button' && (
                <>
                  <div className="wbtr:mt-0 wbtr:mb-2 wbtr:text-[11px] wbtr:uppercase">
                    {__('Button URL', 'webentor')}
                  </div>
                  <URLInput
                    // label={__('Button URL', 'webentor')}
                    value={
                      attributes[attributeName] &&
                      attributes[attributeName]?.url
                        ? attributes[attributeName]?.url
                        : ''
                    }
                    onChange={(value) =>
                      updateObjectAttribute(attributeName, 'url', value)
                    }
                    className="wbtr:mb-2"
                  />

                  <ToggleControl
                    label={__('Open in new tab', 'webentor')}
                    checked={
                      attributes[attributeName] &&
                      attributes[attributeName]?.newTab
                        ? attributes[attributeName]?.newTab
                        : false
                    }
                    onChange={(value) =>
                      updateObjectAttribute(attributeName, 'newTab', value)
                    }
                  />
                </>
              )}

            <div className="wbtr:border wbtr:border-editor-border wbtr:p-2">
              <div className="wbtr:my-2">
                <ToggleControl
                  label="Show Button Icon"
                  checked={attributes[attributeName]?.showIcon}
                  onChange={(value) =>
                    updateObjectAttribute(attributeName, 'showIcon', value)
                  }
                />
              </div>

              {attributes[attributeName]?.showIcon && (
                <div>
                  <div className="wbtr:mb-2 wbtr:flex wbtr:items-center wbtr:gap-4">
                    <IconPickerToolbarButton
                      label="Icon"
                      value={attributes[attributeName]?.icon}
                      onChange={handleIconSelection}
                    />
                    {attributes[attributeName]?.icon?.name ? (
                      <div className="wbtr:size-10">
                        <Icon10up
                          name={attributes[attributeName]?.icon.name}
                          iconSet={attributes[attributeName]?.icon.iconSet}
                        />
                      </div>
                    ) : (
                      'No icon selected'
                    )}
                  </div>
                  <div className="wbtr:mb-2">
                    <SelectControl
                      label="Icon Position"
                      value={attributes[attributeName]?.iconPosition}
                      options={iconPositions}
                      onChange={(value) =>
                        updateObjectAttribute(
                          attributeName,
                          'iconPosition',
                          value,
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Popover>
      )}

      <span
        className={`${innerClassName ?? ''} wbtr:inline-block`}
        onClick={handleTogglePopover}
      >
        {!attributes[attributeName]?.showButton && (
          <span className="wbtr:rounded wbtr:absolute wbtr:-top-1 wbtr:-right-1 wbtr:z-10 wbtr:flex wbtr:h-4 wbtr:w-6 wbtr:items-center wbtr:justify-center wbtr:bg-white wbtr:shadow">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="wbtr:h-4 wbtr:w-5"
            >
              <rect
                x="18.364"
                y="4.22183"
                width="2"
                height="20"
                rx="1"
                transform="rotate(45 18.364 4.22183)"
              />
              <path d="M14.7716 6.40004C13.8862 6.149 12.9574 6 12 6C5.92487 6 1 12 1 12C1 12 2.71502 14.0894 5.36939 15.8023L6.82033 14.3513C6.33195 14.0549 5.86521 13.7341 5.42544 13.4027C4.77864 12.9153 4.2185 12.4263 3.76677 12C4.2185 11.5737 4.77864 11.0847 5.42544 10.5973C7.27304 9.20505 9.59678 8 12 8C12.3661 8 12.7303 8.02796 13.0914 8.0803L14.7716 6.40004ZM12.1671 9.00457C12.1118 9.00154 12.0561 9 12 9C10.3431 9 9 10.3431 9 12C9 12.0561 9.00154 12.1118 9.00457 12.1671L12.1671 9.00457ZM11.8331 14.9954L14.9954 11.8331C14.9985 11.8883 15 11.944 15 12C15 13.6569 13.6569 15 12 15C11.944 15 11.8883 14.9985 11.8331 14.9954ZM10.9088 15.9197C11.2697 15.972 11.6339 16 12 16C14.4032 16 16.727 14.795 18.5746 13.4027C19.2214 12.9153 19.7815 12.4263 20.2332 12C19.7815 11.5737 19.2214 11.0847 18.5746 10.5973C18.1348 10.2659 17.6681 9.94516 17.1798 9.64873L18.6307 8.1978C21.285 9.91063 23 12 23 12C23 12 18.0751 18 12 18C11.0427 18 10.1139 17.851 9.22851 17.6L10.9088 15.9197Z" />
            </svg>
          </span>
        )}

        {ButtonOutput}
      </span>
    </span>
  );
};
