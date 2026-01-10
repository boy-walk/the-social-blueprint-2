<?php
if ( ! function_exists('sb_get_related_by_topic_tags') ) {
  function sb_get_related_by_topic_tags(
    $post_id,
    $limit          = 3,
    $hide_recurring = true,
    $post_types     = [],
    $match_taxes    = [],
    $date_range     = '-6 months'
  ) {
    global $wpdb;

    $post_types = array_values( array_unique( (array) $post_types ) );

    // Calculate date range for events
    $start_date = date('Y-m-d H:i:s', strtotime($date_range));
    $end_date = date('Y-m-d H:i:s');

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

    // ⭐ NEW: Meta query to exclude recurring event children
    $no_recurring_meta = [];
    if ( $hide_recurring ) {
      $no_recurring_meta = [
        'relation' => 'OR',
        [
          'key'     => '_EventRecurrence',
          'compare' => 'NOT EXISTS',
        ],
        [
          'key'     => '_EventRecurrence',
          'value'   => '',
          'compare' => '=',
        ],
      ];
    }

    // --- Scoring filter: prefer posts sharing more of the same terms ---
    $rel_filter = function( $clauses ) use ( $wpdb, $all_ttids ) {
      if ( empty($all_ttids) ) return $clauses;

      $in = implode(',', array_map('intval', $all_ttids));
      $clauses['join']   .= " INNER JOIN {$wpdb->term_relationships} sbp_tr_rel
                               ON sbp_tr_rel.object_id = {$wpdb->posts}.ID";
      
      $clauses['where']  .= " AND {$wpdb->posts}.post_status = 'publish'";
      $clauses['where']  .= " AND sbp_tr_rel.term_taxonomy_id IN ($in)";
      $clauses['fields'] .= ", COUNT(DISTINCT sbp_tr_rel.term_taxonomy_id) AS rel_score";

      $clauses['groupby'] = trim(
        $clauses['groupby']
          ? "{$clauses['groupby']}, {$wpdb->posts}.ID"
          : "{$wpdb->posts}.ID"
      );

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
        'start_date'        => $start_date,
        'end_date'          => $end_date,
        'suppress_filters'  => false,
      ];
      if ( ! empty($tax_query) ) {
        $args['tax_query'] = $tax_query;
      }
      // ⭐ UPDATED: More explicit recurring event exclusion
      if ( $hide_recurring ) {
        $args['hide_subsequent_recurrences'] = true;
        $args['tribeHideRecurrence']         = true;
        if ( ! empty($no_recurring_meta) ) {
          $args['meta_query'] = $no_recurring_meta;
        }
      }

      $q = tribe_get_events( $args, true );
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
        'suppress_filters'    => false,
        'tax_query'           => ! empty($tax_query) ? $tax_query : [],
        'date_query'          => [
          [
            'after'     => $date_range,
            'inclusive' => true,
          ],
        ],
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
      remove_filter( 'posts_clauses', $rel_filter, 10 );

      // 3a) Try fill with NON-EVENTS first
      if ( $non_events ) {
        $q_fill = new WP_Query([
          'post_type'           => $non_events,
          'post_status'         => 'publish',
          'posts_per_page'      => $need,
          'post__not_in'        => array_values($used_ids),
          'ignore_sticky_posts' => true,
          'no_found_rows'       => true,
          'suppress_filters'    => true,
          'date_query'          => [
            [
              'after'     => $date_range,
              'inclusive' => true,
            ],
          ],
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

      // 3b) If still short and events are allowed, fill with events
      $need = $limit - count($out);
      if ( $need > 0 && $want_events ) {
        $fill_args = [
          'post_status'       => 'publish',
          'posts_per_page'    => $need,
          'post__not_in'      => array_values($used_ids),
          'eventDisplay'      => 'custom',
          'start_date'        => $start_date,
          'end_date'          => $end_date,
          'orderby'           => 'event_date',
          'order'             => 'DESC',
          'suppress_filters'  => true,
        ];
        
        // ⭐ UPDATED: Add recurring exclusion to fallback too
        if ( $hide_recurring ) {
          $fill_args['hide_subsequent_recurrences'] = true;
          $fill_args['tribeHideRecurrence']         = true;
          if ( ! empty($no_recurring_meta) ) {
            $fill_args['meta_query'] = $no_recurring_meta;
          }
        }
        
        $q_fill_ev = tribe_get_events($fill_args, true);

        foreach ( $q_fill_ev->posts as $p ) {
          if ( count($out) >= $limit ) break;
          if ( isset($used_ids[$p->ID]) ) continue;
          $out[] = $p;
          $used_ids[$p->ID] = $p->ID;
        }
      }

      add_filter( 'posts_clauses', $rel_filter, 10, 1 );
    }

    // Final sanitisation with actual post_status verification
    $final = [];
    $seen  = [];
    foreach ( $out as $p ) {
      if ( isset($seen[$p->ID]) ) continue;
      
      // Double-check that post is actually published
      $actual_status = get_post_status($p->ID);
      if ($actual_status !== 'publish') {
        if (defined('WP_DEBUG') && WP_DEBUG) {
          error_log("🚨 Ghost post filtered out from related content:");
          error_log("  Post ID: {$p->ID}");
          error_log("  Title: " . ($p->post_title ?? 'Unknown'));
          error_log("  Type: " . ($p->post_type ?? 'Unknown'));
          error_log("  Status in DB: $actual_status");
        }
        continue;
      }
      
      // ⭐ NEW: Extra check for recurring events
      if ($hide_recurring && $p->post_type === 'tribe_events') {
        if (function_exists('tribe_is_recurring_event') && tribe_is_recurring_event($p->ID)) {
          // Check if this is a child event (not the parent)
          $recurrence_meta = get_post_meta($p->ID, '_EventRecurrence', true);
          if (!empty($recurrence_meta)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
              error_log("🔁 Recurring event child filtered out:");
              error_log("  Post ID: {$p->ID}");
              error_log("  Title: " . ($p->post_title ?? 'Unknown'));
            }
            continue;
          }
        }
      }
      
      $seen[$p->ID] = true;
      $final[] = $p;
      if ( count($final) >= $limit ) break;
    }

    remove_filter( 'posts_clauses', $rel_filter, 10 );

    return $final;
  }
}