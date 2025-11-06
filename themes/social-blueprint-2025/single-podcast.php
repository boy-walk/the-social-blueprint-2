<?php
/**
 * Template for rendering single podcast posts
 */

get_header();

$post_id = get_the_ID();

$breadcrumbs = sbp_build_breadcrumbs();

// ACF fields you already use
$video_url      = get_field('podcast_video_url', $post_id);
$subtitle       = get_field('podcast_subtitle', $post_id);
$content_blocks = get_field('content_sections', $post_id) ?: [];

// (kept for backward-compat) ACF 'tags' field → array of term IDs?
$tags      = get_field('tags', $post_id) ?: [];
$tag_names = [];
foreach ($tags as $tag_id) {
  $term = get_term($tag_id);
  if ($term && !is_wp_error($term)) {
    $tag_names[] = $term->name;
  }
}

// -------- Author (rich object) --------
$author_id = (int) get_post_field('post_author', $post_id);

$author_name = get_the_author_meta( 'display_name', $author_id );

$uwp_avatar_id = get_user_meta($author_id, 'uwp_profile_photo', true);
$avatar_url = $uwp_avatar_id ? wp_get_attachment_url($uwp_avatar_id) : get_avatar_url($author_id, ['size' => 96]);

$author_obj = [
  'id'     => $author_id,
  'name'   => $author_name,
  'url'    => get_author_posts_url($author_id),
  'avatar' => $avatar_url,
];

$terms = get_the_terms( $post->ID, ['topic_tag', 'people_tag', 'location_tag', 'audience_tag', 'theme', 'series'] ); 
// If terms are not empty, map them to an array of names
if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
  $terms = array_map( function( $term ) {
    return $term->name;
  }, $terms );
} else {
  $terms = [];
}

// -------- Retrieve 3 other podcasts for "more interviews" --------
$more_interviews = new WP_Query([
  'post_type'      => 'podcast',
  'posts_per_page' => 12,
  'post__not_in'   => [$post_id],
  'orderby'        => 'rand',
]);

if ($more_interviews->have_posts()) {
  $more_interviews_data = [];
  while ($more_interviews->have_posts()) {
    $more_interviews->the_post();
    $more_interviews_data[] = [
      'id'        => get_the_ID(),
      'title'     => get_the_title(),
      'link'      => get_permalink(),
      'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
      'date'      => get_the_date('', get_the_ID()),
      'author'    => get_the_author_meta('display_name'),
      'post_type' => get_post_type(),
    ];
  }
  wp_reset_postdata();
} else {
  $more_interviews_data = [];
}

$people_tags = get_terms([
  'taxonomy' => 'people_tag',
  'hide_empty' => false, // Include terms with no posts
  'orderby' => 'name',
  'order' => 'ASC',
]);

$related_content = sb_get_related_by_topic_tags( get_the_ID(), 3, true, ['podcast'], ['topic_tag', 'theme'] );
?>

<div id="podcast-root"
     data-title="<?php echo esc_attr(get_the_title()); ?>"
     data-date="<?php echo esc_attr(get_the_date('j F Y')); ?>"
     data-subtitle="<?php echo esc_attr($subtitle); ?>"
     data-video-url="<?php echo esc_url($video_url); ?>"
     data-sections="<?php echo esc_attr( wp_json_encode($content_blocks) ); ?>"
     data-more-interviews='<?php echo esc_attr( wp_json_encode($more_interviews_data) ); ?>'
     data-author-obj='<?php echo esc_attr( wp_json_encode($author_obj) ); ?>'
     data-tags='<?php echo esc_attr( wp_json_encode($terms) ); ?>'
     data-related-content='<?php echo esc_attr( wp_json_encode(array_map(function($post) {
       return [
         'id'        => $post->ID,
         'title'     => get_the_title($post),
         'link'      => get_permalink($post),
         'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
         'subtitle' => get_the_excerpt($post),
       ];
     }, $related_content)) ); ?>'
     data-breadcrumbs='<?php echo esc_attr( wp_json_encode($breadcrumbs) ); ?>'
     data-interviewees='<?php echo esc_attr( wp_json_encode(array_map(function($term) {
       return [
         'id'   => $term->term_id,
         'name' => $term->name,
         'link' => get_term_link($term),
       ];
     }, $people_tags)) ); ?>'
>
</div>

<?php get_footer(); ?>
