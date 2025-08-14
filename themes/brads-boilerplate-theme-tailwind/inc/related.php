<?php
// inc/related.php
if ( ! function_exists('sb_get_related_by_topic_tags') ) {
  function sb_get_related_by_topic_tags( $post_id, $limit = 3 ) {
    global $wpdb;
    $ttids = wp_get_object_terms( $post_id, 'topic_tag', ['fields' => 'tt_ids'] );
    if ( is_wp_error( $ttids ) ) $ttids = [];
    $ttids = array_map( 'intval', $ttids );

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
      'post_type'          => ['tribe_events', 'podcast', 'article', 'directory', 'resource'],
      'post_status'         => 'publish',
      'posts_per_page'      => $limit,
      'post__not_in'        => [ $post_id ],
      'suppress_filters'    => false,
      'no_found_rows'       => true,
      'ignore_sticky_posts' => true,
    ]);
    remove_filter( 'posts_clauses', $filter, 10 );

    if ( count( $hits ) < $limit ) {
      $fill = get_posts([
        'post_type'          => ['tribe_events', 'podcast', 'article', 'directory', 'resource'],
        'post_status'         => 'publish',
        'posts_per_page'      => $limit - count( $hits ),
        'post__not_in'        => array_merge( [ $post_id ], wp_list_pluck( $hits, 'ID' ) ),
        'orderby'             => 'rand',
        'no_found_rows'       => true,
        'ignore_sticky_posts' => true,
      ]);
      $hits = array_merge( $hits, $fill );
    }

    return $hits;
  }
}
