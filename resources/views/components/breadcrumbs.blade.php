{{--
  $path - array of values to be displayed in breadcrumbs

  Useage:
  @include('components.breadcrumbs', ['path' => $path])

  --}}

@if (!empty($path))
  <div
    class="{{ $block_classes }} wbtr:flex wbtr:flex-row wbtr:flex-wrap wbtr:items-center wbtr:gap-2 wbtr:py-3.5 lg:wbtr:py-4"
  >
    @foreach ($path as $item)
      @if ($item[1] !== '')
        <a
          href="{{ $item[1] }}"
          class="wbtr:text-caption {{ $loop->last ? 'wbtr:text-black' : 'wbtr:text-gray-500' }} wbtr:hover:underline"
        >
        @else
          <div class="wbtr:text-caption {{ $loop->last ? 'wbtr:text-black' : 'wbtr:text-gray-500' }}">
      @endif
      {!! $item[0] !!}
      </{{ $item[1] !== '' ? 'a' : 'div' }}>

      @if (!$loop->last)
        @svg('images.svg.chevron-right')
      @endif
    @endforeach
  </div>
@endif
