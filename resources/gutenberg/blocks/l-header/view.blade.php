@php
  /**
   * Webentor Layout - Header
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  if (!empty($attributes['sticky']) && $attributes['sticky'] === 'sticky') {
      $block_classes .= ' is-sticky';
  }
  if (!empty($attributes['sticky']) && $attributes['sticky'] === 'sticky-hide-scroll') {
      $block_classes .= ' is-sticky is-sticky-hide-scroll';
  }
@endphp

@include('partials.header', [
    'block_classes' => $block_classes,
])
