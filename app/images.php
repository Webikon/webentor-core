<?php

namespace Webentor\Core;

/**
 * Wrapper for Cloudinary image resizing function for whole <picture> element.
 * For crop modes see https://cloudinary.com/documentation/resizing_and_cropping#resize_and_crop_modes.
 * You can also use null instead of width or height integer to keep aspect ratio.
 *
 * @param string       $url
 * @param array|string $default_size E.g. [1024, 500, 'fill'] (width, height, crop) or 'full'
 * @param array        $sizes        Sizes for <picture>. E.g. [480 => [520, 500, 'fill'], 768 => [620, 500, 'fill']].
 * @param array        $attr         Additional <img> tag attributes
 * @param array        $options      Cloudinary options, e.g. for gravity to face: ['g' => 'face']
 *
 * @return string <picture> html
 */
function get_resized_cloud_picture_by_url(string $url, array|string $default_size, array $sizes = [], array $attr = [], array $options = []): string
{
    // Turn on retina by default
    $attr['retina'] = $attr['retina'] ?? true;

    // Handle also WP image size string (e.g. 'full')
    if (is_string($default_size)) {
        $default_size = [0, 0];
    }

    $html = '<picture>';
    if (is_array($sizes)) {
        ksort($sizes);
        foreach ($sizes as $breakpoint => $data) {
            if (intval($breakpoint) && count($data) >= 1) {
                $width = $data[0] ?? null;
                $height = $data[1] ?? null;
                $retina_width = $width * 2;
                $retina_height = $height * 2;
                $crop = isset($data[2]) && is_string($data[2]) ? $data[2] : 'auto'; // When crop is set as boolean it will default to 'auto'
                $img = get_resized_cloud_image_url_by_url($url, [$data[0], $data[1]], $crop, $options);

                if (isset($attr['retina']) && $attr['retina']) {
                    $img_retina = get_resized_cloud_image_url_by_url($url, [$retina_width, $retina_height], $crop, $options);
                    $srcset = $img . ' 1x, ' . $img_retina . ' 2x';
                } else {
                    $srcset = $img;
                }
                $html .= '<source media="(max-width:' . intval($breakpoint) . 'px)" srcset="' . $srcset . '">';
            }
        }
    }

    $default_width = $default_size[0] ?? null;
    $default_height = $default_size[1] ?? null;
    $default_crop = isset($default_size[2]) && is_string($default_size[2]) ? $default_size[2] : 'auto'; // When crop is set as boolean it will default to 'auto'

    $html .= get_resized_cloud_image_by_url($url, [$default_width, $default_height], $default_crop, $attr, $options);
    $html .= '</picture>';

    return $html;
}

/**
 * Wrapper for Cloudinary image resizing function for whole <picture> element by attachment ID.
 *
 * @param int          $attachment_id
 * @param array|string $default_size
 * @param array        $sizes
 * @param array        $attr
 * @param array        $options
 *
 * @return string <picture> html
 */
function get_resized_cloud_picture(int $attachment_id, array|string $default_size, array $sizes = [], array $attr = [], array $options = [])
{
    $url = wp_get_attachment_image_url($attachment_id, 'full');

    if (empty($url)) {
        return '';
    }

    // Handle also WP image size string (e.g. 'full')
    if (is_string($default_size)) {
        $default_size = [0, 0];
    }

    return get_resized_cloud_picture_by_url($url, $default_size, $sizes, $attr, $options);
}

/**
 * Wrapper for Cloudinary image resizing function for whole <img> element.
 * For crop modes see https://cloudinary.com/documentation/resizing_and_cropping#resize_and_crop_modes.
 * You can also use null instead of width or height integer to keep aspect ratio.
 *
 * @param string $url
 * @param array  $size    E.g. [1024, 500]
 * @param bool   $crop    See https://cloudinary.com/documentation/resizing_and_cropping#resize_and_crop_modes
 * @param array  $attr    Additional <img> tag attributes
 * @param mixed  $options Cloudinary options, e.g. for gravity to face: ['g' => 'face']
 *
 * @return string <picture> html
 */
