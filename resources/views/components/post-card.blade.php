{{--
  $img_id - Image ID
  $title - Post title
  $date - Post date
  $excerpt - Post excerpt
  $url - Link to post
  $in_new - Boolean - open in new tab

  Useage:
  @include('components.post-card', [ 'img_id' => 120, 'title' => 'title', 'date' => 'date', 'excerpt' => 'some content...', 'url' => 'https://webentor.com, 'in_new' => true ])

  --}}

@php
  $target = !empty($in_new) && $in_new ? 'target=_blank' : '';
@endphp

<div class="w-post-card wbtr:bg-gray-50 wbtr:flex wbtr:h-full wbtr:flex-col wbtr:gap-4">
  @notempty($url)
    <a
      href="{{ $url }}"
      {{ $target }}
      class="w-post-card__img-link"
    >
    @endnotempty

    @if (!empty($img_id))
      {!! \Webentor\Core\get_resized_image($img_id, [656, 430], true, ['class' => 'w-full', 'retina' => true]) !!}
    @else
      <img
        src="{{ asset('/images/post-placeholder.jpg')->uri() }}"
        alt="Placeholder"
        class="w-post-card__img wbtr:h-[215px] wbtr:w-full wbtr:object-cover"
      />
    @endif

    @notempty($url)
    </a>
  @endnotempty

  <div
    class="w-post-card__content wbtr:flex wbtr:h-full wbtr:flex-col wbtr:justify-between wbtr:gap-3 wbtr:px-2 wbtr:pb-2"
  >
    <div class="w-post-card__content-body wbtr:flex wbtr:flex-col wbtr:gap-3">
      <div class="w-post-card__content-header">
        @notempty($url)
          <a
            href="{{ $url }}"
            {{ $target }}
            class="w-post-card__title-link"
          >
          @endnotempty

          @notempty($title)
            <h2 class="w-post-card__title wbtr:text-gray-700 wbtr:text-title">{!! $title !!}</h2>
          @endnotempty

          @notempty($url)
          </a>
        @endnotempty

        @notempty($date)
          <div class="w-post-card__date wbtr:text-12 wbtr:text-gray-200">{{ $date }}</div>
        @endnotempty

      </div>

      @notempty($excerpt)
        <div class="w-post-card__excerpt wbtr:text-16 wbtr:leading-150 wbtr:text-gray-200">{!! $excerpt !!}</div>
      @endnotempty
    </div>

    @notempty($url)
      <a
        href="{{ $url }}"
        {{ $target }}
        class="w-post-card__read-more wbtr:text-16 wbtr:leading-150 wbtr:hover:wbtr:underline"
      >{{ __('Read more', 'webentor') }}</a>
    @endnotempty
  </div>
</div>
