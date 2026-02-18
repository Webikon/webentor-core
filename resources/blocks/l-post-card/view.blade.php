@php
  /**
   * Webentor Layout - Post Card
   *
   * @param array $attributes The block attributes.
   * @param string $innerBlocksContent The block inner HTML (empty).
   * @param string $anchor Anchor (ID attribute) HTML.
   * @param string $block_classes Block classes.
   * @param object $block WP_Block_Type instance.
   **/

  $in_new = false;

  if (!empty(get_field('external_url', get_the_ID()))) {
      // external url is set
      $url = get_field('external_url', get_the_ID());
      $in_new = true;
  } elseif (get_field('disable_detail', get_the_ID())) {
      // external url is not set and detail is disabled
      $url = null;
  } else {
      $url = get_permalink();
  }
@endphp

@include('components.post-card', [
    'img_id' => get_post_thumbnail_id(),
    'title' => get_the_title(),
    'date' => get_the_date(),
    'excerpt' => get_the_excerpt(),
    'url' => $url,
    'in_new' => $in_new,
])
