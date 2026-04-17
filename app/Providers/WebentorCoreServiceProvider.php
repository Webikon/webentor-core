<?php

namespace Webentor\Core\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Webentor\Core\View\Components\Button;
use Webentor\Core\View\Components\Slider;
use Webentor\Core\View\Directives\EnqueueScriptsBladeDirective;
use Webentor\Core\View\Directives\SliderContentBladeDirective;
use Webentor\Core\View\Directives\XDebugBladeDirective;

class WebentorCoreServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Register Blade directives
        Blade::directive('sliderContent', new SliderContentBladeDirective());
        Blade::directive('enqueueScripts', new EnqueueScriptsBladeDirective());
        Blade::directive('xdebugBreak', new XDebugBladeDirective());

        // Register View Components — namespaced access via <x-webentor::button>
        Blade::componentNamespace('Webentor\\Core\\View\\Components', 'webentor');

        // Register root aliases (<x-button>, <x-slider>) only when the theme
        // doesn't provide its own override. Themes can extend core components
        // by creating App\View\Components\Button etc. — Blade auto-discovers
        // those from the theme namespace without any alias collision.
        if (!class_exists(\App\View\Components\Button::class)) {
            Blade::component('button', Button::class);
        }
        if (!class_exists(\App\View\Components\Slider::class)) {
            Blade::component('slider', Slider::class);
        }

        // Load core block data files (View Composers + class split filters)
        $core_data_files = glob(WEBENTOR_CORE_PHP_PATH . '/resources/blocks/**/data.php');
        foreach ($core_data_files as $filename) {
            require_once $filename;
        }
    }
}
