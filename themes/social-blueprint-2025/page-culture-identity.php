<?php
/**
 * Template Name: Culture & Identity
 */

get_header();

$breadcrumbs = sbp_build_breadcrumbs();

$podcasts_args = new   WP_Query([
  'post_type' => 'podcast',
  'posts_per_page' => 16,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => ['culture-and-identity'],
    ]
  ],
]);

$podcasts = $podcasts_args->posts;

$events = tribe_get_events([
  'posts_per_page' => 16,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => ['culture-and-identity'],
    ]
  ],
]);

function map_post($post) {
  return [
    'id' => $post->ID,
    'title' => get_the_title($post),
    'link' => get_permalink($post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
    'post_type' => get_post_type($post),
  ];
}

$props = [
  'podcasts' => array_map('map_post', $podcasts),
  'events' => array_map('map_post', $events),
  'breadcrumbs'  => $breadcrumbs,
];
?>

<div
    class="tsb-mount"
    id="culture-and-identity-hub-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
