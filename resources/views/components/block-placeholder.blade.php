{{--
  $title - Block name
  $description - Placeholder description
  $hide_description - Hide description

  Useage:
  @include('components.block-placeholder', ['name' => 'My block' ])

  --}}
<div
  class="w-block-placeholder wbtr:border-gray-200 wbtr:bg-gray-100 wbtr:flex wbtr:flex-col wbtr:gap-3 wbtr:border-2 wbtr:p-3 wbtr:align-middle"
>
  <div class="w-block-placeholder__title wbtr:text-20">{{ __('Block: ', 'webentor') }} {{ $name }}</div>

  @if (empty($hide_description))
    <div class="w-block-placeholder__description wbtr:text-18">{{ $description ?? __('Please fill the block fields to render preview.', 'webentor') }}
    </div>
  @endif
</div>
