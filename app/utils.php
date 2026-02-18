<?php

namespace Webentor\Core;

/**
 * Retrieves the theme breakpoints from global settings.
 *
 * @return array The theme breakpoints.
 */
function get_theme_breakpoints()
{
    $global_settings = wp_get_global_settings();

    $breakpoints = $global_settings['custom']['breakpoints'] ?? [];

    // Remove "px" and cast to integer
    $breakpoints = array_map(function ($value) {
        return is_numeric($value) ? (int) $value : (int) str_replace('px', '', $value);
    }, $breakpoints);

    $breakpoints = ['basic' => 0] + $breakpoints;

    return $breakpoints;
}

/**
 * Get the next breakpoint name from the current breakpoint.
 *
 * @param  string      $currentBreakpoint The current breakpoint.
 * @return string|bool The next breakpoint or false if there is none.
 */
function get_next_breakpoint_name($currentBreakpoint)
{
    $breakpoints = get_theme_breakpoints();
    $breakpointKeys = array_keys($breakpoints);
    $currentBreakpointIndex = array_search($currentBreakpoint, $breakpointKeys, true);
    if ($currentBreakpointIndex === false) {
        return false;
    }
    $nextBreakpointIndex = $currentBreakpointIndex + 1;
    $nextBreakpoint = $breakpointKeys[$nextBreakpointIndex] ?? false;

    return $nextBreakpoint;
}

function get_next_breakpoint_names($currentBreakpoint)
{
    $breakpoints = get_theme_breakpoints();
    $breakpointKeys = array_keys($breakpoints);
    $currentBreakpointIndex = array_search($currentBreakpoint, $breakpointKeys, true);
    if ($currentBreakpointIndex === false) {
        return [];
    }
    $nextBreakpointKeys = array_slice($breakpointKeys, $currentBreakpointIndex + 1);

    return $nextBreakpointKeys;
}

/**
 * Get the theme display values for responsive classes.
 *
 * @return array The array of display values.
 */
function get_theme_display_values()
{
    return ['block', 'hidden', 'flex', 'grid', 'inline-block', 'inline'];
}

/**
 * Get current full url without query paramenters.
 */
function get_current_url()
{
    $home_parts = wp_parse_url(home_url());
    $protocol = $home_parts['scheme'] ?? 'https';
    $host = $home_parts['host'] ?? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'] ?? ''));
    $request_uri = isset($_SERVER['REQUEST_URI']) ? esc_url_raw(wp_unslash($_SERVER['REQUEST_URI'])) : '/';
    $current_url = strtok(untrailingslashit($request_uri), '?');
    $current_url = $protocol . '://' . $host . $current_url;

    return $current_url;
}

/**
 * Function to check if current url is equal to menu item url.
 *
 * @param string $url
 * @param string $current_url
 *
 * @return bool
 */
function is_current_menu_item($url, $current_url)
{
    $url = strtok(untrailingslashit($url), '?');
    if (is_single()) {
        if ($url !== home_url('/') && $url !== get_home_url() && strpos($current_url, $url) !== false) {
            return true;
        }
    }

    // Try to find current url in menu sub menus
    if ($url == $current_url) {
        return true;
    }

    return false;
}

/**
 * Removes the query key and value from the URL.
 *
 * @param  string       $key
 * @param  string|array $value
 * @param  string       $url
 * @return string
 */
function remove_query_arg_from_current_url($key, $value, $url = null)
{
    if ($url === null) {
        $home_parts = wp_parse_url(home_url());
        $protocol = $home_parts['scheme'] ?? 'https';
        $host = $home_parts['host'] ?? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'] ?? ''));
        $request_uri = isset($_SERVER['REQUEST_URI']) ? esc_url_raw(wp_unslash($_SERVER['REQUEST_URI'])) : '/';
        $url = $protocol . '://' . $host . $request_uri;
    }

    // Parse the URL into parts
    $parts = parse_url($url);

    if (empty($parts['query'])) {
        return $url;
    }

    // Parse the query string into an associative array
    $parsedQuery = [];
    parse_str($parts['query'], $parsedQuery);

    // Go through each query item
    foreach ($parsedQuery as $queryKey => $queryValue) {
        // If key matching and values in array - remove the value
        if ($queryKey === $key) {
            if (is_array($queryValue)) {
                foreach ($queryValue as $subKey => $subValue) {
                    if ($subValue == $value || (is_array($value) && in_array($subValue, $value))) {
                        unset($parsedQuery[$key][$subKey]);
                    }
                }
            } else {
                if ($queryValue == $value) {
                    unset($parsedQuery[$key]);
                }
            }
        }
    }

    // Rebuild the query string with the remaining elements
    $parts['query'] = http_build_query($parsedQuery);

    // Reconstruct the entire URL manually.
    $newUrl =
        (isset($parts['scheme']) ? "{$parts['scheme']}:" : '') .
        (isset($parts['user']) || isset($parts['host']) ? '//' : '') .
        (isset($parts['user']) ? "{$parts['user']}" : '') .
        (isset($parts['pass']) ? ":{$parts['pass']}" : '') .
        (isset($parts['user']) ? '@' : '') .
        (isset($parts['host']) ? "{$parts['host']}" : '') .
        (isset($parts['port']) ? ":{$parts['port']}" : '') .
        (isset($parts['path']) ? "{$parts['path']}" : '') .
        ($parts['query'] ? "?{$parts['query']}" : '') .
        (isset($parts['fragment']) ? "#{$parts['fragment']}" : '');

    return $newUrl;
}

function remove_query_args_from_current_url($args)
{
    $home_parts = wp_parse_url(home_url());
    $protocol = $home_parts['scheme'] ?? 'https';
    $host = $home_parts['host'] ?? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'] ?? ''));
    $request_uri = isset($_SERVER['REQUEST_URI']) ? esc_url_raw(wp_unslash($_SERVER['REQUEST_URI'])) : '/';
    $url = $protocol . '://' . $host . $request_uri;

    foreach ($args as $key => $value) {
        $url = remove_query_arg_from_current_url($key, $value, $url);
    }

    return $url;
}


/**
 * Get classes by property or nested property path
 *
 * @param array $classes_by_prop
 * @param string|array $property Property path, e.g. 'display' or ['display', 'height']
 * @return string
 */
function get_classes_by_property($classes_by_prop, $property)
{
    // Handle single property
    if (is_string($property)) {
        return extract_classes_recursively($classes_by_prop[$property] ?? '');
    }

    // Handle nested property path (array)
    if (is_array($property)) {
        $current = $classes_by_prop;

        // Navigate through the nested structure
        foreach ($property as $key) {
            if (isset($current[$key])) {
                $current = $current[$key];
            } else {
                return ''; // Property not found
            }
        }

        return extract_classes_recursively($current);
    }

    return '';
}

/**
 * Recursively extract classes from nested arrays
 *
 * @param mixed $data
 * @return string
 */
function extract_classes_recursively($data)
{
    $classes = '';

    if (is_string($data)) {
        $classes .= ' ' . $data;
    } elseif (is_array($data)) {
        foreach ($data as $value) {
            $classes .= ' ' . extract_classes_recursively($value);
        }
    }

    return trim($classes);
}
