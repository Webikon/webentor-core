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
    x-init="await $nextTick();
    $dispatch('e_tabs_nav_initialized', { id: {{ $additional_data['tabs_nav'][0]['id'] ?? 0 }}, activeTab: activeTab, content: $refs.tabContainer });"
    class="e-tabs wbtr:w-full {{ $block_classes }}"
  >
    <div class="e-tabs__navigation tabs-navigation">
      <ul class="e-tabs__navigation-list wbtr:border-gray-100 wbtr:flex wbtr:flex-wrap wbtr:border-b wbtr:text-center">
        @foreach ($additional_data['tabs_nav'] as $index => $tab)
          <li class="e-tabs__navigation-item">
            <button
              x-on:click="
                activeTab = '{{ $tab['id'] }}'
                await $nextTick();
                $dispatch('e_tabs_nav_item_clicked', { id: '{{ $tab['id'] }}', activeTab: activeTab, content: $refs.tabContainer });
              "
              class="e-tabs__btn wbtr:inline-block wbtr:p-4"
              :class="{ 'is-active': activeTab === '{{ $tab['id'] }}' }"
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
