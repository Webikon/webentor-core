@php
  /**
   * Webentor Element - Accordion
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/
@endphp

@include('components.accordion', [
    'title' => $attributes['title'] ?? '',
    'id' => $block->clientId,
    'open' => $attributes['defaultOpen'] ?? false,
    'accordion_content' => $innerBlocksContent ?? '',
    'accordion_classes' => $block_classes,
])
