@php
  /**
   * Webentor Layout - Nav Menu
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  $direction = 'wbtr:direction-row';
  if (!empty($attributes['direction'])) {
      $direction = $attributes['direction'];
  }

  if (!empty($attributes['menuId'])) {
      $menu_id = $attributes['menuId'];

      $args = [
          'menu' => $menu_id,
          'container' => 'nav',
          'container_class' => 'menu-container ' . $direction . $block_classes,
      ];

      wp_nav_menu($args);
  }
@endphp
