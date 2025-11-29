<?php
/**
 * Template Name: Community Connection Hub
 */

get_header();

$breadcrumbs = sbp_build_breadcrumbs();

// 1. Featured in Community — 3 posts tagged both 'Community Connection' and 'Featured'
$featured_args = new WP_Query([
  'posts_per_page' => 3,
  'post_status' => 'publish',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => 'community-connection',
    ]
  ],
  'meta_key'       => 'is_featured',
  'meta_value'     => 1, // true
]);
$featured_posts = $featured_args->posts;

// 2. Recent Message Board Posts — custom post type `gd_discount`
$message_board_args = [
  'post_type' => 'gd_discount',
  'posts_per_page' => 15,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => 'community-connection',
    ]
  ],
];
$message_board_posts = get_posts($message_board_args);

$event_posts = tribe_get_events([
  'posts_per_page' => 30,
  'start_date' => current_time('mysql'),
  'end_date' => date('Y-m-d H:i:s', strtotime('+1 week')),
  'tribeHideRecurrence' => true,
  'eventDisplay' => 'list',
  'tax_query' => [
    [
      'taxonomy' => 'theme',
      'field' => 'slug',
      'terms' => 'community-connection',
    ]
  ],
]);

// Convert to clean data
function map_post($post) {
  $author_id = get_post_field('post_author', $post);
  return [
    'id' => $post->ID,
    'title' => html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8'),
    'subtitle' => html_entity_decode(get_the_excerpt($post), ENT_QUOTES, 'UTF-8'),
    'permalink' => get_permalink($post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
    'post_type' => get_post_type($post),
    'date' => get_the_date('', $post),
    'author' => get_the_author_meta('display_name', $author_id),
    'topics' => wp_get_post_terms($post->ID, 'topic_tag', ['fields' => 'names']),
  ];
}

$props = [
  'featured' => array_map('map_post', $featured_posts),
  'messageBoard' => array_map('map_post', $message_board_posts),
  'events' => array_map('map_post', $event_posts),
  'breadcrumbs' => $breadcrumbs,
];
?>

<div id="community-hub-root"></div>

<script type="text/javascript">
  window.__COMMUNITY_HUB_PROPS__ = <?php echo json_encode($props); ?>;
</script>

<?php get_footer(); ?>
