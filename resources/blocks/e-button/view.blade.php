@php
  /**
   * Webentor Element - Button
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  if (empty($attributes['button']['showButton'])) {
      return;
  }
@endphp

<x-button
  url="{{ $attributes['button']['url'] ?? '' }}"
  title="{!! $attributes['button']['title'] ?? '' !!}"
  openInNewTab="{{ $attributes['button']['newTab'] ?? false }}"
  variant="{{ $attributes['button']['variant'] ?? '' }}"
  size="{{ $attributes['button']['size'] ?? '' }}"
  classes="{{ $block_classes ?? '' }}"
  icon="{{ !empty($attributes['button']['showIcon']) && !empty($attributes['button']['icon']['name']) ? $attributes['button']['icon']['name'] : '' }}"
  iconPosition="{{ $attributes['button']['iconPosition'] ?? '' }}"
  element="{{ $attributes['button']['htmlElement'] ?? 'a' }}"
/>
