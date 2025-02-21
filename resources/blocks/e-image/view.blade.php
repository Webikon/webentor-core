@php
  /**
   * Webentor Element - Image
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  // Make sure we have defaults
  $wp_size = 'full';
  $wp_size = !empty($attributes['imageSize']) && $attributes['imageSize'] !== '' ? $attributes['imageSize'] : $wp_size;

  $block_classes = $block_classes . ' wbtr:block';
  // Make image full width
  $block_classes =
      !empty($attributes['fullWidth']) && $attributes['fullWidth'] ? $block_classes . ' wbtr:w-full' : $block_classes;

  // Make image full rounded
  $block_classes =
      !empty($attributes['rounded']) && $attributes['rounded'] ? $block_classes . ' wbtr:rounded-full' : $block_classes;

  if (!empty($attributes['objectFit'])) {
      $block_classes .= " wbtr:object-{$attributes['objectFit']}";
  }

  if (!empty($attributes['objectPosition'])) {
      $block_classes .= " wbtr:object-{$attributes['objectPosition']}";
  }

  // Enable border
  $block_classes =
      !empty($attributes['border']) && $attributes['border']
          ? $block_classes . ' wbtr:border-4 wbtr:border-solid wbtr:border-sred-600'
          : $block_classes;

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
@endphp

@if (!empty($attributes['imgId']))
  @notempty($attributes['caption'])
    <div class="wbtr:flex wbtr:flex-col wbtr:gap-2">
    @endnotempty

    @if ($img_link_url)
      <a
        href="{{ $img_link_url }}"
        target="{{ $img_link_target }}"
        title="{{ $img_link_title }}"
        class="{{ $img_link_class }}"
      >
    @endif

    @php
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

    @endphp

    {{-- Custom responsive image --}}
    @if (class_exists('\Webentor\Core\CloudinaryClient') && \Webentor\Core\CloudinaryClient::isCloudinaryEnabled())
      {!! \Webentor\Core\get_resized_cloud_picture(
          $attributes['imgId'],
          !empty($attributes['customSize']['enabled']['basic']) &&
          (!empty($attributes['customSize']['width']['basic']) || !empty($attributes['customSize']['height']['basic']))
              ? [
                  $attributes['customSize']['width']['basic'] ?? null,
                  $attributes['customSize']['height']['basic'] ?? null,
                  $attributes['customSize']['crop']['basic'] ?? false,
              ]
              : [],
          $sizes_array,
          $img_attr,
      ) !!}
    @else
      {!! \Webentor\Core\get_resized_picture(
          $attributes['imgId'],
          !empty($attributes['customSize']['enabled']['basic']) &&
          (!empty($attributes['customSize']['width']['basic']) || !empty($attributes['customSize']['height']['basic']))
              ? [
                  $attributes['customSize']['width']['basic'] ?? null,
                  $attributes['customSize']['height']['basic'] ?? null,
                  $attributes['customSize']['crop']['basic'] ?? false,
              ]
              : $wp_size,
          $sizes_array,
          $img_attr,
      ) !!}
    @endif

    @if ($img_link_url)
      </a>
    @endif

    @notempty($attributes['caption'])
      <div class="wbtr:text-14 wbtr:leading-125 wbtr:text-gray-200">{!! $attributes['caption'] !!}</div>
    </div>
  @endnotempty
@endif
