<?php
/**
 * Template Name: Community Connection Hub
 */

get_header();

// 1. Featured in Community — 3 posts tagged both 'Community Connection' and 'Featured'
$featured_args = [
  'posts_per_page' => 3,
  'post_type' => ['event', 'podcast', 'article', 'directory', 'resource'], // match what your taxonomy is registered to
  'post_status' => 'publish',
  'tax_query' => [
    [
      'taxonomy' => 'feature_tag',
      'field' => 'slug',
      'operator' => 'EXISTS', // fetch posts that have *any* feature_tag
    ],
    [
      'taxonomy' => 'category',
      'field' => 'slug',
      'terms' => 'community-connection', // only fetch posts tagged with 'community-
    ]
  ],
];
$featured_posts = get_posts($featured_args);

// 2. Recent Message Board Posts — custom post type `gd_discount`
$message_board_args = [
  'post_type' => 'gd_discount',
  'posts_per_page' => 15,
  'orderby' => 'date',
  'order' => 'DESC',
];
$message_board_posts = get_posts($message_board_args);

// 3. What’s on This Week — Events from The Events Calendar
$events_query = new WP_Query([
  'post_type' => 'tribe_events',
  'posts_per_page' => 4,
  'orderby' => 'meta_value',
  'order' => 'ASC',
  'meta_key' => '_EventStartDate',
  'tag' => 'community-connection',
  'ignore_sticky_posts' => true,
  'no_found_rows' => true,
]);

$event_posts = $events_query->posts;

// 4. Browse all community — all posts tagged 'Community Connection'
$all_community_args = new WP_QUERY([
  'posts_per_page' => 8,
  'tax_query' => [
    [
      'taxonomy' => 'category',
      'field' => 'slug',
      'terms' => 'community-connection', // only fetch posts tagged with 'community-
    ]
  ],
]);
$all_community_posts = get_posts($all_community_args);

// Convert to clean data
function map_post($post) {
  $author_id = get_post_field('post_author', $post);
  return [
    'id' => $post->ID,
    'title' => html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8'),
    'excerpt' => html_entity_decode(get_the_excerpt($post), ENT_QUOTES, 'UTF-8'),
    'permalink' => get_permalink($post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
    'post_type' => get_post_type($post),
    'date' => get_the_date('', $post),
    'author' => get_the_author_meta('display_name', $author_id),
  ];
}

$props = [
  'featured' => array_map('map_post', $featured_posts),
  'messageBoard' => array_map('map_post', $message_board_posts),
  'events' => array_map('map_post', $event_posts),
  'browseAll' => array_map('map_post', $all_community_posts),
];
?>

<div id="community-hub-root"></div>

<script type="text/javascript">
  window.__COMMUNITY_HUB_PROPS__ = <?php echo json_encode($props); ?>;
</script>

<?php get_footer(); ?>
