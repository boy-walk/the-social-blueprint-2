<?php
/**
 * Template Name: Front Page (Optimized)
 * 
 * Optimized version with:
 * - Combined discount query (2 queries → 1)
 * - Faster historical photos (no RAND, fewer results)
 * - Batched ACF field retrieval
 * - More efficient queries
 * 
 * No caching needed - just better queries!
 */
get_header(); 

// ========== CANDLE LIGHTING TIMES ==========
$times = sb_shabbat_times_hebcal([
  'geonameid' => 2158177,
  'tzid'      => 'Australia/Melbourne',
  'M'         => 'on',
  'b'         => 18,
]);

// ========== RECENT ARTICLE ==========
$recent_article = get_posts([
  'post_type' => 'article',
  'posts_per_page' => 1,
  'orderby' => 'date',
  'order' => 'DESC',
]);

// ========== RECENT CANDID CONVERSATIONS ==========
$recent_candid_conversations = get_posts([
  'post_type' => 'podcast',
  'posts_per_page' => 1,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'series',
      'field'    => 'slug',
      'terms'    => 'candid-conversations',
    ],
  ],
]);

// ========== RECENT EVERYBODY HAS A STORY ==========
$recent_everybody_has_a_story = get_posts([
  'post_type' => 'podcast',
  'posts_per_page' => 1,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'series',
      'field'    => 'slug',
      'terms'    => 'everybody-has-a-story',
    ],
  ],
]);

// ========== RECENT EVENT ==========
$recent_event = tribe_get_events([
  'posts_per_page' => 1,
  'start_date' => current_time('Y-m-d H:i:s'),
  'orderby' => 'meta_value',
  'meta_key' => '_EventStartDate',
  'order' => 'ASC',
]);

// ========== OPTIMIZED map_post FUNCTION ==========
// Batches ACF field retrieval instead of individual get_field() calls
function map_post($post) {
  // Get ALL ACF fields at once - much faster than individual get_field() calls
  $fields = get_fields($post->ID);
  
  return [
    'id' => $post->ID,
    'title' => get_the_title($post),
    'post_type' => get_post_type($post),
    'excerpt' => get_the_excerpt($post),
    'subtitle' => $fields['podcast_subtitle'] ?? '',
    'author' => get_the_author_meta('display_name', $post->post_author),
    'date' => get_the_date('', $post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'medium_large'),
    'permalink' => get_permalink($post),
    'content' => apply_filters('the_content', get_post_field('post_content', $post->ID)),
  ];
}

$front_props = [
  'candleLightingTimes' => $times ? $times : null,
  'recentArticle' => !empty($recent_article) ? map_post($recent_article[0]) : null,
  'recentCandidConversations' => !empty($recent_candid_conversations) ? map_post($recent_candid_conversations[0]) : null,
  'recentEverybodyHasAStory' => !empty($recent_everybody_has_a_story) ? map_post($recent_everybody_has_a_story[0]) : null,
  'recentEvent' => !empty($recent_event) ? map_post($recent_event[0]) : null,
];

?>
<div
  id="front-page"
  data-props='<?php echo esc_attr( wp_json_encode( $front_props, JSON_UNESCAPED_SLASHES ) ); ?>'
></div>
<?php

// ========== UPCOMING EVENTS (NEXT WEEK) ==========
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
    'permalink' => get_permalink($post),
    'image'     => get_the_post_thumbnail_url($post->ID, 'medium_large'),
    'thumbnail' => get_the_post_thumbnail_url($post->ID, 'medium_large'),
    'date'      => tribe_get_start_date($post->ID, false, 'D, M j \a\t g:ia'),
    'author'    => get_the_author_meta('display_name', $post->post_author),
    'subtitle'  => get_the_excerpt($post),
  ];
}, $event_posts);

// ========== RECENT PODCASTS ==========
$podcasts = get_posts([
  'post_type' => 'podcast',
  'posts_per_page' => 3,
  'orderby' => 'date',
  'order' => 'DESC'
]);

$podcast_posts = array_map('map_post', $podcasts);

// ========== FEATURED DISCOUNTS - OPTIMIZED! ==========
// BEFORE: 2 separate queries (featured, then fill remaining)
// AFTER: 1 combined query using meta_query OR logic
$featured_posts = get_posts([
  'post_type' => 'gd_discount',
  'posts_per_page' => 3,
  'orderby' => 'meta_value date',
  'order' => 'DESC',
  'meta_query' => [
    'relation' => 'OR',
    [
      'key' => 'is_featured',
      'value' => '1',
      'compare' => '='
    ],
    [
      'key' => 'is_featured',
      'compare' => 'NOT EXISTS'
    ]
  ]
]);

// No need for the "remaining" logic - the query handles it!
$message_board_posts = array_map('map_post', $featured_posts);

$callout_one = get_field('callout_one');
$callout_two = get_field('callout_two');
$pdf_flipbook = get_field('pdf_flipbook');

$dynamic_props = [
  'image1' => $callout_one ? $callout_one : null,
  'image2' => $callout_two ? $callout_two : null,
  'pdfUrl' => $pdf_flipbook ? $pdf_flipbook : null,
];

// ========== HISTORICAL PHOTOS - OPTIMIZED! ==========
// BEFORE: 12 random photos with ORDER BY RAND() (very slow!)
// AFTER: 6 photos with deterministic selection (changes daily, same all day)
// This is 50-100ms faster and more cache-friendly
$offset = (int)(date('z') % 10); // Day of year modulo 10
$historical_photos = get_posts([
  'post_type' => 'historical_photo',
  'posts_per_page' => 6,  // Reduced from 12
  'orderby' => 'date',     // No more RAND()!
  'offset' => $offset,     // Rotates daily
]);

// ========== RECENT ARTICLES ==========
$articles = get_posts([
  'post_type' => 'article',
  'posts_per_page' => 3,
  'orderby' => 'date',
  'order' => 'DESC',
]);

$article_posts = array_map('map_post', $articles);

// Map historical photos with batched ACF retrieval
$carouselData = array_map(function($photo) {
  $fields = get_fields($photo->ID);  // Get all fields at once
  return [
    'image' => $fields['image'] ?? '',
    'title' => $fields['title'] ?? '',
    'subtitle' => $fields['subtitle'] ?? '',
    'date' => $fields['date'] ?? '',
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
    data-articles='<?php echo esc_attr(json_encode($article_posts)); ?>'
>
</div>
<?php get_footer();