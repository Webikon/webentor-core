@php
  /**
   * Webentor Layout - 404 block.
   *
   * @param array $attributes The block attributes.
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/
@endphp

<div
  {!! $anchor !!}
  class="{{ $block_classes }} wbtr:my-20 wbtr:flex wbtr:flex-col wbtr:items-center wbtr:gap-8"
>

  <div class="wbtr:flex wbtr:flex-col wbtr:items-center wbtr:gap-4">
    <div class="wbtr:font-heading wbtr:text-80 wbtr:leading-125 wbtr:text-gray-800 wbtr:text-center">
      404
    </div>

    <div
      class="wbtr:font-heading wbtr:text-30 wbtr:leading-125 wbtr:text-gray-800 xl:wbtr:text-38 wbtr:text-center wbtr:uppercase"
    >
      {!! $attributes['title'] ?? '' !!}
    </div>
  </div>

  @if (!empty($attributes['button']['showButton']))
    <x-button
      url="{{ function_exists('pll_home_url') ? pll_home_url() : get_home_url() }}"
      title="{{ $attributes['button']['title'] ?? __('Go to homepage', 'webentor') }}"
      openInNewTab="{{ false }}"
      variant="{{ $attributes['button']['variant'] ?? 'primary' }}"
      icon="{{ !empty($attributes['button']['showIcon']) && !empty($attributes['button']['icon']['name']) ? $attributes['button']['icon']['name'] : '' }}"
      iconPosition="{{ $attributes['button']['iconPosition'] ?? 'right' }}"
    />
  @endif
</div>
