@php
  /**
   * Webentor Element - Icon Picker
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  $svg_width = $attributes['width'] ?? '24';
  $svg_height = $attributes['height'] ?? '24';

  if (!empty($attributes['inheritSize'])) {
      $svg_width = 'auto';
      $svg_height = 'auto';
  }
@endphp

@if (!empty($attributes['icon']['name']))
  @if (!empty($attributes['link']['url']))
    <a
      href="{{ $attributes['link']['url'] }}"
      target="{{ !empty($attributes['link']['opensInNewTab']) ? '_blank' : '_self' }}"
      title="{{ $attributes['link']['title'] }}"
      class="e-svg-link e-svg-icon-wrapper {{ $attributes['color'] ?? '' }}"
      style="width: {{ $svg_width }}px; height: {{ $svg_height }}px;"
    >
      @svg("images/svg/{$attributes['icon']['name']}", "e-svg-icon e-svg-icon--{$attributes['icon']['name']}")
    </a>
  @else
    <span
      class="e-svg-icon-wrapper {{ $attributes['color'] ?? '' }}"
      style="width: {{ $svg_width }}px; height: {{ $svg_height }}px;"
    >
      @svg("images/svg/{$attributes['icon']['name']}", "e-svg-icon e-svg-icon--{$attributes['icon']['name']}")
    </span>
  @endif
@endif