function get_resized_cloud_image_by_url(string $url, array $size, $crop = 'fill', $attr = [], $options = []): string
{
    // Turn on retina by default
    $attr['retina'] = $attr['retina'] ?? true;

    $html = '';
    $width = $size[0] ?? null;
    $height = $size[1] ?? null;
    $retina_width = $width * 2;
    $retina_height = $height * 2;
    $hwstring   = image_hwstring($width, $height);

    $default_attr = [
        'src'   => get_resized_cloud_image_url_by_url($url, $size, $crop, $options),
        'class' => 'cloud-img',
        'retina' => true,
    ];

    if (wp_lazy_loading_enabled('img', 'wp_get_attachment_image')) {
        $default_attr['loading'] = 'lazy';
    }


    // Join default classes with custom classes if exist
    if (!empty($attr['class'])) {
        $attr['class'] = $default_attr['class'] . ' ' . $attr['class'];
    }

    $attr = wp_parse_args($attr, $default_attr);

    // Omit the `decoding` attribute if the value is invalid according to the spec.
    if (empty($attr['decoding']) || ! in_array($attr['decoding'], [ 'async', 'sync', 'auto' ], true)) {
        unset($attr['decoding']);
    }

    if ($attr['retina']) {
        $retina_size = [$retina_width, $retina_height];
        $attr['srcset'] = get_resized_cloud_image_url_by_url($url, $retina_size, $crop, $options) . ' 2x';
    }

    $attr = array_map('esc_attr', $attr);
    $html = rtrim("<img $hwstring");

    foreach ($attr as $name => $value) {
        $html .= " $name=" . '"' . $value . '"';
    }

    $html .= ' />';

    return $html;
}

/**
 * Wrapper for Cloudinary image resizing function for whole <img> element by attachment ID.
 *
 * @param int    $attachment_id
 * @param array  $size
 * @param string $crop
 * @param array  $attr
 * @param array  $options
 *
 * @return string
 */
function get_resized_cloud_image(int $attachment_id, array $size, $crop = 'fill', $attr = [], $options = [])
{
    $url = wp_get_attachment_image_url($attachment_id, 'full');

    if (empty($url)) {
        return '';
    }

    return get_resized_cloud_image_by_url($url, $size, $crop, $attr, $options);
}

/**
 * Wrapper for Cloudinary fetch url
 *
 * @param string $url
 * @param array  $size    [width, height]
 * @param string $crop
 * @param array  $options E.g. ['g' => 'face'] for gravity to face
 *
 * @return string
 */
function get_resized_cloud_image_url_by_url($url, $size, $crop = 'fill', $options = [])
{
    return CloudinaryClient::getCloudinaryFetchUrl($url, $size, $crop, $options);
}

/**
 * Wrapper for Cloudinary fetch url by attachment ID.
 *
 * @param int    $attachment_id
 * @param array  $size
 * @param string $crop
 * @param array  $options
 *
 * @return string
 */
function get_resized_cloud_image_url($attachment_id, $size, $crop = 'fill', $options = [])
{
    $url = wp_get_attachment_image_url($attachment_id, 'full');

    if (empty($url)) {
        return '';
    }

    return CloudinaryClient::getCloudinaryFetchUrl($url, $size, $crop, $options);
}

/**
 * Wrapper for image resizing function to get image URL.
 * Docs: https://wordpress.org/plugins/better-image-sizes/#description
 *
 * @param mixed        $attachment_id
 * @param array|string $size
 * @param mixed        $crop
 *
 * @return string Img URL
 */
function get_resized_image_url(int $attachment_id, array|string $size, bool $crop = false): string
{
    // Fallback or check if $size is string (it means size should be already generated)
    if (!function_exists('bis_get_attachment_image_src') || is_string($size)) {
        return wp_get_attachment_image_url($attachment_id, $size);
    }

    $image = bis_get_attachment_image_src($attachment_id, $size, $crop);
    $image = !empty($image['src']) ? $image['src'] : '';

    if (!$image) {
        $image = wp_get_attachment_image_url($attachment_id, $size);
    }

    return $image;
}

