<?php
/**
 * Template Name: Stories & Interviews
 */

get_header();

if ( ! function_exists( 'tsb_map_post_for_slider' ) ) {
  function tsb_map_post_for_slider( $p ) {
    $author_id = (int) get_post_field( 'post_author', $p );
    return [
      'id'        => $p->ID,
      'title'     => html_entity_decode( get_the_title( $p ), ENT_QUOTES, 'UTF-8' ),
      'thumbnail' => get_the_post_thumbnail_url( $p, 'large' ),
      'link'      => get_permalink( $p ),
      'type'      => get_post_type( $p ),
      'date'      => get_the_date( 'c', $p ),
      'meta'      => [
        'author' => get_the_author_meta( 'display_name', $author_id ),
      ],
    ];
  }
}

if ( ! function_exists( 'tsb_get_topic_posts' ) ) {
  function tsb_get_topic_posts( $topic_slug, $post_types, $per_page = 12 ) {
    $q = new WP_Query( [
      'post_type'           => (array) $post_types,
      'post_status'         => 'publish',
      'posts_per_page'      => $per_page,
      'ignore_sticky_posts' => true,
      'no_found_rows'       => true,
      'orderby'             => 'date',
      'order'               => 'DESC',
      'tax_query'           => [
        [
          'taxonomy' => 'topic_tag',
          'field'    => 'slug',
          'terms'    => $topic_slug,
        ]
      ],
    ] );

    return array_map( 'tsb_map_post_for_slider', $q->posts );
  }
}

/**
 * Topic → post type rules
 * - First two rows (podcast)
 * - Next two rows (article)
 */
$everyBodyHasAStory = tsb_get_topic_posts( 'everybody-has-a-story', ['podcast'], 12 );
$candidConversations = tsb_get_topic_posts( 'candid-conversations',  ['podcast'], 12 );
$blueprintStories     = tsb_get_topic_posts( 'blueprint-stories',     ['article'], 12 );
$holocaustStories     = tsb_get_topic_posts( 'holocaust-stories',     ['article'], 12 );

$props = [
  'everyBodyHasAStory' => $everyBodyHasAStory,
  'candidConversations'=> $candidConversations,
  'blueprintStories'   => $blueprintStories,
  'holocaustStories'   => $holocaustStories,
];

?>

<div
    class="tsb-mount"
    id="stories-and-interviews-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) ); ?>'
  >
</div>

<?php get_footer(); ?>
