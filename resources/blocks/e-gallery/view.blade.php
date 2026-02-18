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
  @foreach ($images as $img)
    @if (!empty($img['img_link_url']))
      <a
        href="{{ $img['img_link_url'] }}"
        class="{{ $img['img_link_class'] }}"
      >
    @endif

    {{-- Custom responsive img --}}
    @if (class_exists('\Webentor\Core\CloudinaryClient') && \Webentor\Core\CloudinaryClient::isCloudinaryEnabled())
      {!! \Webentor\Core\get_resized_cloud_picture(
          $img['id'],
          $img['default_size'],
          $img['sizes_array'],
          $img['img_attr'],
      ) !!}
    @else
      {!! \Webentor\Core\get_resized_picture(
          $img['id'],
          $img['default_size'],
          $img['sizes_array'],
          $img['img_attr'],
      ) !!}
    @endif

    @if (!empty($img['img_link_url']))
      </a>
    @endif
  @endforeach
</div>
