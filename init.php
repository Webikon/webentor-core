<?php

define('WEBENTOR_CORE_PUBLIC_PATH', __DIR__ . '/public/build');
define('WEBENTOR_CORE_MANIFEST_PATH', WEBENTOR_CORE_PUBLIC_PATH . '/manifest.json');
define('WEBENTOR_CORE_RESOURCES_PATH', __DIR__ . '/resources');

define('WEBENTOR_CORE_VITE_MANIFEST_DIR', __DIR__ . '/public/build');
define('WEBENTOR_CORE_RESOURCES_DIR', __DIR__ . '/resources');

// Autoload composer dependencies
if (file_exists($composer = __DIR__ . '/vendor/autoload.php')) {
    require $composer;
}


// Load core files
require_once __DIR__ . '/app/acf.php';
require_once __DIR__ . '/app/blocks-init.php';
require_once __DIR__ . '/app/blocks-settings.php';
require_once __DIR__ . '/app/CloudinaryClient.php';
require_once __DIR__ . '/app/i18n.php';
require_once __DIR__ . '/app/images.php';
require_once __DIR__ . '/app/setup-core.php';
require_once __DIR__ . '/app/utils.php';
