<?php
/**
 * Plugin Name: TSB Events Endpoint
 * Description: POST /wp-json/tsb/v1/events — tribe_get_events with the same filtering contract as /browse + file debug logs.
 * Version: 1.0.1
 */

add_action('rest_api_init', function () {
  register_rest_route('tsb/v1', '/events', [
    'methods'  => 'POST',
    'permission_callback' => '__return_true',
    'callback' => function (WP_REST_Request $req) {
      try {
        $p = $req->get_json_params() ?: [];
        if (function_exists('tsb_debug')) tsb_debug('events:payload_in', $p, 'events');

        $page = max(1, (int)($p['page'] ?? 1));
        $per  = min(50, max(1, (int)($p['per_page'] ?? 10)));

        // Friendly orderby: "start_date" => _EventStartDate meta
        $orderby_in = sanitize_key($p['orderby'] ?? 'start_date');
        $order      = (strtoupper($p['order'] ?? 'ASC') === 'DESC') ? 'DESC' : 'ASC';

        $orderby  = $orderby_in === 'start_date' ? 'meta_value' : $orderby_in;
        if (!in_array($orderby, ['date','title','modified','menu_order','meta_value','meta_value_num'], true)) {
          $orderby = 'meta_value';
        }
        $meta_key = $orderby === 'meta_value' ? '_EventStartDate' : null;

        $search = isset($p['s']) ? sanitize_text_field($p['s']) : '';

        // Build tax_query (same contract as /browse)
        $tax_query = [];
        if (!empty($p['tax']) && is_array($p['tax'])) {
          foreach ($p['tax'] as $t) {
            $taxonomy = sanitize_key($t['taxonomy'] ?? '');
            $terms    = array_filter(array_map('sanitize_text_field', (array)($t['terms'] ?? [])));
            if (!$taxonomy) continue;

            $field = strtolower((string)($t['field'] ?? 'slug'));
            $field = in_array($field, ['slug','name','term_id'], true) ? $field : 'slug';

            $op    = strtoupper((string)($t['operator'] ?? 'IN'));
            $op    = in_array($op, ['IN','NOT IN','AND','EXISTS','NOT EXISTS'], true) ? $op : 'IN';

            $clause = ['taxonomy'=>$taxonomy,'field'=>$field,'operator'=>$op];
            if (!in_array($op, ['EXISTS','NOT EXISTS'], true)) {
              if ($field === 'term_id') $terms = array_map('intval', $terms);
              if (empty($terms)) continue;
              $clause['terms'] = $terms;
            }
            $tax_query[] = $clause;
          }
        }
        if ($tax_query) {
          $rel = strtoupper($p['tax_relation'] ?? 'AND');
          if (!in_array($rel, ['AND','OR'], true)) $rel = 'AND';
          $tax_query = array_merge(['relation'=>$rel], $tax_query);
        }

        // --------- tribe_get_events args (NO implicit date floor) ---------
        $args = [
          'posts_per_page'        => $per,
          'paged'                 => $page,
          'eventDisplay'          => 'custom', // don't switch to list/month/day
          'tribeHideRecurrence'   => !empty($p['hide_recurring']),
          'tribe_suppress_query_filters' => true, // stop TEC defaults from forcing "upcoming"
          'orderby'               => $orderby,
          'order'                 => $order,
          // include scheduled/EA states so nothing vanishes due to status
          'post_status'           => ['publish','future'],
        ];
        if ($meta_key)      $args['meta_key'] = $meta_key;
        if (!empty($p['start_date'])) $args['start_date'] = sanitize_text_field($p['start_date']); // only if provided
        if (!empty($p['end_date']))   $args['end_date']   = sanitize_text_field($p['end_date']);   // only if provided

        if ($search !== '') $args['s'] = $search;
        if ($tax_query)     $args['tax_query'] = $tax_query;

        // Inside your events route callback, after you assemble $args for WP_Query:
        $meta_query = isset($args['meta_query']) ? (array) $args['meta_query'] : [];

        // Accept a few truthy values
        $requested_featured = isset($_GET['is_featured']) ? $_GET['is_featured'] : '';
        if ($requested_featured !== '') {
            $truthy = in_array(strtolower((string)$requested_featured), ['1','true','yes','on'], true);
            if ($truthy) {
                // Many WP installs store boolean 'true' as '1' in postmeta
                $meta_query[] = [
                    'key'     => 'is_featured',
                    'value'   => '1',
                    'compare' => '='
                ];
                // If you also sometimes have real booleans stored, use this more permissive version:
                // $meta_query[] = [
                //   'relation' => 'OR',
                //   [
                //     'key' => 'is_featured',
                //     'value' => '1',
                //     'compare' => '='
                //   ],
                //   [
                //     'key' => 'is_featured',
                //     'value' => true,
                //     'compare' => '='
                //   ],
                // ];
            }
        }

        if ($meta_query) {
            // Keep any existing meta conditions
            $args['meta_query'] = $meta_query;
            if (!isset($args['meta_query']['relation'])) {
                $args['meta_query']['relation'] = 'AND';
            }
        }


        if (function_exists('tsb_debug')) tsb_debug('events:args', $args, 'events');

        // Ask TEC for a WP_Query (so we can log SQL + totals)
        $q = tribe_get_events($args, true);

        if (function_exists('tsb_debug')) {
          tsb_debug('events:sql_out', [
            'sql'         => $q->request,
            'found_posts' => (int) $q->found_posts,
            'items_count' => count($q->posts),
          ], 'events');
        }

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
            'event_categories' => wp_get_post_terms($post->ID, 'tribe_events_cat', ['fields'=>'names']),
            'topics'           => wp_get_post_terms($post->ID, 'topic_tag',        ['fields'=>'names']),
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
        if (function_exists('tsb_debug')) tsb_debug('events:error', [
          'message'=>$e->getMessage(),'file'=>$e->getFile(),'line'=>$e->getLine()
        ], 'events');
        return new WP_REST_RESPONSE(['error'=>true,'message'=>'Server error'], 500);
      }
    },
  ]);
});
