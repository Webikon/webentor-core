@php
  /**
   * Webentor Layout - Section
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param string $custom_classes Custom container classes (includes flexbox, grid, and filtered container class).
   * @param WP_Block $block WP_Block instance.
   **/

  $img_id = $attributes['img']['id'] ?? null;
  $img_id_mobile = $attributes['mobileImg']['id'] ?? $img_id;

  $video_id = $attributes['video']['id'] ?? null;
  $video_url = $video_id ? wp_get_attachment_url($video_id) : null;
  $video_mime = $video_id ? get_post_mime_type($video_id) : null;

  // Section background image is eager by default (usually the LCP element).
  $lazyload_image = !empty($attributes['lazyloadImage']);
  // Video toggles default to true (perf-friendly) when the attribute is absent.
  $lazyload_video = !isset($attributes['lazyloadVideo']) || $attributes['lazyloadVideo'];
  $disable_video_mobile = !isset($attributes['disableVideoOnMobile']) || $attributes['disableVideoOnMobile'];

  $overlay = $attributes['overlay'] ?? null;
  $has_overlay = !empty($overlay['enabled']);
  $overlay_opacity = isset($overlay['opacity']) ? (int) $overlay['opacity'] : 20;
  $overlay_color = $overlay['color'] ?? '#000000';

  $default_img_height =
      $attributes['imgSize']['height']['basic'] ?? apply_filters('webentor/l-section/default_img_height', 300);

  $crop_basic = $attributes['imgSize']['crop']['basic'] ?? apply_filters('webentor/l-section/default_img_crop', true);
  $crop_sm = isset($attributes['imgSize']['crop']['sm']) ? $attributes['imgSize']['crop']['sm'] : $crop_basic;
  $crop_md = isset($attributes['imgSize']['crop']['md']) ? $attributes['imgSize']['crop']['md'] : $crop_basic;
  $crop_lg = isset($attributes['imgSize']['crop']['lg']) ? $attributes['imgSize']['crop']['lg'] : $crop_basic;
  $crop_xl = isset($attributes['imgSize']['crop']['xl']) ? $attributes['imgSize']['crop']['xl'] : $crop_basic;
  $crop_2xl = isset($attributes['imgSize']['crop']['2xl']) ? $attributes['imgSize']['crop']['2xl'] : $crop_basic;

  $height_basic = (int) (!empty($attributes['imgSize']['height']['basic'])
      ? $attributes['imgSize']['height']['basic']
      : $default_img_height);
  $height_sm = (int) (!empty($attributes['imgSize']['height']['sm'])
      ? $attributes['imgSize']['height']['sm']
      : $default_img_height);
  $height_md = (int) (!empty($attributes['imgSize']['height']['md'])
      ? $attributes['imgSize']['height']['md']
      : $default_img_height);
  $height_lg = (int) (!empty($attributes['imgSize']['height']['lg'])
      ? $attributes['imgSize']['height']['lg']
      : $default_img_height);
  $height_xl = (int) (!empty($attributes['imgSize']['height']['xl'])
      ? $attributes['imgSize']['height']['xl']
      : $default_img_height);
  $height_2xl = (int) (!empty($attributes['imgSize']['height']['2xl'])
      ? $attributes['imgSize']['height']['2xl']
      : $default_img_height);
@endphp

<section
  {!! $anchor !!}
  class="w-section {{ !empty($img_id) || !empty($video_url) ? 'w-section--has-bg-img wbtr:overflow-hidden' : '' }} {{ $has_overlay ? 'w-section--has-overlay' : '' }} wbtr:relative wbtr:flex {{ $block_classes }} {{ apply_filters('webentor/l-section/section_classes', '', $attributes, $block) }}"
>
  {!! apply_filters('webentor/l-section/inner_start', '', $attributes, $block) !!}

  @if ($has_overlay)
    {!! apply_filters(
        'webentor/l-section/overlay',
        '<div class="w-section-overlay" style="--w-section-overlay-color:' .
            esc_attr($overlay_color) .
            ';--w-section-overlay-opacity:' .
            esc_attr($overlay_opacity / 100) .
            '"></div>',
        $attributes,
        $block,
    ) !!}
  @endif

  @if (!empty($img_id))
    <picture>
      <source
        media="(max-width: 480px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id_mobile, [480, $height_sm], $crop_sm) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id_mobile, [960, $height_sm * 2], $crop_sm) !!} 2x"
      >
      <source
        media="(max-width: 768px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [768, $height_md], $crop_md) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [1536, $height_md * 2], $crop_md) !!} 2x"
      >
      <source
        media="(max-width: 1024px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [1024, $height_lg], $crop_lg) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [2048, $height_lg * 2], $crop_lg) !!} 2x"
      >
      <source
        media="(max-width: 1200px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [1200, $height_xl], $crop_xl) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [2400, $height_xl * 2], $crop_xl) !!} 2x"
      >
      <source
        media="(max-width: 1600px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [1600, $height_2xl], $crop_2xl) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [3200, $height_2xl * 2], $crop_2xl) !!} 2x"
      >
      <source
        media="(max-width: 1920px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [1920, $height_2xl], $crop_2xl) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [3200, $height_2xl * 2], $crop_2xl) !!} 2x"
      >
      <source
        media="(max-width: 9999px)"
        srcset="{!! \Webentor\Core\get_resized_image_url($img_id, [2560, $height_basic], $crop_basic) !!} 1x, {!! \Webentor\Core\get_resized_image_url($img_id, [5120, $height_basic * 2], $crop_basic) !!} 2x"
      >

      <img
        src="{!! \Webentor\Core\get_resized_image_url($img_id, [1920, $height_basic], $crop_basic) !!}"
        alt="{!! \Webentor\Core\get_image_alt($img_id) !!}"
        loading="{{ $lazyload_image ? 'lazy' : 'eager' }}"
        class="w-section-img wbtr:absolute wbtr:inset-0 wbtr:h-full wbtr:w-full wbtr:object-cover"
      >
    </picture>
  @endif

  @if (!empty($video_url))
    <video
      class="w-section-video w-section-img wbtr:absolute wbtr:inset-0 wbtr:h-full wbtr:w-full wbtr:object-cover {{ $disable_video_mobile ? 'wbtr:hidden wbtr:sm:block' : '' }}"
      autoplay
      muted
      loop
      playsinline
      preload="none"
      data-webentor-video
      @if ($lazyload_video) data-lazyload="1" @endif
      @if ($disable_video_mobile) data-disable-mobile="1" @endif
    >
      <source
        data-src="{{ esc_url($video_url) }}"
        type="{{ esc_attr($video_mime) }}"
      >
    </video>
  @endif

  <div class="w-section-inner wbtr:flex wbtr:flex-col wbtr:relative {{ $custom_classes }}">
    {!! $innerBlocksContent ?? '' !!}
  </div>
</section>
