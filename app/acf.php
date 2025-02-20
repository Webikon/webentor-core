<?php

namespace Webentor\Core;

/**
 * Disable CPTs and Taxonomies registration via ACF
 */
add_filter('acf/settings/enable_post_types', '__return_false');

/**
 * Hide ACF editation from admin menu as all is done in the code
 */
add_action('admin_init', function () {
    remove_submenu_page('edit.php?post_type=acf-field-group', 'edit.php?post_type=acf-field-group');
    remove_submenu_page('edit.php?post_type=acf-field-group', 'edit.php?post_type=acf-ui-options-page');
});
