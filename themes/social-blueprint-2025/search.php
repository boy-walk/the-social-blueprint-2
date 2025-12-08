<?php
/**
 * Template Name: Search Page
 */

get_header();

function sb_get_search_results() {
  $query = get_search_query();

  $args = [
    's' => $query,
    'post_type' => ['tribe_events', 'podcast', 'article', 'directory', 
    'gd_discount', 'gd_aid_listing', 'gd_health_listing', 'gd_business', 'gd_photo_gallery', 'gd_cost_of_living' ],
    'post_status' => 'publish',
    'posts_per_page' => -1,
  ];

  $results = new WP_Query($args);

  return array_map(function($post) {
    return [
      'id'        => $post->ID,
      'title'     => get_the_title($post),
      'link'      => get_permalink($post),
      'type'      => get_post_type($post),
      'thumbnail' => get_the_post_thumbnail_url($post, 'medium_large'),
      'meta'      => [
        'event_date' => get_post_meta($post->ID, 'event_date', true),
        'location'   => get_post_meta($post->ID, 'location', true),
      ],
    ];
  }, $results->posts);
}
?>

<div 
  id="search-root" 
  data-query="<?php echo esc_attr(get_search_query()); ?>" 
  data-results='<?php echo wp_json_encode(sb_get_search_results(), JSON_HEX_TAG); ?>'>
</div>

<?php get_footer(); ?>
