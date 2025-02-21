@php
  /**
   * Webentor Element - Breadcrumbs
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   * @param object $product The product instance.
   **/

  $path = [[__('Home', 'webentor'), '/'], [get_the_title(), '']];
@endphp

@include('components.breadcrumbs', ['path' => $path])
