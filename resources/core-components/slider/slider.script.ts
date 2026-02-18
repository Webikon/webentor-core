import { SliderComponent } from '@webentorCore/_slider';

// Add initialization code
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-slider').forEach((element) => {
    // Parse data-slider attribute to get params
    const params = JSON.parse(element.getAttribute('data-slider') || '{}');

    new SliderComponent(element, params);
  });
});
