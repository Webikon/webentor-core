{{--
  $path - array of values to be displayed in breadcrumbs

  Useage:
  @include('components.breadcrumbs', ['path' => $path])

  --}}

@if (!empty($path))
  <div
    class="{{ $classes ?? '' }} w-breadcrumbs wbtr:flex wbtr:flex-row wbtr:flex-wrap wbtr:items-center wbtr:gap-2"
  >
    @foreach ($path as $item)
      @if ($item[1] !== '')
        <a
          href="{{ $item[1] }}"
          class="w-breadcrumbs__item wbtr:text-caption {{ $loop->last ? 'wbtr:text-black' : 'wbtr:text-gray-500' }} wbtr:hover:underline"
        >
        @else
          <div class="w-breadcrumbs__item wbtr:text-caption {{ $loop->last ? 'wbtr:text-black' : 'wbtr:text-gray-500' }}">
      @endif
      {!! $item[0] !!}
      </{{ $item[1] !== '' ? 'a' : 'div' }}>

      @if (!$loop->last)
        @svg('images.svg.chevron-right', 'w-breadcrumbs__icon')
      @endif
    @endforeach
  </div>
@endif
