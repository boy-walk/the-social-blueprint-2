
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
get_header(); ?>

<main id="primary" class="site-main">
<div>
  <div id="front-page"></div>
  <?php
function map_post($post) {
  return [
    'id' => $post->ID,
    'title' => get_the_title($post),
    'post_type' => get_post_type($post),
    'excerpt' => get_the_excerpt($post),
    'author' => get_the_author_meta('display_name', $post->post_author),
    'date' => get_the_date('', $post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'medium_large'),
    'permalink' => get_permalink($post),
  ];
}

$event_posts = get_posts([
  'post_type' => 'tribe_events',
  'posts_per_page' => 3,
  'orderby' => 'meta_value',
  'meta_key' => '_EventStartDate',
  'order' => 'ASC',
  'meta_query' => [
    [
      'key' => '_EventStartDate',
      'value' => current_time('Y-m-d H:i:s'),
      'compare' => '>=',
      'type' => 'DATETIME'
    ]
  ]
]);

$events = array_map('map_post', $event_posts);

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
?>


<div id="section-one"
     data-events='<?php echo esc_attr(json_encode($events)); ?>'
     data-podcasts='<?php echo esc_attr(json_encode($podcast_posts)); ?>'
     data-message-board-posts='<?php echo esc_attr(json_encode($message_board_posts)); ?>'
    data-dynamic-props='<?php echo esc_attr(json_encode($dynamic_props)); ?>'
    data-historical-photos='<?php echo esc_attr(json_encode($carouselData)); ?>'
>
</div>
<!-- <?php
$post = get_posts([
  'post_type' => 'sponsorship-banner',
  'posts_per_page' => 1,
  'orderby' => 'date',
  'order' => 'DESC'
])[0];

$banner_data = [
  'imgSrc'       => get_field('banner_image', $post->ID),
  'enabled'     => get_field('display_banner', $post->ID), 
];
?>
<div id="sponsorship-banner"
     data-banner='<?php echo esc_attr(json_encode($banner_data)); ?>'>
</div> -->

<?php get_footer();
