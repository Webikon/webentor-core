@php
  /**
   * Webentor Layout - Site Logo
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  $home_url = function_exists('pll_home_url') ? pll_home_url() : get_home_url();
@endphp

<a
  href="{{ $home_url }}"
  title="{{ get_bloginfo('name', 'display') }}"
>
  @svg('images.svg.site-logo', 'wbtr:h-11 wbtr:w-auto sm:wbtr:w-auto wbtr:text-white')
</a>
