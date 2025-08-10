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

$uwp_avatar_id = get_user_meta($author_id, 'uwp_profile_photo', true);
$avatar_url = $uwp_avatar_id ? wp_get_attachment_url($uwp_avatar_id) : get_avatar_url($author_id, ['size' => 96]);

$author_obj = [
  'id'     => $author_id,
  'name'   => $author_name,
  'url'    => get_author_posts_url($author_id),
  'avatar' => $avatar_url,
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

function sb_get_related_by_topic_tags( $post_id, $limit = 3 ) {
  global $wpdb;

  $ttids = wp_get_object_terms( $post_id, 'topic_tag', ['fields' => 'tt_ids'] );
  if ( is_wp_error( $ttids ) ) $ttids = [];
  $ttids = array_map( 'intval', $ttids );
  $post_type = get_post_type( $post_id );

  // Try: require at least 1 overlapping tag, order by overlap count desc
  $filter = function( $clauses ) use ( $wpdb, $ttids ) {
      if ( empty( $ttids ) ) return $clauses;
      $in = implode( ',', $ttids );
      $clauses['join']   .= " INNER JOIN {$wpdb->term_relationships} tr ON tr.object_id = {$wpdb->posts}.ID";
      $clauses['where']  .= " AND tr.term_taxonomy_id IN ($in)";
      $clauses['fields'] .= ", COUNT(DISTINCT tr.term_taxonomy_id) AS rel_score";
      $clauses['groupby'] = "{$wpdb->posts}.ID";
      $clauses['orderby'] = "rel_score DESC, {$wpdb->posts}.post_date DESC";
      return $clauses;
  };

  add_filter( 'posts_clauses', $filter, 10, 1 );
  $hits = get_posts([
      'post_type'           => $post_type,
      'post_status'         => 'publish',
      'posts_per_page'      => $limit,
      'post__not_in'        => [ $post_id ],
      'suppress_filters'    => false,
      'no_found_rows'       => true,
      'ignore_sticky_posts' => true,
  ]);
  remove_filter( 'posts_clauses', $filter, 10 );

  // Fill remainder with recent posts if we didn’t reach the limit
  if ( count( $hits ) < $limit ) {
      $fill = get_posts([
          'post_type'           => $post_type,
          'post_status'         => 'publish',
          'posts_per_page'      => $limit - count( $hits ),
          'post__not_in'        => array_merge( [ $post_id ], wp_list_pluck( $hits, 'ID' ) ),
          'orderby'             => 'date',
          'order'               => 'DESC',
          'no_found_rows'       => true,
          'ignore_sticky_posts' => true,
      ]);
      $hits = array_merge( $hits, $fill );
  }

  return $hits;
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

$related_content = sb_get_related_by_topic_tags( get_the_ID(), 3 );
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
     data-related-content='<?php echo esc_attr( wp_json_encode(array_map(function($post) {
       return [
         'id'        => $post->ID,
         'title'     => get_the_title($post),
         'link'      => get_permalink($post),
         'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
       ];
     }, $related_content)) ); ?>'
>
</div>

<?php get_footer(); ?>
