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
    public function register(): void
    {
        // WEBENTOR_CORE_PHP_PATH is normally defined by the consumer theme's
        // functions.php (it's also consumed by config/view.php, which runs
        // before providers register). Fallback to the package directory so
        // the provider still works in contexts where the consumer omitted it.
        if (!defined('WEBENTOR_CORE_PHP_PATH')) {
            define('WEBENTOR_CORE_PHP_PATH', dirname(__DIR__, 2));
        }

        if (!defined('WEBENTOR_CORE_PUBLIC_PATH')) {
            define('WEBENTOR_CORE_PUBLIC_PATH', WEBENTOR_CORE_PHP_PATH . '/public/build');
        }
        if (!defined('WEBENTOR_CORE_MANIFEST_PATH')) {
            define('WEBENTOR_CORE_MANIFEST_PATH', WEBENTOR_CORE_PUBLIC_PATH . '/manifest.json');
        }
        if (!defined('WEBENTOR_CORE_RESOURCES_PATH')) {
            define('WEBENTOR_CORE_RESOURCES_PATH', WEBENTOR_CORE_PHP_PATH . '/resources');
        }
        if (!defined('WEBENTOR_CORE_VITE_MANIFEST_DIR')) {
            define('WEBENTOR_CORE_VITE_MANIFEST_DIR', WEBENTOR_CORE_PHP_PATH . '/public/build');
        }
        if (!defined('WEBENTOR_CORE_RESOURCES_DIR')) {
            define('WEBENTOR_CORE_RESOURCES_DIR', WEBENTOR_CORE_PHP_PATH . '/resources');
        }

        if (file_exists($composer = WEBENTOR_CORE_PHP_PATH . '/vendor/autoload.php')) {
            require_once $composer;
        }
    }

    public function boot(): void
    {
        // Load core app bootstrap files (hook registrations, helpers, CLI).
        require_once WEBENTOR_CORE_PHP_PATH . '/app/acf.php';
        require_once WEBENTOR_CORE_PHP_PATH . '/app/blocks-init.php';
        require_once WEBENTOR_CORE_PHP_PATH . '/app/blocks-settings.php';
        require_once WEBENTOR_CORE_PHP_PATH . '/app/blocks-migration.php';
        require_once WEBENTOR_CORE_PHP_PATH . '/app/CloudinaryClient.php';
        require_once WEBENTOR_CORE_PHP_PATH . '/app/i18n.php';
        require_once WEBENTOR_CORE_PHP_PATH . '/app/images.php';
        require_once WEBENTOR_CORE_PHP_PATH . '/app/setup-core.php';
        require_once WEBENTOR_CORE_PHP_PATH . '/app/utils.php';

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
