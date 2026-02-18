@php
  /**
   * Webentor Layout - Formatted Content
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   * @param object $product The product instance.
   **/
@endphp

<div class="format-content {{ $block_classes }}">
  {!! $innerBlocksContent !!}
</div>
