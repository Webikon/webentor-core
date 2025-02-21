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

  if (!empty($attributes['borderTop']) || !empty($attributes['borderBottom'])) {
      $block_classes .= ' wbtr:border-border';
  }
  if (!empty($attributes['borderTop'])) {
      $block_classes .= ' wbtr:border-t-2';
  }
  if (!empty($attributes['borderBottom'])) {
      $block_classes .= ' wbtr:border-b-2';
  }
@endphp

<section
  {!! $anchor !!}
  class="{{ $block_classes }} w-section wbtr:gap-10 lg:wbtr:gap-20"
>
  <div class="wbtr:flex wbtr:flex-col container">
    {!! $innerBlocksContent ?? '' !!}
  </div>
</section>
