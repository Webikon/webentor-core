<?php

namespace Webentor\Core\View\Components;

use Roots\Acorn\View\Component;

/**
 * Slider component for displaying a swiper slider
 */
class Slider extends Component
{
    public string $classes;
    public array $params;

    /**
     * Create a new component instance.
     *
     * @param string $classes Additional CSS classes
     * @param array  $params  Swiper parameters
     */
    public function __construct(
        string $classes = '',
        array $params = []
    ) {
        $this->classes = $classes;
        $this->params = $params;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return $this->view('slider.slider');
    }
}
