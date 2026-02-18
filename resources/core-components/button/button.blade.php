{{--

Usage:
<x-button
  url="{{ $attributes['button']['url'] }}"
  title="{!! $attributes['button']['title'] !!}"
  openInNewTab="{{ $attributes['button']['newTab'] ?? false }}"
  variant="{{ $attributes['button']['variant'] ?? '' }}"
  :dataAttributes="[
      'data-params' => json_encode($addToCartInitParams ?? ''),
      '@click' =>
          '(e) => {$store.cart.addItem(\'' .
          ($product ?? '') .
          '\', e.currentTarget.dataset.params, \'' .
          ($period ?? 1) .
          '\')}',
  ]"
/>

--}}

@php
  $dataAttributesInline = '';
  if (!empty($dataAttributes)) {
      $dataAttributesInline = implode(
          ' ',
          array_map(
              function ($k, $v) {
                  if (isset($v)) {
                      return $k . '="' . htmlspecialchars($v) . '"';
                  }
              },
              array_keys($dataAttributes),
              $dataAttributes,
          ),
      );
  }
@endphp

@if (!empty($element) && $element === 'a')
  <a
    class="{{ $classes ?? '' }}"
    title="{!! $title !!}"
    @if (!empty($id)) id="{{ $id }}" @endif
    @if (!empty($url)) href="{!! $url !!}" @endif
    @if (!empty($openInNewTab)) target="_blank" rel="noopener noreferrer" @endif
    @if (!empty($disabled)) disabled @endif
    @if (!empty($useAsToggle)) @click.prevent="toggleOpen = !toggleOpen" @endif
    {!! $dataAttributesInline !!}
  >
    <span class="btn__text">
      {!! $title !!}
    </span>
    {!! $icon ?? '' !!}
  </a>
@elseif (!empty($element) && $element === 'button')
  <button
    class="{{ $classes ?? '' }}"
    title="{!! $title !!}"
    @if (!empty($id)) id="{{ $id }}" @endif
    @if (!empty($disabled)) disabled @endif
    @if (!empty($buttonType)) type="{{ $buttonType }}" @endif
    {!! $dataAttributesInline !!}
  >
    <span class="btn__text">
      {!! $title !!}
    </span>
    {!! $icon ?? '' !!}
  </button>
@endif
