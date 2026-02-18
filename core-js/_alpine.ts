import collapse from '@alpinejs/collapse';
import Alpine from 'alpinejs';

// Initialize Alpine if it's not already initialized
const AlpineInstance = window.Alpine || Alpine;
if (!window.Alpine) {
  // Make Alpine globally available
  window.Alpine = Alpine;

  document.addEventListener('DOMContentLoaded', () => {
    AlpineInstance.start();
  });
}

document.addEventListener('alpine:init', () => {
  // Register default plugins
  AlpineInstance.plugin(collapse);
});

export { AlpineInstance as Alpine };
