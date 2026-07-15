import { throttle } from '@webentorCore/_utils';

/**
 * l-section background video loader.
 *
 * The Blade view renders the background <video> with `preload="none"` and the
 * source URL held in `data-src` (not `src`), so nothing is fetched until this
 * script decides to load it. Behaviour is driven by two data attributes:
 *   - data-disable-mobile="1" → never load below 480px (image fallback shows)
 *   - data-lazyload="1"       → load only when the section scrolls into view
 *
 * Vanilla IntersectionObserver on purpose: webentor-core only ships the Alpine
 * `collapse` plugin, so a core block cannot depend on `@alpinejs/intersect`
 * (that lives in the consumer theme). With JS disabled the video simply never
 * loads and the <picture> image remains visible.
 *
 * The decision is re-run on a throttled `resize` so a viewport that starts on
 * mobile (video skipped) still loads the video once it crosses up to desktop.
 * `evaluate()` is idempotent — already-loaded videos and videos already being
 * observed are left untouched, so repeated resize ticks are cheap and safe.
 */

// Below the 480px `sm` breakpoint (Tailwind `sm:` is min-width: 480px).
const MOBILE_QUERY = '(max-width: 479.98px)';
const RESIZE_THROTTLE = 200;

function loadVideo(video: HTMLVideoElement, source: HTMLSourceElement): void {
  if (video.dataset.loaded) {
    return;
  }

  source.src = source.dataset.src ?? '';
  video.load();
  video.dataset.loaded = '1';

  // `autoplay` alone won't (re)start playback once a source is swapped in.
  const playback = video.play();
  if (playback) {
    playback.catch(() => {
      /* Autoplay can be blocked (e.g. reduced-data); ignore. */
    });
  }
}

function evaluateVideo(video: HTMLVideoElement): void {
  if (video.dataset.loaded) {
    return;
  }

  const source = video.querySelector<HTMLSourceElement>('source[data-src]');
  if (!source) {
    return;
  }

  const disableMobile = video.dataset.disableMobile === '1';
  const lazy = video.dataset.lazyload === '1';
  const blockedOnMobile = () =>
    disableMobile && window.matchMedia(MOBILE_QUERY).matches;

  // Never load (or fetch) the video while on mobile when disabled there.
  if (blockedOnMobile()) {
    return;
  }

  if (lazy && 'IntersectionObserver' in window) {
    // Attach the observer once; guard against duplicates on resize ticks.
    if (video.dataset.observing) {
      return;
    }
    video.dataset.observing = '1';

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }
        // Re-check at fire time: the viewport may have dropped to mobile
        // after the observer was attached. Keep observing if so.
        if (blockedOnMobile()) {
          return;
        }
        loadVideo(video, source);
        observer.disconnect();
        delete video.dataset.observing;
      },
      { rootMargin: '200px' },
    );
    observer.observe(video);
  } else {
    loadVideo(video, source);
  }
}

function evaluate(): void {
  document
    .querySelectorAll<HTMLVideoElement>('video[data-webentor-video]')
    .forEach(evaluateVideo);
}

document.addEventListener('DOMContentLoaded', () => {
  evaluate();
  window.addEventListener('resize', throttle(evaluate, RESIZE_THROTTLE));
});
