<?php
/**
 * Template Name: Search Page
 */

get_header();

// Use WordPress's default search query (this will use Relevanssi if it's active)
global $wp_query;

$results = array_map(function($post) {
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
}, $wp_query->posts);

?>

<div 
  id="search-root" 
  data-query="<?php echo esc_attr(get_search_query()); ?>" 
  data-results='<?php echo wp_json_encode($results, JSON_HEX_TAG); ?>'>
</div>

<?php get_footer(); ?>