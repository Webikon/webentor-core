@php
  /**
   * Webentor Element - Gallery
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/
@endphp

<div class="{{ $block_classes }} w-gallery">
  @foreach ($images as $image)
    @if (!empty($image['img_link_url']))
      <a
        href="{{ $image['img_link_url'] }}"
        class="{{ $image['img_link_class'] }}"
      >
    @endif

    {{-- Custom responsive image --}}
    @if (class_exists('\Webentor\Core\CloudinaryClient') && \Webentor\Core\CloudinaryClient::isCloudinaryEnabled())
      {!! \Webentor\Core\get_resized_cloud_picture(
          $image['id'],
          $image['default_size'],
          $image['sizes_array'],
          $image['img_attr'],
      ) !!}
    @else
      {!! \Webentor\Core\get_resized_picture(
          $image['id'],
          $image['default_size'],
          $image['sizes_array'],
          $image['img_attr'],
      ) !!}
    @endif

    @if (!empty($image['img_link_url']))
      </a>
    @endif
  @endforeach
</div>
