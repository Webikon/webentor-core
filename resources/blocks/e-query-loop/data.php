<?php

use Illuminate\Support\Facades;
use Illuminate\View\View;

/**
 * Pass data to the block.
 *
 * First argument is the current block view path.
 */
Facades\View::composer('e-query-loop.view', function (View $view) {
    $data = $view->getData();
    $attributes = $data['attributes'];

    // Build up query
    $query_attributes = $attributes['query'];

    $query_args = [
        'post_type' => $query_attributes['postType'] ?? 'post',
        'post__not_in' => [get_the_ID()], // Ignore current post
    ];
    if (!empty($query_attributes['perPage'])) {
        $query_args['posts_per_page'] = $query_attributes['perPage'];
    }
    if (!empty($query_attributes['taxQuery'])) {
        foreach ($query_attributes['taxQuery'] as $taxonomy => $term_ids) {
            $query_args['tax_query'][] = [
                'taxonomy' => $taxonomy,
                'field' => 'id',
                'terms' => $term_ids,
            ];
        }
    }

    /*
        Allow to modify query args before the query is executed.

        Example:
        add_filter('webentor/query_loop_args', function ($query_args, $custom_query_id) {
            if ($custom_query_id === 'some-id') {
                $query_args['posts_per_page'] = 1;
            }

            return $query_args;
        }, 10, 2);
     */
    $query_args = apply_filters('webentor/query_loop_args', $query_args, $query_attributes['queryId'] ?? null);

    $query = new \WP_Query($query_args);

    // Query loop block should contain only one child block with Post Template, thats why we break after first iteration
    $post_template_block = null;
    foreach ($data['block']->parsed_block['innerBlocks'] as $block) {
        $post_template_block = $block;

        break;
    }

    // Now we loop through the query and render the post template block
    // in this way every post will be rendered with the same template
    // Inspired by: https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/post-template/index.php
    $block_content = '';
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            // Render post template block
            $block_content .= (new \WP_Block($post_template_block, ['itemNumber' => $query->current_post]))->render(['dynamic' => false]);
        }

        wp_reset_postdata();
    }

    $view->with('block_content', $block_content);
});
