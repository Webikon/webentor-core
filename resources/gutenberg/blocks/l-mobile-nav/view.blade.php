@php
  /**
   * Webentor Layout - Mobile Nav
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/
@endphp

<div
  x-data="{ isOpen: false }"
  class="{{ $block_classes }} relative"
>
  <div
    class="w-mobile-nav-icon"
    x-bind:class="{ 'open': isOpen }"
    x-on:click="isOpen = !isOpen"
  >
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>

  {{-- mobile navigation --}}
  <div
    x-show="isOpen"
    x-cloak
    x-transition:enter="wbtr:transform wbtr:transition wbtr:ease-in-out wbtr:duration-500 sm:wbtr:duration-1000"
    x-transition:enter-start="wbtr:translate-x-full"
    x-transition:enter-end="wbtr:translate-x-0"
    x-transition:leave="wbtr:transform wbtr:transition wbtr:ease-in-out wbtr:duration-500 sm:wbtr:duration-1000"
    x-transition:leave-start="wbtr:translate-x-0"
    x-transition:leave-end="wbtr:translate-x-full"
    @click.away="isOpen = false"
    class="wbtr:absolute wbtr:-right-4 wbtr:z-50 wbtr:mt-7 wbtr:[250px] wbtr:bg-white"
  >
    {!! $innerBlocksContent ?? '' !!}
  </div>
</div>
