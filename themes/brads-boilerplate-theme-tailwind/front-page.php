
<?php
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
$event_posts = get_posts([
  'post_type' => 'tribe_events',
  'posts_per_page' => 6,
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

$events = array_map(function ($post) {
  return [
    'title' => get_the_title($post),
    'date' => tribe_get_start_date($post, false, 'D, M j @ g:ia'),
    'location' => tribe_get_venue($post),
    'imageUrl' => get_the_post_thumbnail_url($post, 'medium_large'),
    'readMoreUrl' => get_permalink($post),
    'isFeatured' => get_post_meta($post->ID, '_is_featured', true) === '1'
  ];
}, $event_posts);
?>

<div id="section-one"
     data-events='<?php echo esc_attr(json_encode($events)); ?>'>
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
</main>

<?php get_footer();
