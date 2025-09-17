<?php
/**
 * Template Name: Stories & Interviews
 */

get_header();

$everybody_has_a_story_args = new WP_Query([
  'post_type' => 'podcast',
  'posts_per_page' => 15,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'series',
      'field' => 'slug',
      'terms' => 'everybody-has-a-story',
    ]
  ],
]);
$everyBodyHasAStory = $everybody_has_a_story_args->posts;

$candid_conversations_args = new WP_Query([
  'post_type' => 'podcast',
  'posts_per_page' => 15,
  'tax_query' => [
    [
      'taxonomy' => 'series',
      'field' => 'slug',
      'terms' => 'candid-conversations',
    ]
  ],
]);
$candidConversations = $candid_conversations_args->posts;


$blueprint_stories_args = [
  'post_type' => 'article',
  'posts_per_page' => 12,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'category',
      'field' => 'slug',
      'terms' => 'blueprint-stories',
    ]
  ],
];

$blueprint_stories = get_posts($blueprint_stories_args);

$holocaust_stories_args = [
  'post_type' => 'article',
  'posts_per_page' => 12,
  'orderby' => 'date',
  'order' => 'DESC',
  'tax_query' => [
    [
      'taxonomy' => 'category',
      'field' => 'slug',
      'terms' => 'holocaust-stories',
    ]
    ],
  ];

$holocaust_stories = get_posts($holocaust_stories_args);

$breadcrumbs = sbp_build_breadcrumbs();


$props = [
  'everyBodyHasAStory' => array_map(function($post) {
    return [
      'id' => $post->ID,
      'title' => get_the_title($post),
      'link' => get_permalink($post),
      'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
      'post_type' => get_post_type($post),
      'subtitle' => get_field('podcast_subtitle', $post->ID) ?: '',
    ];
  }, $everyBodyHasAStory),
  
  'candidConversations' => array_map(function($post) {
    return [
      'id' => $post->ID,
      'title' => get_the_title($post),
      'link' => get_permalink($post),
      'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
      'post_type' => get_post_type($post),
      'subtitle' => get_field('podcast_subtitle', $post->ID) ?: '',
    ];
  }, $candidConversations),

  'blueprintStories' => array_map(function($post) {
    return [
      'id' => $post->ID,
      'title' => get_the_title($post),
      'link' => get_permalink($post),
      'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
      'post_type' => get_post_type($post),
      'subtitle' => get_field('subtitle', $post->ID) ?: '',
    ];
  }, $blueprint_stories),

  'holocaustStories' => array_map(function($post) {
    return [
      'id' => $post->ID,
      'title' => get_the_title($post),
      'link' => get_permalink($post),
      'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
      'post_type' => get_post_type($post),
      'subtitle' => get_field('subtitle', $post->ID) ?: '',
    ];
  }, $holocaust_stories),
  'breadcrumbs'  => $breadcrumbs,
];

?>

<div
    class="tsb-mount"
    id="stories-and-interviews-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