/**
 * Wrapper for image resizing function for whole <img> element which returns array.
 * Docs: https://wordpress.org/plugins/better-image-sizes/#description
 *
 * @param int          $attachment_id
 * @param array|string $size          E.g. [1024, 500] or 'full'
 * @param bool         $crop
 * @param array        $attr
 *
 * @return array
 */
function get_resized_image_object(int $attachment_id, array|string $size, bool $crop = false, array $attr = [])
{
    // Fallback or check if $size is string (it means size should be already generated)
    if (!function_exists('bis_get_attachment_image') || is_string($size)) {
        $image = wp_get_attachment_image($attachment_id, $size, false, $attr);

        return [
            'src' => wp_get_attachment_image_url($attachment_id, $size),
            'alt' => get_image_alt($attachment_id),
            'html' => $image
        ];
    }

    $attr['retina'] = true;

    $image = bis_get_attachment_image($attachment_id, $size, $crop, $attr);

    if (empty($image)) {
        $image = wp_get_attachment_image($attachment_id, $size, false, $attr);
        $image = [
            'src' => wp_get_attachment_image_url($attachment_id, $size),
            'alt' => get_image_alt($attachment_id),
            'html' => $image
        ];
    } else {
        $resized_img = bis_get_attachment_image_src($attachment_id, $size);
        $image = [
            'src' => $resized_img['src'] ?? "",
            'alt' => get_image_alt($attachment_id),
            'html' => $image
        ];
    }

    return $image;
}

/**
 * Wrapper for image resizing function for whole <img> element.
 *
 * @param int          $attachment_id
 * @param array|string $size          E.g. [1024, 500] or 'full'
 * @param bool         $crop
 * @param array        $attr
 */
function get_resized_image(int $attachment_id, array|string $size, bool $crop = false, array $attr = []): string
{
    $image = get_resized_image_object($attachment_id, $size, $crop, $attr);

    // Build <img> tag
    if (empty($image['src'])) {
        return '';
    }

    return $image['html'];
}

/**
 * Wrapper for image resizing function for whole <picture> element.
 * Docs: https://wordpress.org/plugins/better-image-sizes/#description
 *
 * @param int          $attachment_id
 * @param array|string $default_size  E.g. [1024, 500, true]
 * @param array        $sizes         E.g. [480 => [520, 500, true], 768 => [620, 500, true]]
 * @param array        $attr
 *
 * @return string <picture> html
 */
function get_resized_picture(int $attachment_id, array|string $default_size, array $sizes = [], array $attr = []): string
{
    if (!function_exists('bis_get_attachment_picture')) {
        // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_trigger_error
        wp_trigger_error(__FUNCTION__, 'Missing Better Image Sizes (BIS) plugin. get_resized_picture() requires this plugin.', E_USER_WARNING);

        return '';
    }

    // Always turn on retina
    $attr['retina'] = true;

    // Highly inspired by bis_get_attachment_picture()
    if ($attachment_id < 1) {
        return '';
    }
    $html = '<picture>';
    if (is_array($sizes)) {
        ksort($sizes);
        foreach ($sizes as $breakpoint => $data) {
            if (intval($breakpoint) && count($data) >= 2) {
                $maybe_alternative_attachment_id = isset($data[3]) && $data[3] ? $data[3] : $attachment_id;
                $img = get_resized_image_object($maybe_alternative_attachment_id, [$data[0], $data[1]], isset($data[2]) ? $data[2] : false, $attr);

                if ($img) {
                    if (isset($attr['retina']) && $attr['retina']) {
                        $retina = get_resized_image_object($maybe_alternative_attachment_id, [$data[0] * 2, $data[1] * 2], isset($data[2]) ? $data[2] : false, $attr);
                        $srcset = $img['src'] . ' 1x, ' . $retina['src'] . ' 2x';
                    } else {
                        $srcset = $img['src'];
                    }
                    $html .= '<source media="(max-width:' . intval($breakpoint) . 'px)" srcset="' . $srcset . '">';
                }
            }
        }
    }
    $html .= get_resized_image($attachment_id, is_array($default_size) ? [$default_size[0], $default_size[1]] : $default_size, isset($default_size[2]) ? $default_size[2] : false, $attr);
    $html .= '</picture>';

    return $html;
}

