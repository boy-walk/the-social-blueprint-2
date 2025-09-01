<?php
/**
 * Template Name: Support & Services
 */

get_header();

$podcasts_args = new WP_Query([
  'post_type' => 'podcast',
  'posts_per_page' => 16,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => ['support-and-services'],
    ]
  ],
]);

$podcasts = $podcasts_args->posts;

$articles_args = new WP_Query([
  'post_type' => 'article',
  'posts_per_page' => 16,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => ['support-and-services'],
    ]
  ],
]);

$articles = $articles_args->posts;

function map_post($post) {
  return [
    'id' => $post->ID,
    'title' => get_the_title($post),
    'link' => get_permalink($post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
    'post_type' => get_post_type($post),
  ];
}

$breadcrumbs = sbp_build_breadcrumbs();

$props = [
  'podcasts' => array_map('map_post', $podcasts),
  'articles' => array_map('map_post', $articles),
  'breadcrumbs'  => $breadcrumbs,
];
?>

<div
    class="tsb-mount"
    id="support-and-services-hub-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
