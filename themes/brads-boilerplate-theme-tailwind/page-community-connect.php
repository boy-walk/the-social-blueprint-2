<?php
/**
 * Template Name: Community Connection Hub
 */

get_header();

// 1. Featured in Community — 3 posts tagged both 'Community Connection' and 'Featured'
$featured_args = [
  'posts_per_page' => 3,
  'tag_slug__and' => ['community-connection', 'featured']
];
$featured_posts = get_posts($featured_args);

// 2. Recent Message Board Posts — custom post type `gd_discount`
$message_board_args = [
  'post_type' => 'gd_discount',
  'posts_per_page' => 3,
  'orderby' => 'date',
  'order' => 'DESC',
];
$message_board_posts = get_posts($message_board_args);

// 3. What’s on This Week — Events from The Events Calendar
$events_args = [
  'post_type' => 'tribe_events',
  'posts_per_page' => 4,
  'orderby' => 'meta_value',
  'order' => 'ASC',
  'meta_key' => '_EventStartDate',
  'tag' => 'community-connection',
  'meta_query' => [[
    'key' => '_EventStartDate',
    'value' => current_time('Y-m-d H:i:s'),
    'compare' => '>=',
    'type' => 'DATETIME'
  ]]
];
$event_posts = get_posts($events_args);

// 4. Browse all community — all posts tagged 'Community Connection'
$all_community_args = [
  'posts_per_page' => 8,
  'tag' => 'community-connection',
];
$all_community_posts = get_posts($all_community_args);

// Convert to clean data
function map_post($post) {
  return [
    'id' => $post->ID,
    'title' => get_the_title($post),
    'excerpt' => get_the_excerpt($post),
    'permalink' => get_permalink($post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
    'post_type' => get_post_type($post),
    'date' => get_the_date('', $post),
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
