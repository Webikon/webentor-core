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
@endphp

@if (!empty($attributes['imgId']))
  @notempty($attributes['caption'])
    <div class="wbtr:flex wbtr:flex-col wbtr:gap-2">
    @endnotempty

    @if (!empty($img_link_url))
      <a
        href="{{ $img_link_url }}"
        target="{{ $img_link_target }}"
        title="{{ $img_link_title }}"
        class="{{ $img_link_class }}"
      >
    @endif

    {{-- Custom responsive image --}}
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

    @if (!empty($img_link_url))
      </a>
    @endif

    @notempty($attributes['caption'])
      <div class="wbtr:text-14 wbtr:leading-125 wbtr:text-gray-200">{!! $attributes['caption'] !!}</div>
    </div>
  @endnotempty
@endif
