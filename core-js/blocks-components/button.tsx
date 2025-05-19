import { useState } from 'react';
import { URLInput } from '@wordpress/block-editor';
import {
  Icon,
  Popover,
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
      }
    },
    "default": {
      "showButton": true,
      "title": "Button",
      "variant": "primary"
      "url": "#",
      "newTab": false
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

  return (
    <span className={`${className ?? ''} relative inline-block`}>
      {visible && (
        <Popover
          placement={placement ?? 'bottom'}
          shift
          onFocusOutside={handleTogglePopover}
        >
          <div className="w-[320px] p-2">
            <h4 className="flex text-14 uppercase">
              {__('Button Settings', 'webentor')}
              <button className="ml-auto" onClick={handleTogglePopover}>
                <Icon icon="no-alt" />
              </button>
            </h4>

            <hr className="mb-3 mt-2" />

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
              className="mb-3"
            />

            {!hideVariant && (
              <div className="mb-2">
                <p className="mb-2 text-12 uppercase">
                  {__('Button Variant', 'webentor')}
                </p>
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
                      className={`pr-2 ${variant === item.slug ? 'font-bold' : ''}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {!hideSize && (
              <div className="mb-2">
                <p className="mb-2 text-12 uppercase">
                  {__('Button Size', 'webentor')}
                </p>
                {sizes.map((item) => {
                  return (
                    <button
                      key={item.slug}
                      onClick={() =>
                        updateObjectAttribute(attributeName, 'size', item.slug)
                      }
                      className={`pr-2 ${
                        attributes[attributeName]?.size === item.slug
                          ? 'font-bold'
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

            {!hideLink && (
              <>
                <URLInput
                  // label={__('Button URL', 'webentor')}
                  value={
                    attributes[attributeName] && attributes[attributeName]?.url
                      ? attributes[attributeName]?.url
                      : ''
                  }
                  onChange={(value) =>
                    updateObjectAttribute(attributeName, 'url', value)
                  }
                  className="mb-2"
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
          </div>
        </Popover>
      )}

      <span className={`${innerClassName ?? ''} inline-block`}>
        {!attributes[attributeName]?.showButton && (
          <span className="absolute -right-1 -top-1 z-10 flex h-4 w-6 items-center justify-center rounded bg-white shadow">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-5"
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

        <button
          type="button"
          className={`btn btn--${variant} btn--size-${size} ${buttonClassName ?? ''} prevent-hover ${!attributes[attributeName]?.showButton ? 'opacity-40' : ''}`}
          onClick={handleTogglePopover}
        >
          <span className="btn__text">
            {attributes[attributeName] && attributes[attributeName]?.title
              ? attributes[attributeName]?.title
              : ''}
          </span>
        </button>
      </span>
    </span>
  );
};
