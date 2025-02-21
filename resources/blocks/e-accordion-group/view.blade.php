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
  @class([
      'e-accordion-group wbtr:relative wbtr:w-full',
      'md:wbtr:min-h-140 lg:wbtr:min-h-165 xl:wbtr:min-h-175' =>
          $attributes['minHeightEnabled'] ?? false,
  ])`
>
  {!! $innerBlocksContent ?? '' !!}
</div>
