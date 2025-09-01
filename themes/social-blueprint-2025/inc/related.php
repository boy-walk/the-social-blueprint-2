<?php
if ( ! function_exists('sb_get_related_by_topic_tags') ) {
  /**
   * Related content by shared terms (topic_tag, theme, ...).
   * - Blends TEC events (tribe_events) and normal post types.
   * - Scores by # of matching terms across $match_taxes.
   *
   * @param int          $post_id
   * @param int          $limit
   * @param bool         $hide_recurring
   * @param array        $post_types     e.g. ['tribe_events','article','podcast']
   * @param array        $match_taxes    e.g. ['topic_tag','theme']
   * @return WP_Post[]                   up to $limit posts
   */
  function sb_get_related_by_topic_tags(
    $post_id,
    $limit          = 3,
    $hide_recurring = true,
    $post_types     = [],
    $match_taxes    = []
  ) {
    global $wpdb;

    $post_types = array_values( array_unique( (array) $post_types ) );

    // --- Build tax data: term_ids (for tax_query) and tt_ids (for scoring) ---
    $tax_ids_by_tax = [];
    $all_ttids = [];
    foreach ( (array) $match_taxes as $tax ) {
      $term_ids = wp_get_object_terms( $post_id, $tax, ['fields' => 'ids'] );
      if ( ! is_wp_error($term_ids) && $term_ids ) {
        $tax_ids_by_tax[$tax] = array_map('intval', $term_ids);
      }

      $tt_ids = wp_get_object_terms( $post_id, $tax, ['fields' => 'tt_ids'] );
      if ( ! is_wp_error($tt_ids) && $tt_ids ) {
        $all_ttids = array_merge( $all_ttids, array_map('intval', $tt_ids) );
      }
    }
    $all_ttids = array_values( array_unique( $all_ttids ) );

    // Build a WP-style tax_query (OR across the chosen taxonomies)
    $tax_query = [];
    if ( ! empty($tax_ids_by_tax) ) {
      $tax_query['relation'] = 'OR';
      foreach ( $tax_ids_by_tax as $tax => $ids ) {
        if ( $ids ) {
          $tax_query[] = [
            'taxonomy' => $tax,
            'field'    => 'term_id',
            'terms'    => $ids,
            'operator' => 'IN',
          ];
        }
      }
    }

    // --- Scoring filter: prefer posts sharing more of the same terms ---
    $rel_filter = function( $clauses ) use ( $wpdb, $all_ttids ) {
      if ( empty($all_ttids) ) return $clauses;

      $in = implode(',', array_map('intval', $all_ttids));
      // Join to term_relationships for scoring
      $clauses['join']   .= " INNER JOIN {$wpdb->term_relationships} sbp_tr_rel
                               ON sbp_tr_rel.object_id = {$wpdb->posts}.ID";
      $clauses['where']  .= " AND sbp_tr_rel.term_taxonomy_id IN ($in)";
      $clauses['fields'] .= ", COUNT(DISTINCT sbp_tr_rel.term_taxonomy_id) AS rel_score";

      // Ensure GROUP BY includes post ID (and keep any existing groupby)
      $clauses['groupby'] = trim(
        $clauses['groupby']
          ? "{$clauses['groupby']}, {$wpdb->posts}.ID"
          : "{$wpdb->posts}.ID"
      );

      // Put our score first; keep existing order next if present
      $clauses['orderby'] = "rel_score DESC" .
        ( $clauses['orderby'] ? ", {$clauses['orderby']}" : ", {$wpdb->posts}.post_date DESC" );

      return $clauses;
    };
    add_filter( 'posts_clauses', $rel_filter, 10, 1 );

    $out      = [];
    $used_ids = [ (int) $post_id ];

    $want_events = function_exists('tribe_get_events') && in_array('tribe_events', $post_types, true);
    $non_events  = array_values( array_diff( $post_types, ['tribe_events'] ) );

    // -------- 1) EVENTS via TEC (scored + tax_query) --------
    if ( $want_events && $limit > 0 ) {
      $slots = $limit;
      $args = [
        'post_status'       => 'publish',
        'posts_per_page'    => $slots,
        'post__not_in'      => $used_ids,
        'eventDisplay'      => 'custom',
        'start_date'        => '1970-01-01 00:00:00',
        'end_date'          => '2100-01-01 00:00:00',
        'suppress_filters'  => false, // let our posts_clauses run for scoring
      ];
      if ( ! empty($tax_query) ) {
        $args['tax_query'] = $tax_query;
      }
      if ( $hide_recurring ) {
        $args['hide_subsequent_recurrences'] = true;
        $args['tribeHideRecurrence']         = true; // legacy
      }

      $q = tribe_get_events( $args, true ); // WP_Query
      foreach ( $q->posts as $p ) {
        if ( count($out) >= $limit ) break;
        if ( isset($used_ids[$p->ID]) ) continue;
        $out[] = $p;
        $used_ids[$p->ID] = $p->ID;
      }
    }

    // -------- 2) NON-EVENTS via WP_Query (scored + tax_query) --------
    if ( $non_events && count($out) < $limit ) {
      $slots = $limit - count($out);
      $q = new WP_Query([
        'post_type'           => $non_events,
        'post_status'         => 'publish',
        'posts_per_page'      => $slots,
        'post__not_in'        => array_values($used_ids),
        'ignore_sticky_posts' => true,
        'no_found_rows'       => true,
        'suppress_filters'    => false,     // let our posts_clauses run for scoring
        'tax_query'           => ! empty($tax_query) ? $tax_query : [],
        // Keep a deterministic secondary order after score:
        'orderby'             => 'date',
        'order'               => 'DESC',
      ]);

      foreach ( $q->posts as $p ) {
        if ( count($out) >= $limit ) break;
        if ( isset($used_ids[$p->ID]) ) continue;
        $out[] = $p;
        $used_ids[$p->ID] = $p->ID;
      }
      wp_reset_postdata();
    }

    // -------- 3) FALLBACK FILL (no tax filter; no scoring) --------
    $need = $limit - count($out);
    if ( $need > 0 ) {
      // Temporarily disable scoring filter for neutral fills
      remove_filter( 'posts_clauses', $rel_filter, 10 );

      // 3a) Try fill with NON-EVENTS first (fresh, newest content)
      if ( $non_events ) {
        $q_fill = new WP_Query([
          'post_type'           => $non_events,
          'post_status'         => 'publish',
          'posts_per_page'      => $need,
          'post__not_in'        => array_values($used_ids),
          'ignore_sticky_posts' => true,
          'no_found_rows'       => true,
          'suppress_filters'    => true, // skip scoring/join entirely
          'orderby'             => 'date',
          'order'               => 'DESC',
        ]);
        foreach ( $q_fill->posts as $p ) {
          if ( count($out) >= $limit ) break;
          if ( isset($used_ids[$p->ID]) ) continue;
          $out[] = $p;
          $used_ids[$p->ID] = $p->ID;
        }
        wp_reset_postdata();
      }

      // 3b) If still short and events are allowed, fill with events (no tax filter)
      $need = $limit - count($out);
      if ( $need > 0 && $want_events ) {
        $q_fill_ev = tribe_get_events([
          'post_status'       => 'publish',
          'posts_per_page'    => $need,
          'post__not_in'      => array_values($used_ids),
          'eventDisplay'      => 'custom',
          'start_date'        => '1970-01-01 00:00:00',
          'end_date'          => '2100-01-01 00:00:00',
          'hide_subsequent_recurrences' => $hide_recurring,
          'tribeHideRecurrence'         => $hide_recurring,
          'orderby'           => 'event_date',
          'order'             => 'DESC',
          'suppress_filters'  => true, // skip scoring/join on the fill
        ], true );

        foreach ( $q_fill_ev->posts as $p ) {
          if ( count($out) >= $limit ) break;
          if ( isset($used_ids[$p->ID]) ) continue;
          $out[] = $p;
          $used_ids[$p->ID] = $p->ID;
        }
      }

      // Restore filter in case any later code expects it
      add_filter( 'posts_clauses', $rel_filter, 10, 1 );
    }

    // Final sanitisation: de-dup (paranoia) & cap
    $final = [];
    $seen  = [];
    foreach ( $out as $p ) {
      if ( isset($seen[$p->ID]) ) continue;
      $seen[$p->ID] = true;
      $final[] = $p;
      if ( count($final) >= $limit ) break;
    }

    // Always clean up our filter
    remove_filter( 'posts_clauses', $rel_filter, 10 );

    return $final;
  }
}
