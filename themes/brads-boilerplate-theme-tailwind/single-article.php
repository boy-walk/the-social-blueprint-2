<?php
/**
 * Template for rendering single podcast posts
 */

get_header();

$post_id = get_the_ID();

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
$first = trim( get_the_author_meta( 'first_name', $author_id ) );
$last  = trim( get_the_author_meta( 'last_name', $author_id ) );

$author_name = $first || $last
  ? trim( $first . ' ' . $last )
  : get_the_author_meta( 'display_name', $author_id );

$author_obj = [
  'id'     => $author_id,
  'name'   => $author_name,
  'url'    => get_author_posts_url($author_id),
  'avatar' => get_avatar_url($author_id, ['size' => 96]),
  // add more if needed:
  // 'bio' => get_the_author_meta('description', $author_id),
];

$terms = get_the_terms( $post->ID, 'topic_tag' ); 
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
  'posts_per_page' => 3,
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
    ];
  }
  wp_reset_postdata();
} else {
  $more_interviews_data = [];
}
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
>
</div>

<?php get_footer(); ?>
