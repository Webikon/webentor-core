{{--
  $title - Accordeon title
  $id - unique ID for element, will be generated if empty
  $open - ture/false if accordeon will be opened on load
  $accordion_content - HTML content of accordeon, if empty Gutenberg InnerBlocks will be used
  $accordion_classes - additional classes for the accordion
  $btn_classes - additional classes for the button
  Useage:
  @include('components.accordion', ['title' => $data['title'], 'id' => $block->clientId, 'open' => $data['open'], 'accordion_content' => $content ])

  --}}

{{-- set defaults --}}
@if (empty($title))
  @php $title= "Accordion title"; @endphp
@endif

@if (empty($id))
  @php $id= rand(); @endphp
@endif

@if (empty($open))
  @php $open = false; @endphp
@endif

{{-- set openId to have expanded this accordeon on load --}}
@php $openedId = $open ? $id : ''; @endphp

<div
  x-data="{
      localActive: '{{ $openedId }}',
      id: '{{ $id }}',
      get expanded() {

          if (typeof this.active !== 'undefined') {

              if (this.active === null) {

                  this.active = this.localActive !== '' ? this.localActive : null
              }
              return this.active === this.id
          } else {
              return this.localActive === this.id
          }

      },
      set expanded(value) {
          if (typeof this.active !== 'undefined') {
              this.active = value ? this.id : null
              this.localActive = value ? this.id : null
          } else {
              this.localActive = value ? this.id : null
          }
      },
  }"
  role="region"
  class="wbtr:w-full {{ $accordion_classes ?? '' }}"
>
  <h2>
    <button
      x-on:click="expanded = !expanded"
      :aria-expanded="expanded"
      class="{{ $btn_classes ?? '' }} text-headline wbtr:text-grey-700 wbtr:flex wbtr:w-full wbtr:items-center wbtr:justify-between wbtr:py-2.5 wbtr:text-left"
    >
      <span>{{ $title }}</span>
      <span
        x-bind:class="{ '-wbtr:rotate-90': expanded, 'wbtr:rotate-90': !expanded }"
        class="transition-transform"
        aria-hidden="true"
      >
        @svg('images.svg.btn-icon', 'wbtr:w-4 wbtr:h-4 wbtr:text-grey-500')
      </span>

    </button>
  </h2>

  <div
    x-show="expanded"
    x-cloak
    x-collapse
    class="accordion-content wbtr:flex wbtr:w-full wbtr:flex-col wbtr:items-start wbtr:justify-start wbtr:gap-3 wbtr:pt-3"
  >
    {{-- Show InnerBlocks if $content is not set --}}
    @if (!empty($accordion_content))
      {!! $accordion_content !!}
    @endif

  </div>
</div>
