<?php

// WEBENTOR_CORE_PHP_PATH should always be defined, but use this as a fallback
if (!defined('WEBENTOR_CORE_PHP_PATH')) {
    define('WEBENTOR_CORE_PHP_PATH', __DIR__);
}

define('WEBENTOR_CORE_PUBLIC_PATH', WEBENTOR_CORE_PHP_PATH . '/public/build');
define('WEBENTOR_CORE_MANIFEST_PATH', WEBENTOR_CORE_PUBLIC_PATH . '/manifest.json');
define('WEBENTOR_CORE_RESOURCES_PATH', WEBENTOR_CORE_PHP_PATH . '/resources');

define('WEBENTOR_CORE_VITE_MANIFEST_DIR', WEBENTOR_CORE_PHP_PATH . '/public/build');
define('WEBENTOR_CORE_RESOURCES_DIR', WEBENTOR_CORE_PHP_PATH . '/resources');

// Autoload composer dependencies
if (file_exists($composer = WEBENTOR_CORE_PHP_PATH . '/vendor/autoload.php')) {
    require $composer;
}


// Load core files
require_once WEBENTOR_CORE_PHP_PATH . '/app/acf.php';
require_once WEBENTOR_CORE_PHP_PATH . '/app/blocks-init.php';
require_once WEBENTOR_CORE_PHP_PATH . '/app/blocks-settings.php';
require_once WEBENTOR_CORE_PHP_PATH . '/app/blocks-migration.php';
require_once WEBENTOR_CORE_PHP_PATH . '/app/CloudinaryClient.php';
require_once WEBENTOR_CORE_PHP_PATH . '/app/i18n.php';
require_once WEBENTOR_CORE_PHP_PATH . '/app/images.php';
require_once WEBENTOR_CORE_PHP_PATH . '/app/setup-core.php';
require_once WEBENTOR_CORE_PHP_PATH . '/app/utils.php';
