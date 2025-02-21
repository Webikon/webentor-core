@php
  /**
   * Webentor Element - Slider query loop
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  // Data passed from app/View/Composers/blocks/EQueryLoop.php
@endphp

{{-- Query content is prepared in composer --}}
{!! $block_content !!}
