<?php
/**
 * Plugin Name: TSB Browse Endpoint
 * Description: POST /wp-json/tsb/v1/browse — unified browse with taxonomy filters + author search.
 * Version: 1.1.0
 */

// Add author name to search query
add_filter('posts_join', 'tsb_search_join_authors', 10, 2);
add_filter('posts_search', 'tsb_search_authors', 10, 2);

function tsb_search_join_authors($join, $query) {
    global $wpdb;
    if (!empty($query->get('tsb_search_authors')) && !empty($query->get('s'))) {
        $join .= " LEFT JOIN {$wpdb->users} AS tsb_users ON {$wpdb->posts}.post_author = tsb_users.ID";
    }
    return $join;
}

function tsb_search_authors($search, $query) {
    global $wpdb;
    if (!empty($query->get('tsb_search_authors')) && !empty($query->get('s'))) {
        $term = $query->get('s');
        $search = preg_replace(
            "/\({$wpdb->posts}\.post_content LIKE '([^']+)'\)/",
            "({$wpdb->posts}.post_content LIKE '$1' OR tsb_users.display_name LIKE '$1')",
            $search
        );
    }
    return $search;
}

add_action('rest_api_init', function () {
    register_rest_route('tsb/v1', '/browse', [
        'methods'  => 'POST',
        'permission_callback' => '__return_true',
        'callback' => 'tsb_browse_callback',
    ]);
});

function tsb_browse_callback(WP_REST_Request $r) {
    try {
        $p = $r->get_json_params() ?: [];

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

        // Build base args
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
            'update_post_meta_cache' => true,  // We need meta, so enable
            'update_post_term_cache' => true,  // We need terms, so enable
            'suppress_filters'       => false, // Allow our author search filter
            'tsb_search_authors'     => true,  // Custom flag to enable author search
        ];

        if (in_array($args['orderby'], ['meta_value','meta_value_num'], true) && !empty($p['meta_key'])) {
            $args['meta_key'] = sanitize_key($p['meta_key']);
        }

        // ------------ Taxonomy filters ------------
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
            $relation = strtoupper((string)($p['tax_relation'] ?? 'AND'));
            if (!in_array($relation, ['AND','OR'], true)) $relation = 'AND';
            $args['tax_query'] = array_merge(['relation' => $relation], $tax_query);
        }

        // Run query
        $q = new WP_Query($args);

        // Map results
        $items = array_map(function ($post) {
          $author_id = (int) $post->post_author;
          
          // Get excerpt without running expensive filters
          $excerpt = $post->post_excerpt;
          if (empty($excerpt)) {
              $excerpt = wp_trim_words(wp_strip_all_tags($post->post_content), 30, '...');
          }
      
          // Handle date based on post type
          if ($post->post_type === 'tribe_events') {
              $event_start = get_post_meta($post->ID, '_EventStartDate', true);
              $date = $event_start ? date('F j, Y', strtotime($event_start)) : get_the_date('', $post);
          } else {
              $date = get_the_date('', $post);
          }
      
          return [
              'id'        => $post->ID,
              'title'     => html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8'),
              'excerpt'   => html_entity_decode($excerpt, ENT_QUOTES, 'UTF-8'),
              'permalink' => get_permalink($post),
              'thumbnail' => get_the_post_thumbnail_url($post, 'medium_large'),
              'post_type' => $post->post_type,
              'date'      => $date,
              'author'    => get_the_author_meta('display_name', $author_id),
              'topics'    => wp_get_post_terms($post->ID, 'topic_tag', ['fields' => 'names']),
              'featured'  => (bool) get_post_meta($post->ID, 'is_featured', true),
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
        return new WP_REST_Response(['error' => true, 'message' => 'Server error'], 500);
    }
}