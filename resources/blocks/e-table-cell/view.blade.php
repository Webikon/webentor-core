@php
  /**
   * Webentor Element - Table Cell
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  $tag = !empty($attributes['showAsTh']) ? 'th' : 'td';
@endphp

<{{ $tag }}
  {!! !empty($attributes['rowSpan']) ? "rowspan={$attributes['rowSpan']}" : '' !!}
  {!! !empty($attributes['colSpan']) ? "colspan={$attributes['colSpan']}" : '' !!}
>
  {!! $innerBlocksContent ?? '' !!}
  </{{ $tag }}>
