<?php
/**
 * Plugin Name: TSB Events Endpoint
 * Description: POST /wp-json/tsb/v1/events — tribe_get_events with the same filtering contract as /browse + file debug logs.
 * Version: 1.0.0
 */

add_action('rest_api_init', function () {
  register_rest_route('tsb/v1', '/events', [
    'methods'  => 'POST',
    'permission_callback' => '__return_true',
    'callback' => function (WP_REST_Request $req) {
      try {
        $p = $req->get_json_params() ?: [];

        // Log incoming payload
        if (function_exists('tsb_debug')) {
          tsb_debug('events:payload_in', $p, 'events');
        }

        // --------- Basics (pagination / ordering / search) ----------
        $page = max(1, (int)($p['page'] ?? 1));
        $per  = min(50, max(1, (int)($p['per_page'] ?? 10)));

        // Support 'start_date' defaulting to "now" unless explicitly passed
        $start_date = isset($p['start_date']) && $p['start_date'] !== ''
          ? sanitize_text_field($p['start_date'])
          : current_time('mysql');
        $end_date   = isset($p['end_date']) && $p['end_date'] !== '' ? sanitize_text_field($p['end_date']) : null;

        // Accept friendly orderby "start_date" and map to meta ordering;
        // otherwise allow standard WP orderby keys.
        $orderby_in = sanitize_key($p['orderby'] ?? 'start_date');
        $order      = (strtoupper($p['order'] ?? 'ASC') === 'DESC') ? 'DESC' : 'ASC'; // events usually ASC

        $orderby = $orderby_in;
        $meta_key = null;
        if ($orderby_in === 'start_date') {
          $orderby  = 'meta_value';
          $meta_key = '_EventStartDate';
        } elseif (!in_array($orderby_in, ['date','title','modified','menu_order','meta_value','meta_value_num'], true)) {
          // default backstop
          $orderby  = 'meta_value';
          $meta_key = '_EventStartDate';
        }

        $search = isset($p['s']) ? sanitize_text_field($p['s']) : '';

        // --------- Taxonomy filters (same contract as /browse) ----------
        $tax_query = [];
        if (!empty($p['tax']) && is_array($p['tax'])) {
          foreach ($p['tax'] as $t) {
            $taxonomy = sanitize_key($t['taxonomy'] ?? '');
            $terms_in = (array)($t['terms'] ?? []);
            $terms    = array_filter(array_map('sanitize_text_field', $terms_in));
            if (!$taxonomy) continue;

            $field = strtolower((string)($t['field'] ?? 'slug'));
            $field = in_array($field, ['slug','name','term_id'], true) ? $field : 'slug';

            $operator = strtoupper((string)($t['operator'] ?? 'IN'));
            $allowed_ops = ['IN','NOT IN','AND','EXISTS','NOT EXISTS'];
            $operator = in_array($operator, $allowed_ops, true) ? $operator : 'IN';

            $clause = [
              'taxonomy' => $taxonomy,
              'field'    => $field,
              'operator' => $operator,
            ];

            if (!in_array($operator, ['EXISTS','NOT EXISTS'], true)) {
              if ($field === 'term_id') $terms = array_map('intval', $terms);
              if (empty($terms)) continue;
              $clause['terms'] = $terms;
            }

            $tax_query[] = $clause;
          }
        }
        if ($tax_query) {
          $relation = strtoupper((string)($p['tax_relation'] ?? (count($tax_query) > 1 ? 'AND' : 'AND')));
          if (!in_array($relation, ['AND','OR'], true)) $relation = 'AND';
          $tax_query = array_merge(['relation' => $relation], $tax_query);
        }

        // --------- Build tribe_get_events args ----------
        $args = [
          'posts_per_page'      => $per,
          'paged'               => $page,
          'eventDisplay'        => 'custom',                 // custom list, no month/day rewrite
          'tribeHideRecurrence' => !empty($p['hide_recurring']),
          'start_date'          => $start_date,
          'orderby'             => $orderby,
          'order'               => $order,
        ];
        if ($end_date)  $args['end_date']  = $end_date;
        if ($meta_key)  $args['meta_key']  = $meta_key;
        if ($search)    $args['s']         = $search;
        if (!empty($tax_query)) $args['tax_query'] = $tax_query;

        // Log args before running the query
        if (function_exists('tsb_debug')) {
          tsb_debug('events:args', $args, 'events');
        }

        // Ask tribe_get_events for the WP_Query so we can get totals + SQL
        $q = tribe_get_events($args, true); // $full = true

        if (function_exists('tsb_debug')) {
          tsb_debug('events:sql_out', [
            'sql'         => $q->request,
            'found_posts' => (int) $q->found_posts,
            'items_count' => count($q->posts),
          ], 'events');
        }

        // --------- Map to the SAME shape as /browse ----------
        $items = array_map(function ($post) {
          $start = get_post_meta($post->ID, '_EventStartDate', true);
          return [
            'id'        => $post->ID,
            'title'     => html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8'),
            'excerpt'   => html_entity_decode(get_the_excerpt($post), ENT_QUOTES, 'UTF-8'),
            'permalink' => get_permalink($post),
            'thumbnail' => get_the_post_thumbnail_url($post, 'medium_large'),
            'post_type' => 'tribe_events',
            'date'      => $start ?: get_the_date('', $post),
            'author'    => get_bloginfo('name'),
            // include both Event Categories and your cross-type tags if you like:
            'event_categories' => wp_get_post_terms($post->ID, 'tribe_events_cat', ['fields' => 'names']),
            'topics'           => wp_get_post_terms($post->ID, 'topic_tag',        ['fields' => 'names']),
          ];
        }, $q->posts);

        return new WP_REST_Response([
          'items'       => $items,
          'page'        => $page,
          'per_page'    => $per,
          'total'       => (int) $q->found_posts,
          'total_pages' => (int) ceil($q->found_posts / $per),
        ], 200);

      } catch (\Throwable $e) {
        if (function_exists('tsb_debug')) {
          tsb_debug('events:error', [
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine(),
          ], 'events');
        }
        return new WP_REST_Response(['error' => true, 'message' => 'Server error'], 500);
      }
    },
  ]);
});
