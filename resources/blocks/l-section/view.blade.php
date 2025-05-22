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
@endphp

<section
  {!! $anchor !!}
  class="{{ $block_classes }} w-section"
>
  <div class="wbtr:flex wbtr:flex-col container">
    {!! $innerBlocksContent ?? '' !!}
  </div>
</section>
