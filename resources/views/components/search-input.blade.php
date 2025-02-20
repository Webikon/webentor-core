@if (empty($remove_form_tag_wrapper))
  <form
    action="{{ $form_action ?? home_url('/') }}"
    method="GET"
    {!! $form_attributes ?? '' !!}
  >
@endif

<div class="wbtr:text-grey-300 wbtr:flex wbtr:items-center wbtr:gap-4 wbtr:font-semibold">
  <div class="wbtr:relative wbtr:flex-1">
    <input
      type="text"
      name="{{ $search_name ?? 's' }}"
      placeholder="{{ $search_placeholder ?? __('Search', 'webentor') }}"
      class="wbtr:bg-grey-50 {{ $input_classes ?? '' }} wbtr:w-full wbtr:rounded-full wbtr:py-2.5 wbtr:pl-5 wbtr:pr-12 wbtr:text-current"
      value="{{ $search_value ?? get_search_query() }}"
      {!! $search_input_attributes ?? '' !!}
    >

    <button
      type="submit"
      class="wbtr:absolute wbtr:right-4 wbtr:top-1/2 wbtr:-translate-y-1/2"
    >
      @svg('images.svg.search', 'class' => 'wbtr:fill-current wbtr:w-5 wbtr:h-5')
    </button>
  </div>

  @if (!empty($show_search_btn))
    <x-button
      title="{{ __('Search', 'webentor') }}"
      variant="primary"
      asPill="true"
      element="button"
    />
  @endif
</div>

@if (empty($remove_form_tag_wrapper))
  </form>
@endif
