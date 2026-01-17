<?php
/**
 * Template Name: Stories & Interviews
 */

get_header();

$podcast_series = get_terms([
  'taxonomy' => 'series',
  'hide_empty' => true,
  'orderby' => 'name',
  'order' => 'ASC',
]);

$series_data = [];

foreach ($podcast_series as $series) {
  $series_posts = get_posts([
    'post_type' => 'podcast',
    'posts_per_page' => 15,
    'orderby' => 'date',
    'order' => 'DESC',
    'tax_query' => [
      [
        'taxonomy' => 'series',
        'field' => 'term_id',
        'terms' => $series->term_id,
      ]
    ],
  ]);

  if (empty($series_posts)) {
    continue;
  }

  $series_data[] = [
    'slug' => $series->slug,
    'name' => $series->name,
    'description' => $series->description ?: '',
    'viewAllUrl' => '/podcasts/?series=' . $series->slug,
    'posts' => array_map(function($post) {
      return [
        'id' => $post->ID,
        'title' => get_the_title($post),
        'link' => get_permalink($post),
        'thumbnail' => get_the_post_thumbnail_url($post, 'large'),
        'post_type' => get_post_type($post),
        'subtitle' => get_field('podcast_subtitle', $post->ID) ?: get_the_excerpt($post),
        'content' => apply_filters('the_content', get_post_field('post_content', $post->ID)),
      ];
    }, $series_posts),
  ];
}

$blueprint_stories = get_posts([
  'post_type' => 'article',
  'posts_per_page' => 12,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'topic_tag',
      'field' => 'slug',
      'terms' => 'blueprint-stories',
    ]
  ],
]);

$holocaust_stories = get_posts([
  'post_type' => 'article',
  'posts_per_page' => 12,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'topic_tag',
      'field' => 'slug',
      'terms' => 'holocaust',
    ]
  ],
]);

$breadcrumbs = sbp_build_breadcrumbs();

$map_article = function($post) {
  return [
    'id' => $post->ID,
    'title' => get_the_title($post),
    'link' => get_permalink($post),
    'thumbnail' => get_the_post_thumbnail_url($post, 'large'),
    'post_type' => get_post_type($post),
    'subtitle' => get_field('subtitle', $post->ID) ?: get_the_excerpt($post),
    'content' => apply_filters('the_content', get_post_field('post_content', $post->ID)),
  ];
};

$props = [
  'podcastSeries' => $series_data,
  'blueprintStories' => array_map($map_article, $blueprint_stories),
  'holocaustStories' => array_map($map_article, $holocaust_stories),
  'breadcrumbs' => $breadcrumbs,
];

?>

<div
    class="tsb-mount"
    id="stories-and-interviews-root"
    data-props='<?php echo esc_attr(wp_json_encode($props)); ?>'
  >
</div>

<?php get_footer(); ?>