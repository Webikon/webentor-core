<?php

namespace Webentor\Core\View\Components;

use Roots\Acorn\View\Component;

class Button extends Component
{
    /**
     * The button title.
     *
     * @var string
     */
    public string $title;

    /**
     * The button variant.
     *
     * @var string 'primary', 'secondary'
     */
    public string $variant;

    /**
     * The button icon name.
     *
     * @var string
     */
    public string $icon;

    /**
     * The button icon position.
     * Can be 'left' or 'right' or 'alone' (text would be hidden).
     *
     * @var string
     */
    public string $iconPosition;

    /**
     * The button element type.
     * Can be 'a' (default) or 'button'
     *
     * @var string
     */
    public string $element;

    /**
     * The button element classes.
     *
     * @var string
     */
    public string $classes;

    /**
     * The button element id.
     *
     * @var string
     */
    public string $id;

    /**
     * The button element href.
     *
     * @var string
     */
    public string $url;

    /**
     * The button element disabled.
     *
     * @var string
     */
    public string $disabled;

    /**
     * Either 'true' or 'false'
     *
     * @var string
     */
    public string $openInNewTab;

    /**
     * Either 'true' or 'false'
     *
     * @var string
     */
    public string $fullWidth;

    /**
     * The button type.
     * Can be 'submit' or 'button'
     *
     * @var string
     */
    public string $buttonType;

    /**
     * Additional data attributes
     *
     * @var array
     */
    public array|null $dataAttributes;

    /**
     * Use as toggle, e.g. for Accordion. Either 'true' or 'false'
     *
     * @var string
     */
    public string $useAsToggle;

    /**
     * The button element size.
     * Cam be 'small', 'medium' or 'large'.
     *
     * @var string
     */
    public string $size;

    /**
     * Create the component instance.
     *
     * @return void
     */
    public function __construct(
        string $title = '',
        string $variant = 'primary',
        string $size = 'medium',
        string $icon = '',
        string $iconPosition = 'right',
        string $element = 'a',
        string $classes = '',
        string $id = '',
        string $url = '',
        string $disabled = 'false',
        string $openInNewTab = 'false',
        string $fullWidth = 'false',
        string $buttonType = '',
        string $useAsToggle = 'false',
        array $dataAttributes = [],
    ) {
        $this->title = $title;
        $this->variant = $variant;
        $this->size = $size;
        $this->element = $element;
        $this->disabled = $disabled === 'true';
        $this->url = $url;
        $this->id = $id;
        $this->openInNewTab = $openInNewTab === 'true' || $openInNewTab === '1';
        $this->fullWidth = $fullWidth === 'true' || $fullWidth === '1';
        $this->buttonType = $buttonType;
        $this->useAsToggle = $useAsToggle === 'true' || $useAsToggle === '1';
        $this->dataAttributes = ! empty($dataAttributes) ? $dataAttributes : null;
        $this->icon = $icon;
        $this->iconPosition = $iconPosition;

        // Handle classes
        $this->classes = 'js-btn btn';
        $this->classes .= $this->variant ? " btn--{$variant}" : 'btn--primary';
        $this->classes .= $this->disabled ? ' btn--disabled' : '';
        $this->classes .= $this->fullWidth ? ' btn--full-width' : '';
        $this->classes .= $this->iconPosition ? " btn--icon-{$iconPosition}" : '';
        $this->classes .= " btn--size-{$size}";
        $this->classes .= ' ' . $classes;

        // Handle icon
        if ($icon) {
            $icon_html = get_svg('images.svg.' . $icon, 'btn__icon');
            $this->icon = str_contains($icon_html, 'not found') ? '' : $icon_html;
            $this->classes .= str_contains($icon_html, 'not found') ? '' : " btn--icon btn--icon-{$iconPosition} btn--icon-name-{$icon}";
        }
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return $this->view('button.button');
    }
}
