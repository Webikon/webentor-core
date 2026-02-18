<?php

use Illuminate\Support\Facades;
use Illuminate\View\View;

/**
 * Pass data to the block.
 *
 * First argument is the current block view path.
 */
Facades\View::composer('e-image.view', function (View $view) {
    $data = $view->getData();
    $attributes = $data['attributes'];
    $block_classes = $data['block_classes'];

    if (empty($attributes['imgId'])) {
        return;
    }

    // Make sure we have defaults
    $wp_size = 'full';
    $wp_size = !empty($attributes['imageSize']) && $attributes['imageSize'] !== '' ? $attributes['imageSize'] : $wp_size;

    $block_classes = $block_classes . ' wbtr:block';
    // Make image full width
    $block_classes =
        !empty($attributes['fullWidth']) && $attributes['fullWidth'] ? $block_classes . ' wbtr:w-full' : $block_classes;

    if (!empty($attributes['aspectRatio'])) {
        $block_classes .= " aspect-{$attributes['aspectRatio']}";
    }

    if (!empty($attributes['objectFit'])) {
        $block_classes .= " object-{$attributes['objectFit']}";
    }

    if (!empty($attributes['objectPosition'])) {
        $block_classes .= " object-{$attributes['objectPosition']}";
    }

    $img_attr = [
        'class' => $block_classes,
        'loading' => isset($attributes['lazyload']) && $attributes['lazyload'] === false ? 'eager' : 'lazy', // Defaults to 'lazy'
    ];

    $img_link_url = null;
    $img_link_target = null;
    $img_link_title = null;
    $img_link_class = null;

    if (!empty($attributes['openInLightbox'])) {
        $img_link_url = !empty($attributes['imgId']) ? wp_get_attachment_image_url($attributes['imgId'], 'full') : null;
        $img_link_class = 'lightgallery';
    } elseif (!empty($attributes['link']['url'])) {
        $img_link_url = $attributes['link']['url'];
        $img_link_target = !empty($attributes['link']['opensInNewTab']) ? '_blank' : '_self';
        $img_link_title = $attributes['link']['title'] ?? '';
    }

    $sizes_array = [];

    if (!empty($attributes['customSize']['width']['sm']) || !empty($attributes['customSize']['height']['sm'])) {
        $sizes_array[480] = [
            $attributes['customSize']['width']['sm'] ?? null,
            $attributes['customSize']['height']['sm'] ?? null,
            $attributes['customSize']['crop']['sm'] ?? false,
        ];
    }

    if (!empty($attributes['customSize']['width']['md']) || !empty($attributes['customSize']['height']['md'])) {
        $sizes_array[768] = [
            $attributes['customSize']['width']['md'] ?? null,
            $attributes['customSize']['height']['md'] ?? null,
            $attributes['customSize']['crop']['md'] ?? false,
        ];
    }

    if (!empty($attributes['customSize']['width']['lg']) || !empty($attributes['customSize']['height']['lg'])) {
        $sizes_array[992] = [
            $attributes['customSize']['width']['lg'] ?? null,
            $attributes['customSize']['height']['lg'] ?? null,
            $attributes['customSize']['crop']['lg'] ?? false,
        ];
    }

    if (!empty($attributes['customSize']['width']['xl']) || !empty($attributes['customSize']['height']['xl'])) {
        $sizes_array[1200] = [
            $attributes['customSize']['width']['xl'] ?? null,
            $attributes['customSize']['height']['xl'] ?? null,
            $attributes['customSize']['crop']['xl'] ?? false,
        ];
    }

    $default_size = !empty($attributes['customSize']['enabled']['basic']) &&
        (!empty($attributes['customSize']['width']['basic']) || !empty($attributes['customSize']['height']['basic']))
        ? [
            $attributes['customSize']['width']['basic'] ?? null,
            $attributes['customSize']['height']['basic'] ?? null,
            $attributes['customSize']['crop']['basic'] ?? false,
        ]
        : $wp_size;

    $img = [
        'id' => $attributes['imgId'],
        'default_size' => $default_size,
        'sizes_array' => $sizes_array,
        'img_attr' => $img_attr,
    ];

    $view->with('block_classes', $block_classes);
    $view->with('img', $img);
    $view->with('img_link_url', $img_link_url);
    $view->with('img_link_target', $img_link_target);
    $view->with('img_link_title', $img_link_title);
    $view->with('img_link_class', $img_link_class);
});
