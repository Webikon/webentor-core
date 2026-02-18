<div class="w-card card wbtr:bg-gray-800 wbtr:p-4">
  <div class="w-card__inner card__inner wbtr:bg-white wbtr:p-8">
    @if (!empty($img_url))
      <img
        src="{{ $img_url }}"
        alt=""
        class="w-card__img"
      >
    @endif

    <h2 class="w-card__title wbtr:text-24">
      {{ $title }}
    </h2>

    <div class="w-card__content">
      {!! $content !!}
    </div>
  </div>
</div>
