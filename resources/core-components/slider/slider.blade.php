{{--
  $id - unique ID for element, will be generated if empty
  $show_arrows - Boolean (true/false) determining if the slider should display navigation arrows
  $arrows_inside - Boolean (true/false) determining if the arrows should be inside the slider
  $show_pagination - Boolean (true/false) determining if the slider should show pagination
  $pagination_inside - Boolean (true/false) determining if the pagination should be inside the slider
  $space_between - Space between slides (in pixels)
  $slides_per_view - Number of slides per view
  $slider_breakpoints - Object with breakpoints for the slider
  $autoplay - Boolean (true/false) determining if the slider should autoplay
  $autoplay_speed - Speed (in milliseconds) for the autoplay functionality
  $slider_content - HTML content for the slider; if empty, Gutenberg InnerBlocks will be used
  $classes - Additional CSS classes to be applied to the slider container.

  Usage:
  @include('slider.slider', ['id' => $block['id'], 'autoplay' => $acf_data['autoplay'], 'autoplay_speed' => $acf_data['autoplay_speed'] ?? '', 'show_arrows' => $acf_data['show_arrows'], 'show_pagination' => $acf_data['show_pagination'], 'slider_content' => $content, 'classes' => $block_classes])

  --}}

@php
  $slider_id = $slider_id ?: uniqid();

  $swiper_params = [
      'loop' => $loop ?? true,
  ];
  if (!empty($space_between)) {
      $swiper_params['spaceBetween'] = $space_between;
  }
  if (!empty($slides_per_view)) {
      $swiper_params['slidesPerView'] = $slides_per_view;
  }
  if (!empty($centered_slides)) {
      $swiper_params['centeredSlides'] = $centered_slides;
  }
  if (!empty($autoplay)) {
      $swiper_params['autoplay'] = ['delay' => (int) $autoplay_speed];
  }
  if (!empty($show_pagination)) {
      $swiper_params['pagination'] = [
          'el' => '.js-slider-pagination-' . $slider_id,
          'bulletActiveClass' => 'is-active',
          'bulletClass' => 'slider-pagination-bullet',
          'clickable' => true,
      ];
  }
  $swiper_params['breakpoints'] = $slider_breakpoints;

  $swiper_params['autoplayControl'] = $show_autoplay_control;

  /**
   * Ability to filter slider params
   *
   * @param array $swiper_params Slider params
   * @param string $slider_id Slider ID
   * @return array
   */
  $swiper_params = apply_filters('webentor/slider/view/swiper_params', $swiper_params, $slider_id);
@endphp

<div
  id="{{ $slider_id }}"
  data-slider="{{ json_encode($swiper_params) }}"
  class="js-slider slider {{ $dark_mode ? 'has-darkmode' : 'has-lightmode' }} {{ $show_autoplay_control ? 'has-autoplay-control' : '' }} wbtr:group wbtr:max-w-full wbtr:overflow-hidden"
>
  <div class="slider-inner wbtr:relative wbtr:flex wbtr:flex-col">
    <div class="slider-inner-body wbtr:relative wbtr:flex wbtr:w-full">

      @if (!empty($show_arrows))
        <div
          class="slider-arrows slider-arrows--prev {{ !empty($arrows_inside) ? 'slider-arrows--inside wbtr:absolute wbtr:left-3 wbtr:z-10 wbtr:-translate-y-1/2 wbtr:top-1/2 wbtr:hidden wbtr:items-center wbtr:justify-center wbtr:group-[.slider-enabled]:flex' : 'slider-arrows--outside flex items-center' }}"
        >
          <button class="slider-arrow-btn js-slider-button-prev wbtr:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M11.5 1L4.5 8L11.5 15"
                stroke-linecap="square"
                stroke="currentColor"
                stroke-miterlimit="10"
              />
            </svg>
          </button>
        </div>
      @endif

      <div class="slider-swiper-container-wrapper wbtr:relative wbtr:w-full wbtr:min-w-0 wbtr:overflow-hidden">
        <div class="slider-swiper-container swiper-container js-swiper-container">
          <div class="slider-swiper-wrapper swiper-wrapper js-slider-wrapper {{ $classes ?? '' }}">
            @sliderContent($slider_content)
          </div>
        </div>
      </div>

      @if (!empty($show_arrows))
        <div
          class="slider-arrows slider-arrows--next {{ !empty($arrows_inside) ? 'slider-arrows--inside wbtr:absolute wbtr:right-3 wbtr:z-10 wbtr:-translate-y-1/2 wbtr:top-1/2 wbtr:hidden wbtr:items-center wbtr:justify-center wbtr:group-[.slider-enabled]:flex' : 'slider-arrows--outside flex items-center' }}"
        >
          <button class="slider-arrow-btn js-slider-button-next wbtr:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4.5 1L11.5 8L4.5 15"
                stroke="currentColor"
                stroke-miterlimit="10"
                stroke-linecap="square"
              />
            </svg>
          </button>
        </div>
      @endif
    </div>

    @if (!empty($show_pagination))
      <div
        class="slider-pagination {{ $pagination_inside ? 'slider-pagination--inside wbtr:absolute wbtr:bottom-0 wbtr:z-10 wbtr:mb-3' : 'slider-pagination--outside' }} wbtr:mt-5 wbtr:hidden wbtr:w-full wbtr:items-center wbtr:justify-center wbtr:gap-2 wbtr:group-[.slider-enabled]:flex"
      >
        <div
          class="slider-pagination-items js-slider-pagination js-slider-pagination-{{ $slider_id }} wbtr:items-center wbtr:justify-center wbtr:gap-2"
        ></div>

        @if (!empty($show_autoplay_control))
          <button class="slider-autoplay-btn js-autoplay-btn wbtr:opacity-80">
            <span class="slider-autoplay-icon slider-autoplay-icon--play">
              @svg('images.svg.play', 'size-5')
            </span>
            <span class="slider-autoplay-icon slider-autoplay-icon--stop">
              @svg('images.svg.stop', 'size-5')
            </span>
          </button>
        @endif

      </div>
    @endif

    @if (!empty($show_autoplay_control))
      <div
        class="slider-timer wbtr:absolute wbtr:bottom-10 wbtr:right-3 wbtr:z-10 wbtr:h-12 wbtr:w-12 sm:wbtr:bottom-3">
        <svg
          viewBox="0 0 48 48"
          class="slider-timer-circle js-slider-timer-circle"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
          ></circle>
        </svg>

        <span
          class="slider-timer-seconds js-slider-timer-seconds wbtr:absolute wbtr:inset-0 wbtr:flex wbtr:items-center wbtr:justify-center"
        ></span>
      </div>
    @endif
  </div>
</div>
