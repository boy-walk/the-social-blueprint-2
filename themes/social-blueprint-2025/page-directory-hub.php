<?php
/**
 * Template Name: Directory
 */

get_header();

$cost_of_living = new WP_Query([
  'post_type' => 'gd_cost_of_living',
  'posts_per_page' => 16,
  'orderby' => 'date',
  'order' => 'DESC',
]);

$cost_of_living_posts = $cost_of_living->posts;

$contact_lists = new WP_Query([
  'post_type' => 'directory',
  'posts_per_page' => 16,
  'orderby' => 'date',
  'order' => 'DESC',
]);

$contact_list_posts = $contact_lists->posts;

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
  'costOfLiving' => array_map('map_post', $cost_of_living_posts),
  'contactLists' => array_map('map_post', $contact_list_posts),
];
?>

<div
    class="tsb-mount"
    id="directory-hub-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
