<?php
/**
 * Plugin Name: TSB Browse Endpoint
 * Description: POST /wp-json/tsb/v1/browse — unified browse with taxonomy filters + file debug logs.
 * Version: 1.0.1
 */

add_action('rest_api_init', function () {
  register_rest_route('tsb/v1', '/browse', [
    'methods'  => 'POST',
    'permission_callback' => '__return_true',
    'callback' => function (WP_REST_Request $r) {
      try {
        $p = $r->get_json_params() ?: [];

        if (function_exists('tsb_debug')) {
          tsb_debug('browse:payload_in', $p, 'browse');
        }

        // ------------ Basics ------------
        $page     = max(1, (int)($p['page'] ?? 1));
        $per_page = min(50, max(1, (int)($p['per_page'] ?? 10)));
        $orderby  = sanitize_key($p['orderby'] ?? 'date');
        $order    = (strtoupper($p['order'] ?? 'DESC') === 'ASC') ? 'ASC' : 'DESC';
        $search   = sanitize_text_field($p['s'] ?? '');

        // Post types (validated)
        $requested  = (array)($p['post_type'] ?? ['post']);
        $registered = get_post_types([], 'names');
        $post_types = array_values(array_intersect($requested, $registered));
        if (!$post_types) $post_types = ['post'];

        // Build base args FIRST (don’t overwrite later!)
        $args = [
          'post_type'              => $post_types,
          'post_status'            => 'publish',
          'paged'                  => $page,
          'posts_per_page'         => $per_page,
          'orderby'                => in_array($orderby, ['date','title','modified','menu_order','meta_value','meta_value_num'], true) ? $orderby : 'date',
          'order'                  => $order,
          's'                      => $search ?: '',
          'ignore_sticky_posts'    => true,
          'no_found_rows'          => false,
          'update_post_meta_cache' => false,
          'update_post_term_cache' => false,
          'suppress_filters'       => true, // prevent 3rd-party pre_get_posts from clobbering args
        ];
        if (in_array($args['orderby'], ['meta_value','meta_value_num'], true) && !empty($p['meta_key'])) {
          $args['meta_key'] = sanitize_key($p['meta_key']);
        }

        // ------------ Taxonomy filters (fixed) ------------
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
          $args['tax_query'] = array_merge(['relation' => $relation], $tax_query);
        }
        
        if (function_exists('tsb_debug')) {
          tsb_debug('browse:args', $args, 'browse');
        }

        // Run query once, then log the final SQL
        $q = new WP_Query($args);

        if (function_exists('tsb_debug')) {
          tsb_debug('browse:sql_out', [
            'sql'         => $q->request,
            'found_posts' => (int) $q->found_posts,
            'items_count' => count($q->posts),
          ], 'browse');
        }

        // Map results (keep light)
        $items = array_map(function ($post) {
          $author_id = (int) get_post_field('post_author', $post);
          return [
            'id'        => $post->ID,
            'title'     => html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8'),
            'excerpt'   => html_entity_decode(get_the_excerpt($post), ENT_QUOTES, 'UTF-8'),
            'permalink' => get_permalink($post),
            'thumbnail' => get_the_post_thumbnail_url($post, 'medium_large'),
            'post_type' => get_post_type($post),
            'content' => apply_filters('the_content', get_post_field('post_content', $post->ID)),
            'date'      => get_the_date('', $post),
            'author'    => get_the_author_meta('display_name', $author_id),
            'topics'    => wp_get_post_terms($post->ID, 'topic_tag', ['fields' => 'names']),
            'featured'  => get_post_meta($post->ID, 'is_featured', "1") ? true : false,
            'gd_category_image' => get_post_meta($post->ID, 'gd_category_image', true),
          ];
        }, $q->posts);

        return new WP_REST_Response([
          'items'       => $items,
          'page'        => $page,
          'per_page'    => $per_page,
          'total'       => (int) $q->found_posts,
          'total_pages' => (int) $q->max_num_pages,
        ], 200);

      } catch (\Throwable $e) {
        if (function_exists('tsb_debug')) {
          tsb_debug('browse:error', [
            'message' => $e->getMessage(),
            'file'    => $e->getFile(),
            'line'    => $e->getLine(),
          ], 'browse');
        }
        return new WP_REST_Response(['error' => true, 'message' => 'Server error'], 500);
      }
    },
  ]);
});
