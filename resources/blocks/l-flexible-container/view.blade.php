@php
  /**
   * Webentor Layout - Flexible Container
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/
@endphp

@if (!empty($attributes['blockLink']['url']))
  <a
    {!! $anchor !!}
    href="{{ $attributes['blockLink']['url'] }}"
    title="{{ $attributes['blockLink']['title'] ?? '' }}"
    @notempty($attributes['blockLink']['open_in_new_tab'])
      {!! 'target="_blank"' !!}
    @endnotempty
    class="w-flexible-container {{ $block_classes }}"
  >
    {!! $innerBlocksContent ?? '' !!}
  </a>
@else
  <div
    {!! $anchor !!}
    class="w-flexible-container {{ $block_classes }}"
  >{!! $innerBlocksContent ?? '' !!}</div>
@endif
