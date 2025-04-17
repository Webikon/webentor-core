@php
  /**
   * Webentor Element - Tab Container
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  use Illuminate\Support\Str;
@endphp

@include('components.tab-container', [
    'title' => $attributes['title'] ? $attributes['title'] : '',
    'id' => $attributes['title'] ? Str::slug($attributes['title']) : '',
    'tab_content' => $innerBlocksContent ?? '',
    'hide_title' => $attributes['hideTitle'] ?? false,
    'classes' => $block_classes,
])
