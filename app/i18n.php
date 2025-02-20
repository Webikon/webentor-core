<?php

namespace Webentor\Core;

/**
 * Get current language from Multisite Languages Switcher
 *
 * @return string
 */
function get_msls_gurrent_lang()
{
    if (!class_exists('lloc\Msls\MslsOutput')) {
        return '';
    }

    $current_blog = \lloc\Msls\MslsBlogCollection::instance()->get_current_blog();
    if ($current_blog) {
        return $current_blog->get_description();
    }

    return '';
}

/**
 * Get list of languages from Multisite Languages Switcher
 *
 * @return array
 */
function get_msls_languages()
{
    if (!class_exists('lloc\Msls\MslsOutput')) {
        return [];
    }

    // Get languages excluding current one
    $array = \lloc\Msls\MslsOutput::init()->get(1, true);

    return $array;
}
