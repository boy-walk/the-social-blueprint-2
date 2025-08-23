<?php
/**
 * Template Name: Learning & Growth
 */

get_header();

$featured_args = new WP_Query([
  'posts_per_page' => 3,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => 'learning-and-growth',
    ]
  ],
  'meta_key'       => 'is_featured',
  'meta_value'     => 1, // true
]);
$featured_posts = $featured_args->posts;

$podcasts_args = new WP_Query([
  'post_type' => 'podcast',
  'posts_per_page' => 16,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => ['learning-and-growth'],
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
      'terms' => ['learning-and-growth'],
    ]
  ],
]);

$cost_of_living_args = new WP_Query([
  'post_type' => 'gd_cost_of_living',
  'posts_per_page' => 4,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => ['learning-and-growth'],
    ]
  ],
]);

$cost_of_living_posts = $cost_of_living_args->posts;

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
  'featured' => array_map('map_post', $featured_posts),
  'podcasts' => array_map('map_post', $podcasts),
  'events' => array_map('map_post', $events),
  'costOfLiving' => array_map('map_post', $cost_of_living_posts),
];
?>

<div
    class="tsb-mount"
    id="learning-and-growth-hub-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
