<?php
/**
 * Template Name: Search Page
 */

get_header();
?>

<div 
  id="search-root" 
  data-query="<?php echo esc_attr(get_search_query()); ?>" 
  data-results='<?php echo esc_attr(json_encode(sb_get_search_results())); ?>'>
</div>

<?php
get_footer();

/**
 * Helper: get all search results
 */
function sb_get_search_results() {
  $query = get_search_query();

  $args = [
    's' => $query,
    'post_type' => ['post', 'event', 'podcast'], // Add any custom post types here
    'posts_per_page' => 12,
  ];

  $results = new WP_Query($args);

  return array_map(function($post) {
    return [
      'id'        => $post->ID,
      'title'     => get_the_title($post),
      'link'      => get_permalink($post),
      'type'      => get_post_type($post),
      'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
      'meta'      => [
        // Only include specific meta fields you need (adjust as needed)
        'event_date' => get_post_meta($post->ID, 'event_date', true),
        'location'   => get_post_meta($post->ID, 'location', true),
      ],
    ];
  }, $results->posts);
}
