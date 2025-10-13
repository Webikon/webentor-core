@php
  /**
   * Webentor Element - Slider
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  $breakpoints = \Webentor\Core\get_theme_breakpoints();
  $slider_breakpoints_data = [];
  $slides_per_view = $attributes['slider']['slidesPerView']['value']['basic'] ?? '';
  $space_between = $attributes['slider']['spaceBetween']['value']['basic'] ?? '';
  $centered_slides = $attributes['slider']['centeredSlides']['value']['basic'] ?? '';

  // Get responsive data, also skip basic as its handled above
  foreach ($breakpoints as $bp_key => $bp_value) {
      $slider_breakpoints_data[$bp_value]['enabled'] = $attributes['slider']['enabled']['value'][$bp_key] ?? true;

      if (!empty($attributes['slider']['slidesPerView']['value'][$bp_key])) {
          $slider_breakpoints_data[$bp_value]['slidesPerView'] =
              $attributes['slider']['slidesPerView']['value'][$bp_key] ?? '';
      }

      $slider_breakpoints_data[$bp_value]['centeredSlides'] =
          $attributes['slider']['centeredSlides']['value'][$bp_key] ?? '';

      if (!empty($attributes['slider']['spaceBetween']['value'][$bp_key])) {
          $slider_breakpoints_data[$bp_value]['spaceBetween'] =
              $attributes['slider']['spaceBetween']['value'][$bp_key] ?? '';
      }
  }
@endphp

@includeFirst(
    ['core-components.slider.slider', 'slider.slider'],
    [
        'autoplay' => $attributes['slider']['autoplay'] ?? false,
        'autoplay_speed' => $attributes['slider']['autoplaySpeed'] ?? 3000,
        'show_arrows' => $attributes['slider']['showArrows'] ?? false,
        'show_pagination' => $attributes['slider']['showPagination'] ?? false,
        'arrows_inside' => $attributes['slider']['arrowsInsideContainer'] ?? false,
        'pagination_inside' => $attributes['slider']['paginationInsideContainer'] ?? false,
        'dark_mode' => $attributes['slider']['darkMode'] ?? false,
        'show_autoplay_control' => $attributes['slider']['autoplayControl'] ?? false,
        'loop' => $attributes['slider']['loop'] ?? true,
        'slider_id' => $attributes['slider']['id'] ?? '',
        'slider_content' => $innerBlocksContent ?? '',
        'classes' => $block_classes,
        'slides_per_view' => $slides_per_view,
        'space_between' => $space_between,
        'centered_slides' => $centered_slides,
        'slider_breakpoints' => $slider_breakpoints_data,
    ]
)
