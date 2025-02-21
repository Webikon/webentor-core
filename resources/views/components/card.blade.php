<div class="card wbtr:bg-gray-800 wbtr:p-4">
  <div class="card__inner wbtr:bg-white wbtr:p-8">
    @if (!empty($img_url))
      <img
        src="{{ $img_url }}"
        alt=""
      >
    @endif

    <h2 class="wbtr:text-24">
      {{ $title }}
    </h2>

    <div>
      {!! $content !!}
    </div>
  </div>
</div>