/**
 * Get image object with src, width, height and alt attributes.
 *
 * @param int    $attachment_id
 * @param string $size
 *
 * @return bool|array
 */
function get_image_object(int $attachment_id, string $size): bool|array
{
    $image = wp_get_attachment_image_src($attachment_id, $size);

    if (!$image) {
        return false;
    }

    return [
        'src' => $image[0],
        'width' => $image[1],
        'height' => $image[2],
        'alt' => get_image_alt($attachment_id)
    ];
}

/**
 * Get image alt attribute
 *
 * @param int $attachment_id
 *
 * @return string Img ALT
 */
function get_image_alt(int $attachment_id): string
{
    return get_post_meta($attachment_id, '_wp_attachment_image_alt', true);
}

/**
 * Enable SVG support in media uploads.
 */
add_filter('upload_mimes', function ($mimes) {
    $mimes['svg'] = 'image/svg+xml';

    return $mimes;
});

/**
 * Validate SVG files during upload.
 */
add_filter('wp_check_filetype_and_ext', function ($data, $file, $filename, $mimes) {
    $filetype = wp_check_filetype($filename, $mimes);

    return [
        'ext' => $filetype['ext'],
        'type' => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
}, 10, 4);

/**
 * Helper function to modify SVG attributes.
 *
 * @param  int         $attachment_id Attachment ID.
 * @param  int|null    $width         Width value.
 * @param  int|null    $height        Height value.
 * @param  string|null $class         Class attribute value.
 * @return string      Modified SVG content.
 */
function modify_svg_attributes($attachment_id, $width, $height, $class)
{
    $svg_file = get_attached_file($attachment_id ?? '');

    if (!file_exists($svg_file)) {
        return '';
    }

    $svg_content = @file_get_contents($svg_file);

    $svg_pattern = '/<svg[^>]*>/';

    preg_match($svg_pattern, $svg_content, $matches);
    if (empty($matches)) {
        return $svg_content;
    }

    $svg_tag = $matches[0];

    // Check and replace width attribute
    if ($width !== null && $width !== '0') {
        $svg_tag = preg_replace('/width="[^"]*"/', 'width="' . $width . '"', $svg_tag);
    } else {
        $svg_tag = preg_replace('/\s?width="[^"]*"/', '', $svg_tag);
    }

    // Check and replace height attribute
    if ($height !== null && $height !== '0') {
        $svg_tag = preg_replace('/height="[^"]*"/', 'height="' . $height . '"', $svg_tag);
    } else {
        $svg_tag = preg_replace('/\s?height="[^"]*"/', '', $svg_tag);
    }

    if (!strpos($matches[0], 'width') && $width !== null && $width !== '0') {
        $svg_tag = rtrim($svg_tag, '>') . ' width="' . $width . '">';
    }
    if (!strpos($matches[0], 'height') && $height !== null && $height !== '0') {
        $svg_tag = rtrim($svg_tag, '>') . ' height="' . $height . '">';
    }

    // Add class attribute to SVG tag
    if ($class !== null) {
        $svg_tag = rtrim($svg_tag, '>') . ' class="' . $class . '">';
    }

    $svg_content = str_replace($matches[0], $svg_tag, $svg_content);

    return $svg_content;
}

/**
 * Add width and height attributes if missing to prevent WooCommerce throwing errors.
 */
add_filter('wp_get_attachment_metadata', function ($data, $attachment_id) {
    $data['width'] = !empty($data['width']) ? $data['width'] : 0;
    $data['height'] = !empty($data['height']) ? $data['height'] : 0;

    return $data;
}, 10, 2);
