@php
  /**
   * Webentor Element - Tabs
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   * @param array $additional_data Additional data specific for this block.
   **/
@endphp

@if (isset($additional_data['tabs_nav']) && count($additional_data['tabs_nav']) > 0)
  <div
    {!! $anchor !!}
    x-data="{ activeTab: '{{ $additional_data['tabs_nav'][0]['id'] ?? 0 }}' }"
    class="e-tabs wbtr:w-full"
  >
    <div class="e-tabs__navigation tabs-navigation">
      <ul class="wbtr:border-gray-100 wbtr:flex wbtr:flex-wrap wbtr:border-b wbtr:text-center">
        @foreach ($additional_data['tabs_nav'] as $index => $tab)
          <li class="e-tabs__navigation-item">
            <button
              @click="activeTab = '{{ $tab['id'] }}'"
              class="e-tabs__btn wbtr:inline-block wbtr:p-4"
              :class="{ 'wbtr:bg-sred-300': activeTab === '{{ $tab['id'] }}' }"
            >
              {{ $tab['title'] ?? '' }}
            </button>
          </li>
        @endforeach
      </ul>
    </div>

    {!! $innerBlocksContent ?? '' !!}
  </div>
@endif
