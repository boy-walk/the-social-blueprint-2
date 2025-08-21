<?php
// inc/related.php
if ( ! function_exists('sb_get_related_by_topic_tags') ) {
  /**
   * Get related content by shared terms (topic_tag, category, ...).
   * - Uses tribe_get_events() for events so recurring instances are hidden.
   * - Ranks by COUNT of matching terms across the chosen taxonomies.
   *
   * @param int        $post_id
   * @param int        $limit
   * @param bool       $hide_recurring
   * @param array      $post_types    Post types to consider (defaults to your full set)
   * @param array      $match_taxes   Taxonomies to score by (default: topic_tag + category)
   * @return WP_Post[]
   */
  function sb_get_related_by_topic_tags(
    $post_id,
    $limit = 3,
    $hide_recurring = true,
    $post_types = [],
    $match_taxes = ['topic_tag', 'category'] // <- add more here if you want
  ) {
    $all_post_types = [
      'tribe_events', 'podcast', 'article', 'directory', 'resource',
      'gd_discount', 'gd_aid_listing', 'gd_health_listing', 'gd_business',
      'gd_photo_gallery', 'gd_cost_of_living'
    ];
    $post_types = empty($post_types) ? $all_post_types : (array) $post_types;

    global $wpdb;

    // Collect term_taxonomy_ids across ALL match_taxes
    $all_ttids = [];
    foreach ((array) $match_taxes as $tax) {
      $ttids = wp_get_object_terms($post_id, $tax, ['fields' => 'tt_ids']);
      if (!is_wp_error($ttids) && !empty($ttids)) {
        $all_ttids = array_merge($all_ttids, array_map('intval', $ttids));
      }
    }
    $all_ttids = array_values(array_unique($all_ttids));

    // Clause filter: only return posts sharing ANY of those tt_ids and rank by overlap
    $rel_filter = function ($clauses) use ($wpdb, $all_ttids) {
      if (empty($all_ttids)) {
        // No overlap terms available — don't constrain; keep default ordering.
        return $clauses;
      }

      $in = implode(',', $all_ttids);

      // JOIN to term_relationships to check overlap
      $clauses['join']   .= " INNER JOIN {$wpdb->term_relationships} tr_rel ON tr_rel.object_id = {$wpdb->posts}.ID";
      // Require at least one shared term_taxonomy_id
      $clauses['where']  .= " AND tr_rel.term_taxonomy_id IN ($in)";
      // Add a relevance score
      $clauses['fields'] .= ", COUNT(DISTINCT tr_rel.term_taxonomy_id) AS rel_score";
      // Group and order by relevance (then recency as tiebreaker)
      $clauses['groupby'] = "{$wpdb->posts}.ID";
      $clauses['orderby'] = "rel_score DESC, {$wpdb->posts}.post_date DESC";

      return $clauses;
    };

    add_filter('posts_clauses', $rel_filter, 10, 1);

    // --- Events via TEC, so recurrence hiding works ---
    $events = [];
    if (function_exists('tribe_get_events') && in_array('tribe_events', $post_types, true)) {
      $e_args = [
        'posts_per_page'   => $limit,
        'paged'            => 1,
        'post__not_in'     => [$post_id],
        'eventDisplay'     => 'custom',              // don't force "upcoming"
        'start_date'       => '1970-01-01 00:00:00', // include past
        'end_date'         => '2100-01-01 00:00:00', // …and future
        'suppress_filters' => false,                 // let our posts_clauses run
      ];
      if ($hide_recurring) {
        // Works on modern TEC; keep legacy flag for safety.
        $e_args['hide_subsequent_recurrences'] = true;
        $e_args['tribeHideRecurrence']         = true;
      }

      // IMPORTANT: we do NOT add a tax_query here — the posts_clauses filter
      // handles overlap across ALL requested taxonomies (topic_tag + category).

      // Ask for the WP_Query so we can merge uniformly with non-events
      $eq     = tribe_get_events($e_args, true);
      $events = $eq->posts;
    }

    // --- Non-events (same scoring via the same posts_clauses filter) ---
    $non_event_types = array_values(array_diff($post_types, ['tribe_events']));
    $non_events = [];
    if (!empty($non_event_types) && (count($events) < $limit)) {
      $non_events = get_posts([
        'post_type'           => $non_event_types,
        'post_status'         => 'publish',
        'posts_per_page'      => max(0, $limit - count($events)),
        'post__not_in'        => [$post_id],
        'suppress_filters'    => false, // keep relevance scoring active
        'no_found_rows'       => true,
        'ignore_sticky_posts' => true,
      ]);
    }

    remove_filter('posts_clauses', $rel_filter, 10);

    // Merge, de-dup, cap to $limit
    $out  = [];
    $seen = [];
    foreach (array_merge($events, $non_events) as $p) {
      if (isset($seen[$p->ID])) continue;
      $seen[$p->ID] = true;
      $out[] = $p;
      if (count($out) >= $limit) break;
    }

    return $out;
  }
}
