<?php
// inc/related.php
if ( ! function_exists('sb_get_related_by_topic_tags') ) {
  /**
   * Related content by shared terms (topic_tag, theme, ...), TEC-aware.
   */
  function sb_get_related_by_topic_tags(
    $post_id,
    $limit         = 3,
    $hide_recurring = true,
    $post_types     = ['tribe_events'],
    $match_taxes    = ['topic_tag','theme']
  ) {
    global $wpdb;

    $post_types = (array) $post_types;

    // Build both tt_ids (for scoring) and term_ids (for tax_query)
    $all_ttids = [];
    $tax_ids   = [];
    foreach ( (array) $match_taxes as $tax ) {
      $ids = wp_get_object_terms( $post_id, $tax, ['fields' => 'ids'] );
      if ( ! is_wp_error($ids) && $ids ) {
        $tax_ids[$tax] = array_map('intval', $ids);
      }
      $tts = wp_get_object_terms( $post_id, $tax, ['fields' => 'tt_ids'] );
      if ( ! is_wp_error($tts) && $tts ) {
        $all_ttids = array_merge($all_ttids, array_map('intval', $tts));
      }
    }
    $all_ttids = array_values(array_unique($all_ttids));

    // Score by number of matching terms, but DO NOT clobber existing SQL
    $rel_filter = function( $clauses, $q = null ) use ( $wpdb, $all_ttids ) {
      if ( empty($all_ttids) ) return $clauses;

      $in = implode(',', $all_ttids);
      $clauses['join']   .= " INNER JOIN {$wpdb->term_relationships} tr_rel ON tr_rel.object_id = {$wpdb->posts}.ID";
      $clauses['where']  .= " AND tr_rel.term_taxonomy_id IN ($in)";
      $clauses['fields'] .= ", COUNT(DISTINCT tr_rel.term_taxonomy_id) AS rel_score";

      // append groupby
      $clauses['groupby'] = trim(
        $clauses['groupby']
          ? "{$clauses['groupby']}, {$wpdb->posts}.ID"
          : "{$wpdb->posts}.ID"
      );

      // prepend our score to orderby, keep existing ordering after it
      $clauses['orderby'] = "rel_score DESC" .
        ( $clauses['orderby'] ? ", {$clauses['orderby']}" : ", {$wpdb->posts}.post_date DESC" );

      return $clauses;
    };
    add_filter( 'posts_clauses', $rel_filter, 10, 2 );

    $out = [];

    // -------- Events via TEC (so recurrence hiding works) --------
    if ( function_exists('tribe_get_events') && in_array('tribe_events', $post_types, true) ) {
      // Tax filter: ask TEC/WP for posts sharing ANY terms across chosen taxonomies
      $tax_query = [];
      if ( ! empty($tax_ids) ) {
        $tax_query['relation'] = 'OR';
        foreach ( $tax_ids as $tax => $ids ) {
          if ( ! empty($ids) ) {
            $tax_query[] = [
              'taxonomy' => $tax,
              'field'    => 'term_id',
              'terms'    => $ids,
              'operator' => 'IN',
            ];
          }
        }
      }

      $args = [
        'post_status'       => 'publish',
        'posts_per_page'    => $limit,
        'paged'             => 1,
        'post__not_in'      => [ $post_id ],
        'eventDisplay'      => 'custom',
        'start_date'        => '1970-01-01 00:00:00',
        'end_date'          => '2100-01-01 00:00:00',
        'suppress_filters'  => false, // run our posts_clauses for scoring
      ];
      if ( ! empty($tax_query) ) {
        $args['tax_query'] = $tax_query;
      }
      if ( $hide_recurring ) {
        $args['hide_subsequent_recurrences'] = true;
        $args['tribeHideRecurrence']         = true; // legacy
      }

      $q = tribe_get_events( $args, true ); // WP_Query
      $out = $q->posts;

      // Fallback fill if we didn’t get enough (e.g., no overlapping terms)
      if ( count($out) < $limit ) {
        // Temporarily remove the scoring filter and any tax_query to grab more
        remove_filter( 'posts_clauses', $rel_filter, 10 );

        $fill_q = tribe_get_events( [
          'post_status'       => 'publish',
          'posts_per_page'    => $limit - count($out),
          'post__not_in'      => array_merge( [ $post_id ], wp_list_pluck( $out, 'ID' ) ),
          'eventDisplay'      => 'custom',
          'start_date'        => '1970-01-01 00:00:00',
          'end_date'          => '2100-01-01 00:00:00',
          'hide_subsequent_recurrences' => $hide_recurring,
          'tribeHideRecurrence'         => $hide_recurring,
          'orderby'           => 'event_date',
          'order'             => 'DESC',
        ], true );

        $out = array_merge( $out, $fill_q->posts );

        // Put the filter back for any callers that expect it later
        add_filter( 'posts_clauses', $rel_filter, 10, 2 );
      }
    }

    // If you later include non-events in $post_types, you can mirror the same
    // “tax_query + scoring + fallback” pattern with get_posts() here.

    // De-dup & cap
    $seen = [];
    $final = [];
    foreach ( $out as $p ) {
      if ( isset($seen[$p->ID]) ) continue;
      $seen[$p->ID] = true;
      $final[] = $p;
      if ( count($final) >= $limit ) break;
    }

    // Clean up our filter
    remove_filter( 'posts_clauses', $rel_filter, 10 );

    return $final;
  }
}
