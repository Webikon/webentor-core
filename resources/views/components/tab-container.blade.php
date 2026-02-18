{{--
  $title - Tab title
  $id - unique ID for element, will be generated if empty
  $tab_content - HTML content of tab, if empty Gutenberg InnerBlocks will be used

  Usage:
  @include('components.tab-container', ['title' => $data['title'], 'id' => $block['id'], 'tab_content' => $content ])

--}}

{{-- Set defaults --}}
@if (empty($id))
  @php $id = rand(); @endphp
@endif

<div
  id="{{ $id }}"
  x-show="activeTab === '{{ $id }}'"
  x-cloak
  class="w-tab-container tab-container tab-panel"
  x-transition:enter-start="wbtr:opacity-0 wbtr:scale-100"
  x-transition:enter="wbtr:transition wbtr:ease-in wbtr:duration-500"
  x-transition:enter-end="wbtr:opacity-100 wbtr:scale-100"
>
  <div
    class="{{ $classes ?? '' }} w-tab-container__content tab-container__content wbtr:flex wbtr:w-full wbtr:flex-col wbtr:items-start wbtr:justify-start"
  >
    @if (!empty($title) && empty($hide_title))
      <h2 class="w-tab-container__title text-h2">{{ $title }}</h2>
    @endif

    @if ($tab_content)
      {!! $tab_content !!}
    @endif
  </div>
</div>
