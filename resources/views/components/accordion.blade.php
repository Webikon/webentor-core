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
  x-ref="accordion"
  role="region"
  class="w-accordion accordion wbtr:w-full {{ $accordion_classes ?? '' }}"
>
  <h2 class="w-accordion__btn-wrapper accordion-btn-wrapper">
    <button
      x-on:click="
        expanded = !expanded;
        await $nextTick();
        $dispatch('e_accordion_btn_clicked', { expanded: expanded, content: $refs.accordionContent });
      "
      x-ref="accordionBtn"
      :aria-expanded="expanded"
      class="{{ $btn_classes ?? '' }} w-accordion__btn accordion-btn text-headline wbtr:text-gray-700 wbtr:flex wbtr:w-full wbtr:items-center wbtr:justify-between wbtr:py-2.5 wbtr:text-left"
    >
      <span class="w-accordion__btn-title accordion-btn-title">{{ $title }}</span>
      <span
        x-bind:class="{ '-wbtr:rotate-90': expanded, 'wbtr:rotate-90': !expanded }"
        class="w-accordion__btn-icon accordion-btn-icon transition-transform"
        aria-hidden="true"
      >
        @svg('images.svg.chevron-right', 'wbtr:w-4 wbtr:h-4 wbtr:text-gray-500')
      </span>

    </button>
  </h2>

  <div
    x-show="expanded"
    x-ref="accordionContent"
    x-cloak
    x-collapse
    class="w-accordion__content-wrapper"
  >
    <div
      class="w-accordion__content accordion-content wbtr:flex wbtr:w-full wbtr:flex-col wbtr:items-start wbtr:justify-start wbtr:gap-3 wbtr:pt-3"
    >
      {{-- Show InnerBlocks if $content is not set --}}
      @if (!empty($accordion_content))
        {!! $accordion_content !!}
      @endif
    </div>
  </div>
</div>
