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
$tags = wp_get_post_tags($post_id, ['fields' => 'names']);

?>

<div id="podcast-root"
     data-title="<?php echo esc_attr(get_the_title()); ?>"
     data-subtitle="<?php echo esc_attr($subtitle); ?>"
     data-video-url="<?php echo esc_url($video_url); ?>"
     data-tags="<?php echo esc_attr(json_encode($tags)); ?>"
     data-sections="<?php echo esc_attr(json_encode($content_blocks)); ?>">
</div>

<?php get_footer(); ?>
