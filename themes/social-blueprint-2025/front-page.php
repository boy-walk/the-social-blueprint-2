<?php
/**
 * Template Name: Front Page
 */
/** 
 * The site front page template.
 * 
 * Place in your theme root.  WordPress loads this automatically
 * for the site root URL.
 */
get_header(); 

$times = sb_shabbat_times_hebcal([
  'geonameid' => 2158177,
  'tzid'      => 'Australia/Melbourne',
  'M'         => 'on',
  'b'         => 18,
]);

$recent_message_board = get_posts([
  'post_type' => 'gd_discount',
  'posts_per_page' => 1,
  'orderby' => 'date',
  'order' => 'DESC',
]);

$recent_podcast = get_posts([
  'post_type' => 'podcast',
  'posts_per_page' => 1,
  'orderby' => 'date',
  'order' => 'DESC',
]);

$recent_article = get_posts([
  'post_type' => 'article',
  'posts_per_page' => 1,
  'orderby' => 'date',
  'order' => 'DESC',
]);

$recent_event = tribe_get_events([
  'posts_per_page' => 1,
  'start_date' => current_time('Y-m-d H:i:s'),
  'orderby' => 'meta_value',
  'meta_key' => '_EventStartDate',
  'order' => 'ASC',
]);

function map_post($post) {
  return [
    'id' => $post->ID,
    'title' => get_the_title($post),
    'post_type' => get_post_type($post),
    'excerpt' => get_the_excerpt($post),
    'subtitle' => get_field('podcast_subtitle', $post->ID),
    'author' => get_the_author_meta('display_name', $post->post_author),
    'date' => get_the_date('', $post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'medium_large'),
    'permalink' => get_permalink($post),
  ];
}

$front_props = [
  'candleLightingTimes' => $times ? $times : null,
  'recentMessageBoard' => !empty($recent_message_board) ? map_post($recent_message_board[0]) : null,
  'recentPodcast' => !empty($recent_podcast) ? map_post($recent_podcast[0]) : null,
  'recentArticle' => !empty($recent_article) ? map_post($recent_article[0]) : null,
  'recentEvent' => !empty($recent_event) ? map_post($recent_event[0]) : null,
];

?>
<div
  id="front-page"
  data-props='<?php echo esc_attr( wp_json_encode( $front_props, JSON_UNESCAPED_SLASHES ) ); ?>'
></div>
  <?php


$event_posts = tribe_get_events([
  'posts_per_page' => 3,
  'start_date' => current_time('Y-m-d H:i:s'),
  'end_date' => date('Y-m-d H:i:s', strtotime('+1 week')),
  'tribeHideRecurrence' => true,
  'eventDisplay' => 'list',
  'orderby' => 'meta_value',
  'order' => 'ASC',
]);


$events = array_map(function($post) {
  return [
    'id'        => $post->ID,
    'title'     => get_the_title($post),
    'post_type' => get_post_type($post),
    'permalink'      => get_permalink($post),
    'image'     => get_the_post_thumbnail_url($post->ID, 'medium_large'),
    'thumbnail' => get_the_post_thumbnail_url($post->ID, 'medium_large'),
    'date'  => tribe_get_start_date($post->ID, false, 'D, M j \a\t g:ia'),
    'author'    => get_the_author_meta('display_name', $post->post_author),
    'subtitle' => get_the_excerpt($post),
  ];
}, $event_posts);

$podcasts = get_posts([
  'post_type' => 'podcast',
  'posts_per_page' => 3,
  'orderby' => 'date',
  'order' => 'DESC'
]);


$podcast_posts = array_map('map_post', $podcasts);

$message_board_posts = get_posts([
  'post_type' => 'gd_discount',
  'posts_per_page' => 3,
  'orderby' => 'date',
  'order' => 'DESC',
]);
$message_board_posts = array_map('map_post', $message_board_posts);

$callout_one = get_field('callout_one');
$callout_two = get_field('callout_two');
$pdf_flipbook = get_field('pdf_flipbook');

$dynamic_props = [
  'image1' => $callout_one ? $callout_one : null,
  'image2' => $callout_two ? $callout_two : null,
  'pdfUrl' => $pdf_flipbook ? $pdf_flipbook : null,
];

$historical_photos = get_posts([
  'post_type' => 'historical_photo',
  'posts_per_page' => 12,
  'orderby' => 'rand',
]);


$carouselData = array_map(function($photo) {
  return [
    'image' => get_field('image', $photo->ID),
    'title' => get_field('title', $photo->ID),
    'subtitle' => get_field('subtitle', $photo->ID),
    'date' => get_field('date', $photo->ID),
  ];
}, $historical_photos);

$is_enabled = get_field('display_banner');
$banner_image = get_field('banner_image');
$href = get_field('link');
$banner_data = [
  'imgSrc' => $banner_image ? $banner_image : null,
  'enabled' => $is_enabled,
  'href' => $href ? $href : null,
];
?>

<div id="section-one"
    data-events='<?php echo esc_attr(json_encode($events)); ?>'
    data-podcasts='<?php echo esc_attr(json_encode($podcast_posts)); ?>'
    data-message-board-posts='<?php echo esc_attr(json_encode($message_board_posts)); ?>'
    data-dynamic-props='<?php echo esc_attr(json_encode($dynamic_props)); ?>'
    data-historical-photos='<?php echo esc_attr(json_encode($carouselData)); ?>'
    data-sponsorship-banner='<?php echo esc_attr(json_encode($banner_data)); ?>'
>
</div>
<?php get_footer();
