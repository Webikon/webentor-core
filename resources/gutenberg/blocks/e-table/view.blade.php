@php
  /**
   * Webentor Element - Table
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/
@endphp

<div
  id="{{ $attributes['anchor'] ?? '' }}"
  class="table-block {{ $block_classes }}"
>
  <div class="table-scroll-shadow">
    <figure class="wp-block-table is-style-regular">
      <table>
        {!! $innerBlocksContent ?? '' !!}
      </table>
    </figure>
  </div>
</div>
