@php
  /**
   * Webentor Element - Accordion Group
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/
@endphp

<div
  x-data="{ active: null }"
  class="e-accordion-group {{ $block_classes }} wbtr:relative"
>
  {!! $innerBlocksContent ?? '' !!}
</div>
