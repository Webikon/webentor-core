<?php

namespace Webentor\Core;

class CloudinaryClient
{
    public static function isCloudinaryEnabled()
    {
        return defined('CLOUDINARY_CLOUD_NAME');
    }

    /**
     * Get Cloudinary fetch URL
     *
     * @param string $url
     * @param array  $size    [width, height]
     * @param string $crop
     * @param array  $options E.g. ['g' => 'face'] for gravity to face
     *
     * @return string
     */
    public static function getCloudinaryFetchUrl($url, $size, $crop = 'fill', $options = [])
    {
        if (!self::isCloudinaryEnabled()) {
            return $url;
        }

        // Fix for localhost URLs
        if (defined('WP_IMAGES_REWRITE_HOME') && WP_IMAGES_REWRITE_HOME && str_starts_with($url, \WP_HOME)) {
            $url = str_replace(\WP_HOME, \WP_IMAGES_REWRITE_HOME, $url);
        }

        $cloud_name = \CLOUDINARY_CLOUD_NAME;

        // Check if crop is valid Cloudinary value
        // See: https://cloudinary.com/documentation/resizing_and_cropping#resize_and_crop_modes
        $valid_crops = ['fill', 'lfill', 'crop', 'thumb', 'auto', 'scale', 'fit', 'limit', 'mfit', 'pad', 'lpad', 'mpad'];
        if (!in_array($crop, $valid_crops)) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_trigger_error
            wp_trigger_error(__FUNCTION__, "Invalid Cloudinary crop value: '{$crop}'. Falling back to 'fill'.", E_USER_WARNING);
            $crop = 'fill';
        }

        $default_args = [
            'c' => $crop,
            'f' => 'auto',
            'q' => 'auto:good',
        ];

        $args = array_merge($default_args, $options);

        if (!empty($size[0])) {
            $args['w'] = $size[0];
        }

        if (!empty($size[1])) {
            $args['h'] = $size[1];
        }

        // Convert to proper format, e.g 'w_100,h_100,c_fill'
        $args = array_map(function ($key, $value) {
            return "{$key}_{$value}";
        }, array_keys($args), $args);

        $args_string = join(',', $args);

        $fetch_url = "https://res.cloudinary.com/{$cloud_name}/image/fetch/{$args_string}/{$url}";

        return $fetch_url;
    }
}
