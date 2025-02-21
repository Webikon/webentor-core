@php
  /**
   * Webentor Element - SVG
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  $svg_width = $attributes['width'] ?? null;
  $svg_height = $attributes['height'] ?? null;

  $svg_content = !empty($attributes['imgId'])
      ? \Webentor\Core\modify_svg_attributes($attributes['imgId'], $svg_width, $svg_height, 'e-svg ' . $block_classes)
      : null;
@endphp

@if (!empty($svg_content))
  @if (!empty($attributes['link']['url']))
    <a
      href="{{ $attributes['link']['url'] }}"
      target="{{ !empty($attributes['link']['opensInNewTab']) ? '_blank' : '_self' }}"
      title="{{ $attributes['link']['title'] }}"
      class="e-svg-link"
    >
      {!! $svg_content !!}
    </a>
  @else
    {!! $svg_content !!}
  @endif
@endif
