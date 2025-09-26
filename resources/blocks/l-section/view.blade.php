@php
  /**
   * Webentor Layout - Section
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  $img_id = $attributes['img']['id'] ?? null;
  $img_id_mobile = $attributes['mobileImg']['id'] ?? $img_id;

  $default_img_height = apply_filters('webentor/l-section/default_img_height', 300);

  $height_basic = $attributes['imgSize']['height']['basic'] ?? $default_img_height;
  $height_sm = $attributes['imgSize']['height']['sm'] ?? $default_img_height;
  $height_md = $attributes['imgSize']['height']['md'] ?? $default_img_height;
  $height_lg = $attributes['imgSize']['height']['lg'] ?? $default_img_height;
  $height_xl = $attributes['imgSize']['height']['xl'] ?? $default_img_height;
  $height_2xl = $attributes['imgSize']['height']['2xl'] ?? $default_img_height;
@endphp

<section
  {!! $anchor !!}
  class="w-section wbtr:relative wbtr:flex {{ !empty($img_id) ? 'wbtr:overflow-hidden' : '' }} {{ $block_classes }} "
>
  @if (!empty($img_id))
    <picture>
      <source
        media="(max-width: 480px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id_mobile, [480, $height_sm]) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id_mobile, [960, $height_sm * 2]) !!} 2x"
      >
      <source
        media="(max-width: 768px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [768, $height_md]) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [1536, $height_md * 2]) !!} 2x"
      >
      <source
        media="(max-width: 1024px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [1024, $height_lg]) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [2048, $height_lg * 2]) !!} 2x"
      >
      <source
        media="(max-width: 1200px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [1200, $height_xl]) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [2400, $height_xl * 2]) !!} 2x"
      >
      <source
        media="(max-width: 1600px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [1600, $height_2xl]) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [3200, $height_2xl * 2]) !!} 2x"
      >
      <source
        media="(max-width: 9999px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [2560, $height_basic]) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [5120, $height_basic * 2]) !!} 2x"
      >

      <img
        src="{!! \Webentor\Core\get_resized_image_url($img_id, [1920, $height_basic]) !!}"
        alt="{!! \Webentor\Core\get_image_alt($img_id) !!}"
        class="w-section-img wbtr:absolute wbtr:inset-0 wbtr:h-full wbtr:w-full wbtr:object-cover"
      >
    </picture>
  @endif

  <div class="w-section-inner container wbtr:flex wbtr:flex-col wbtr:relative wbtr:z-[2] {{ $custom_classes }}">
    {!! $innerBlocksContent ?? '' !!}
  </div>
</section>
