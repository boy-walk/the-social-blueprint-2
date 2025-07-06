<?php
/**
 * Template for rendering single podcast posts
 */

get_header();

// Prepare ACF fields or standard post data
$post_id = get_the_ID();
$video_url = get_field('podcast_video_url', $post_id);
$subtitle = get_field('podcast_subtitle', $post_id);
$content_blocks = get_field('content_sections', $post_id) ?: [];
$tags = get_field('tags', $post_id) ?: [];

$tag_names = [];

foreach ($tags as $tag_id) {
  $term = get_term($tag_id);
  if ($term && !is_wp_error($term)) {
    $tag_names[] = $term->name;
  }
}


// Retrieve 3 other podcasts for `more interviews` section
$more_interviews = new WP_Query([
     'post_type' => 'podcast',
     'posts_per_page' => 3,
     'post__not_in' => [$post_id], // Exclude current post
     'orderby' => 'rand', // Random order
]);
if ($more_interviews->have_posts()) {
    $more_interviews_data = [];
    while ($more_interviews->have_posts()) {
        $more_interviews->the_post();
        $more_interviews_data[] = [
            'id' => get_the_ID(),
            'title' => get_the_title(),
            'link' => get_permalink(),
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
     data-subtitle="<?php echo esc_attr($subtitle); ?>"
     data-video-url="<?php echo esc_url($video_url); ?>"
     data-tags="<?php echo esc_attr(json_encode($tag_names)); ?>"
     data-sections="<?php echo esc_attr(json_encode($content_blocks)); ?>"
     data-more-interviews='<?php echo esc_attr(json_encode($more_interviews_data)); ?>'
     >
</div>

<?php get_footer(); ?>
