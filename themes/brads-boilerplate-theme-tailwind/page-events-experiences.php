<?php
/**
 * Template Name: Events Experiences Hub
 */

get_header();

$featured_events = tribe_get_events([
  'posts_per_page' => 3,
  'post_status' => 'publish',
  'tribeHideRecurrence' => true,
  'tax_query' => [
    [
      'taxonomy' => 'feature_tag',
      'field' => 'slug',
      'operator' => 'EXISTS',
    ],
  ],
]);

$events_this_week = tribe_get_events([
  'posts_per_page' => 25,
  'start_date' => current_time('mysql'),
  'end_date' => date('Y-m-d H:i:s', strtotime('+1 week')),
  'tribeHideRecurrence' => true,
  'eventDisplay' => 'list',
]);


$browse_all_events = tribe_get_events([
  'posts_per_page'      => -1,
  'start_date'          => current_time('mysql'),
  'tribeHideRecurrence' => true,
  'eventDisplay'        => 'list',
]);



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
    'topics' => wp_get_post_terms($post->ID, 'topic_tag', ['fields' => 'names']),
  ];
}

$props = [
  'featured' => array_map('map_post', $featured_events),
  'eventsThisWeek' => array_map('map_post', $events_this_week),
  'browseAll' => array_map('map_post', $browse_all_events),
];
?>

<div id="events-hub-root" 
  data-props= "<?php echo esc_attr( wp_json_encode($props) ); ?>"
></div>

<?php get_footer(); ?>
