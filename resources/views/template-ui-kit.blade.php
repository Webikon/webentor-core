<?php
/*
Template Name: UI Kit
*/
?>

<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <?php
  $block_content = do_blocks('');
  ?>
  <?php wp_head(); ?>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >
</head>

<body <?php body_class(); ?>>
  <?php wp_body_open(); ?>
  <div class="wp-site-blocks">
    <?php block_header_area(); ?>

    <?php echo $block_content; ?>

    @include('ui-kit.ui-typography')

    @include('ui-kit.ui-kit-colors')

    @include('ui-kit.ui-kit-buttons')

    @include('ui-kit.ui-kit-core-components')

    @include('ui-kit.ui-kit-custom-components')

    <footer class="wp-block-template-part site-footer">
      <?php block_footer_area(); ?>
    </footer>
  </div>
  <?php wp_footer(); ?>
</body>
