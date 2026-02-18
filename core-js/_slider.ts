import { __ } from '@wordpress/i18n';
import Swiper from 'swiper/bundle';

import { debounce, throttle } from './_utils';

type BreakpointConfig = Swiper & {
  enabled: boolean;
};

class SliderComponent {
  private element: HTMLElement;
  private params: Swiper & {
    breakpoints: Record<string, BreakpointConfig>;
    autoplayControl: boolean;
  };
  private swiper: Swiper | null;
  private container: HTMLElement;
  private breakpoints: Record<string, BreakpointConfig> | null;
  private autoplayButton: HTMLElement | null;
  private timerSeconds: HTMLElement | null;
  private timerCircle: HTMLElement | null;
  private autoplayControlEnabled: boolean;
  private resizeHandler?: () => void;

  constructor(element, params) {
    this.element = element;
    this.params = params;
    this.swiper = null;
    this.container = element.querySelector('.js-swiper-container');
    this.breakpoints = null;

    const { breakpoints, autoplayControl } = this.params;
    this.breakpoints = breakpoints;

    this.autoplayButton = this.element.querySelector('.js-autoplay-btn');
    this.timerSeconds = this.element.querySelector('.js-slider-timer-seconds');
    this.timerCircle = this.element.querySelector('.js-slider-timer-circle');
    this.autoplayControlEnabled = autoplayControl;

    this.initSwiper();
    this.addResizeListener();
    this.addBreakpointChecker();
    this.breakpointChecker = this.breakpointChecker.bind(this);

    if (this.autoplayControlEnabled && this.autoplayButton) {
      this.autoplayButton.addEventListener('click', () =>
        this.toggleAutoplay(),
      );
    }
  }

  initSwiper() {
    this.breakpointChecker();
  }

  getSwiper() {
    return this.swiper;
  }

  addResizeListener() {
    this.resizeHandler = () => {
      this.breakpointChecker();
    };

    window.addEventListener('resize', debounce(this.resizeHandler, 300));
  }

  breakpointChecker() {
    const currentBreakpoint = this.getCurrentBreakpoint(window.innerWidth);

    if (currentBreakpoint && currentBreakpoint.enabled) {
      this.enableSwiper();
    } else {
      this.destroySwiper();
    }
  }

  addBreakpointChecker() {
    this.breakpointChecker();
  }

  enableSwiper() {
    if (this.swiper) {
      return;
    }

    this.element.classList.add('slider-enabled');

    // Find all direct child elements of ".js-slider-wrapper"
    const sliderWrapperChildren =
      this.element.querySelector('.js-slider-wrapper').children;

    // Add "swiper-slide" class to each child element
    for (const child of sliderWrapperChildren) {
      child.classList.add('swiper-slide');
    }

    // this.recalculateSlidesWidth();

    this.swiper = new Swiper(this.container, {
      ...this.params,
      on: {
        init: (swiper) => {
          this.fixInitialSlideCalculation(swiper);

          if (this.autoplayControlEnabled) {
            this.updateAutoplayButtonState(swiper);
          }
        },
        autoplayTimeLeft: (swiper, time, progress) => {
          if (this.autoplayControlEnabled) {
            this.timerCircle.style.setProperty(
              '--slider-timer-progress',
              1 - progress,
            );
            this.timerSeconds.textContent = `${Math.ceil(time / 1000)}s`;
          }
        },
        autoplayResume: (swiper) => {
          if (this.autoplayControlEnabled) {
            this.updateAutoplayButtonState(swiper);
          }
        },
        resize: throttle(this.fixInitialSlideCalculation, 100),
        ...this.params.on,
      },
      navigation: {
        nextEl: this.element.querySelector('.js-slider-button-next'),
        prevEl: this.element.querySelector('.js-slider-button-prev'),
      },
    });

    // Ensure that slidesPerGroupSkip is defined
    if (this.swiper.params.slidesPerGroupSkip === undefined) {
      this.swiper.params.slidesPerGroupSkip = 0;
    }
  }

  destroySwiper() {
    if (!this.swiper) {
      return;
    }

    // Remove the "swiper-slide" class from all direct child elements of ".js-slider-wrapper"
    const sliderWrapperChildren =
      this.element.querySelector('.js-slider-wrapper').children;
    for (const child of sliderWrapperChildren) {
      child.classList.remove('swiper-slide');
    }

    this.element.classList.remove('slider-enabled');

    this.swiper.destroy(true, true);
    this.swiper = undefined;
  }

  // Get current breakpoint by iterating over the breakpoint and finding the first one that is bigger than the current width but smaller than the next breakpoint
  getCurrentBreakpoint(width) {
    let currentBreakpoint = 0;

    for (const breakpoint in this.breakpoints) {
      if (width > parseInt(breakpoint)) {
        currentBreakpoint = parseInt(breakpoint);
      } else {
        break;
      }
    }

    return this.breakpoints[currentBreakpoint];
  }

  recalculateSlidesWidth() {
    const wrapper = this.element.querySelector('.js-slider-wrapper');

    if (!wrapper) return;

    const slides = Array.from(wrapper.children);

    if (slides.length === 0) return;

    // Get the dynamically calculated gap
    const gap = parseInt(window.getComputedStyle(wrapper).gap);

    // Return early if the gap is zero
    if (gap === 0) return;

    const maxWidth = `calc(100% - ${gap}px)`;
    const translateX = `${gap / 2}px`;

    slides.forEach((slide) => {
      slide.style.maxWidth = maxWidth;
      slide.style.transform = `translateX(${translateX})`;
    });
  }

  // Swiper incorrectly calculates initial slide when using loop and centered slides
  // See: https://github.com/nolimits4web/swiper/issues/7216
  fixInitialSlideCalculation(swiper) {
    if (swiper.params.centeredSlides) {
      swiper.slideToLoop(0, 0);
    }
  }

  toggleAutoplay() {
    if (this.swiper) {
      if (this.swiper.autoplay.running && !this.swiper.autoplay.paused) {
        this.swiper.autoplay.pause();
      } else {
        this.swiper.autoplay.resume();
      }
      this.updateAutoplayButtonState(this.swiper);
    }
  }

  updateAutoplayButtonState(swiper) {
    if (this.autoplayButton) {
      this.autoplayButton.setAttribute(
        'aria-label',
        swiper?.autoplay.running && !swiper?.autoplay.paused
          ? __('Pause autoplay', 'webentor')
          : __('Start autoplay', 'webentor'),
      );
    }
    this.element.classList.toggle(
      'is-playing',
      swiper?.autoplay.running && !swiper?.autoplay.paused,
    );
  }
}

// Also export Swiper for external use
export { SliderComponent, Swiper };
