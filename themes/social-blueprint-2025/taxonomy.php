<?php
/**
 * Taxonomy archive template (OPTIMIZED)
 * Pre-fetches all filter terms server-side to eliminate client API calls
 */

get_header();

$props = [];

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Get terms for a taxonomy, filtered by post types (cached)
// ─────────────────────────────────────────────────────────────────────────────
function tsb_get_filtered_terms(string $taxonomy, array $post_types, int $limit = 200): array {
  global $wpdb;
  
  // Try cache first
  $cache_key = 'tsb_terms_' . md5($taxonomy . implode(',', $post_types));
  $cached = wp_cache_get($cache_key, 'tsb_terms');
  if ($cached !== false) {
    return $cached;
  }
  
  // Exclude event post types unless specifically requested
  $excluded_pts = ['tribe_events', 'tribe_venue', 'tribe_organizer'];
  $filtered_pts = array_diff($post_types, $excluded_pts);
  
  if (empty($filtered_pts)) {
    // No post types to query - get all non-empty terms
    $terms = get_terms([
      'taxonomy'   => $taxonomy,
      'hide_empty' => true,
      'number'     => $limit,
    ]);
    
    if (is_wp_error($terms)) return [];
    
    $result = array_map(function($t) {
      return [
        'id'     => (int) $t->term_id,
        'name'   => $t->name,
        'slug'   => $t->slug,
        'parent' => (int) $t->parent,
      ];
    }, $terms);
    
    wp_cache_set($cache_key, $result, 'tsb_terms', 300);
    return $result;
  }
  
  // Get all terms first
  $all_terms = get_terms([
    'taxonomy'   => $taxonomy,
    'hide_empty' => false,
    'number'     => $limit,
  ]);
  
  if (is_wp_error($all_terms) || empty($all_terms)) return [];
  
  // Get term IDs that have posts of our post types
  $term_ids = wp_list_pluck($all_terms, 'term_id');
  $term_placeholders = implode(',', array_fill(0, count($term_ids), '%d'));
  $pt_placeholders = implode(',', array_fill(0, count($filtered_pts), '%s'));
  
  $query = $wpdb->prepare("
    SELECT DISTINCT tt.term_id
    FROM {$wpdb->term_taxonomy} AS tt
    INNER JOIN {$wpdb->term_relationships} AS tr ON tt.term_taxonomy_id = tr.term_taxonomy_id
    INNER JOIN {$wpdb->posts} AS p ON tr.object_id = p.ID
    WHERE tt.term_id IN ($term_placeholders)
    AND tt.taxonomy = %s
    AND p.post_type IN ($pt_placeholders)
    AND p.post_status = 'publish'
  ", array_merge($term_ids, [$taxonomy], $filtered_pts));
  
  $terms_with_posts = $wpdb->get_col($query);
  $terms_with_posts = array_map('intval', $terms_with_posts);
  
  // Also include ancestors of terms with posts (for hierarchical display)
  $all_valid_ids = $terms_with_posts;
  foreach ($terms_with_posts as $tid) {
    $ancestors = get_ancestors($tid, $taxonomy, 'taxonomy');
    $all_valid_ids = array_merge($all_valid_ids, $ancestors);
  }
  $all_valid_ids = array_unique($all_valid_ids);
  
  // Build result
  $result = [];
  foreach ($all_terms as $term) {
    if (in_array((int)$term->term_id, $all_valid_ids, true)) {
      $result[] = [
        'id'     => (int) $term->term_id,
        'name'   => $term->name,
        'slug'   => $term->slug,
        'parent' => (int) $term->parent,
      ];
    }
  }
  
  wp_cache_set($cache_key, $result, 'tsb_terms', 300);
  return $result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Build hierarchical tree from flat terms
// ─────────────────────────────────────────────────────────────────────────────
function tsb_build_term_tree(array $terms): array {
  $by_id = [];
  foreach ($terms as $t) {
    $by_id[$t['id']] = array_merge($t, ['children' => []]);
  }
  
  $roots = [];
  foreach ($by_id as $id => &$node) {
    $parent_id = $node['parent'];
    if ($parent_id && isset($by_id[$parent_id])) {
      $by_id[$parent_id]['children'][] = &$node;
    } else {
      $roots[] = &$node;
    }
  }
  unset($node);
  
  // Sort recursively
  $sort_tree = function(&$nodes) use (&$sort_tree) {
    usort($nodes, fn($a, $b) => strcasecmp($a['name'], $b['name']));
    foreach ($nodes as &$n) {
      if (!empty($n['children'])) $sort_tree($n['children']);
    }
  };
  $sort_tree($roots);
  
  return $roots;
}

if ( is_tax() || is_category() || is_tag() ) {
  $qo = get_queried_object();
  
  if ( ! $qo instanceof WP_Term ) {
    get_template_part( '404' );
    return;
  }

  $taxonomy = $qo->taxonomy;
  $tx = get_taxonomy( $taxonomy );

  // ─────────────────────────────────────────────────────────────────────────
  // Parse multiple terms (dot notation)
  // ─────────────────────────────────────────────────────────────────────────
  $multi_term_string = get_query_var('tsb_multi_term', '');
  $terms = [ $qo ];
  $term_ids = [ (int) $qo->term_id ];

  if ( $multi_term_string && strpos($multi_term_string, '.') !== false ) {
    $slugs = array_filter(array_map('sanitize_title', explode('.', $multi_term_string)));
    
    if ( count($slugs) > 1 ) {
      $terms = [];
      $term_ids = [];
      foreach ( $slugs as $slug ) {
        $term = get_term_by('slug', $slug, $taxonomy);
        if ( $term && ! is_wp_error($term) ) {
          $terms[] = $term;
          $term_ids[] = (int) $term->term_id;
        }
      }
      if ( empty($terms) ) {
        $terms = [ $qo ];
        $term_ids = [ (int) $qo->term_id ];
      }
    }
  }

  $is_multi_term = count($terms) > 1;

  // ─────────────────────────────────────────────────────────────────────────
  // Determine post types
  // ─────────────────────────────────────────────────────────────────────────
  $attached = $tx ? (array) $tx->object_type : [];
  $excluded_post_types = ['attachment', 'revision', 'nav_menu_item', 'tribe_events', 'tribe_venue', 'tribe_organizer'];
  
  if ( $taxonomy === 'tribe_events_cat' ) {
    $excluded_post_types = array_diff($excluded_post_types, ['tribe_events']);
  }

  $post_types = array_values(array_filter($attached, function($pt) use ($excluded_post_types) {
    return !in_array($pt, $excluded_post_types, true) && post_type_exists($pt);
  }));

  if ( empty($post_types) ) {
    $post_types = ['post'];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Build filters WITH pre-fetched terms
  // ─────────────────────────────────────────────────────────────────────────
  $filters = [];
  $excluded_taxonomies = ['post_format', 'nav_menu', 'link_category', 'wp_theme', 'tribe_events_cat'];

  // Child terms filter (for hierarchical, single term)
  if ( $tx && $tx->hierarchical && !$is_multi_term ) {
    $primary_term = $terms[0];
    $children = get_terms([
      'taxonomy'   => $taxonomy,
      'parent'     => $primary_term->term_id,
      'hide_empty' => false,
      'orderby'    => 'name',
      'order'      => 'ASC',
    ]);
    
    if ( !is_wp_error($children) && !empty($children) ) {
      $child_terms = [];
      foreach ( $children as $child ) {
        $child_terms[] = [
          'id'     => (int) $child->term_id,
          'name'   => $child->name,
          'slug'   => $child->slug,
          'parent' => (int) $primary_term->term_id,
        ];
      }
      $filters[] = [
        'taxonomy' => $taxonomy,
        'label'    => $tx->labels->singular_name ?? 'Subcategory',
        'terms'    => $child_terms, // Pre-fetched!
      ];
    }
  }

  // Collect other taxonomies
  // Collect other taxonomies
$other_taxonomies = [];

// Define allowed taxonomies for topic_tag
$allowed_topic_taxonomies = ['people_tag', 'theme', 'topic_tag', 'audience_tag'];

foreach ( $post_types as $pt ) {
  $pt_taxes = get_object_taxonomies($pt, 'objects');
  foreach ( $pt_taxes as $pt_tax ) {
    // If on topic_tag taxonomy, only include allowed taxonomies
    if (!in_array($pt_tax->name, $allowed_topic_taxonomies, true) ) {
      continue;
    }
    
    if ( 
      $pt_tax->public && 
      $pt_tax->name !== $taxonomy && 
      !in_array($pt_tax->name, $excluded_taxonomies, true) &&
      !isset($other_taxonomies[$pt_tax->name])
    ) {
      $other_taxonomies[$pt_tax->name] = $pt_tax;
    }
  }
}

  // Pre-fetch terms for ALL other taxonomy filters
  foreach ( $other_taxonomies as $other_tax ) {
    if ( $other_tax->name === 'tribe_events_cat' && !in_array('tribe_events', $post_types, true) ) {
      continue;
    }
    
    // Get filtered terms for this taxonomy
    $tax_terms = tsb_get_filtered_terms($other_tax->name, $post_types);
    
    // Skip if no terms
    if (empty($tax_terms)) continue;
    
    // Check if hierarchical
    $is_hierarchical = $other_tax->hierarchical && count(array_filter($tax_terms, fn($t) => $t['parent'] > 0)) > 0;
    
    $filters[] = [
      'taxonomy' => $other_tax->name,
      'label'    => $other_tax->labels->singular_name ?? $other_tax->label,
      'terms'    => $is_hierarchical ? tsb_build_term_tree($tax_terms) : $tax_terms, // Pre-fetched!
    ];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Title and subtitle
  // ─────────────────────────────────────────────────────────────────────────
  if ( $is_multi_term ) {
    $term_names = array_map(fn($t) => $t->name, $terms);
    $title = implode(', ', $term_names);
    $subtitle = sprintf('Browsing %s', $tx->labels->name ?? $taxonomy);
  } else {
    $title = single_term_title('', false);
    $subtitle = wp_strip_all_tags(term_description($qo, $taxonomy) ?: '');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Breadcrumbs
  // ─────────────────────────────────────────────────────────────────────────
  $breadcrumbs = [];
  if ( function_exists('sbp_build_breadcrumbs') ) {
    if ( $is_multi_term ) {
      $breadcrumbs = [['label' => 'Home', 'url' => home_url('/')]];
      $tax_pages = [
        'topic_tag'    => '/topics/',
        'people_tag'   => '/people/',
        'theme'        => '/themes/',
        'audience_tag' => '/audiences/',
      ];
      if ( isset($tax_pages[$taxonomy]) ) {
        $breadcrumbs[] = [
          'label' => $tx->labels->name ?? ucfirst($taxonomy),
          'url'   => home_url($tax_pages[$taxonomy]),
        ];
      }
      $breadcrumbs[] = [
        'label' => implode(' + ', array_map(fn($t) => $t->name, $terms)),
        'url'   => '',
      ];
    } else {
      $breadcrumbs = sbp_build_breadcrumbs();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Build props
  // ─────────────────────────────────────────────────────────────────────────
  $current_term_info = $is_multi_term 
    ? [
        'multiple' => true,
        'terms'    => array_map(fn($t) => [
          'id'       => (int) $t->term_id,
          'slug'     => $t->slug,
          'name'     => $t->name,
          'taxonomy' => $taxonomy,
        ], $terms),
        'taxonomy' => $taxonomy,
      ]
    : [
        'id'       => $term_ids[0],
        'slug'     => $terms[0]->slug,
        'taxonomy' => $taxonomy,
      ];

  $props = [
    'postType'    => (count($post_types) === 1) ? $post_types[0] : $post_types,
    'taxonomy'    => $taxonomy,
    'filters'     => $filters,
    'endpoint'    => '/wp-json/tsb/v1/browse',
    'baseQuery'   => [
      'post_type'    => $post_types,
      'per_page'     => 12,
      'order'        => 'DESC',
      'orderby'      => 'date',
      'tax'          => [[
        'taxonomy'         => $taxonomy,
        'field'            => 'term_id',
        'terms'            => $term_ids,
        'operator'         => 'IN',
        'include_children' => true,
      ]],
      'tax_relation' => 'AND',
    ],
    'title'       => $title,
    'subtitle'    => $subtitle,
    'currentTerm' => $current_term_info,
    'breadcrumbs' => $breadcrumbs,
  ];

} else {
  $pt = get_query_var('post_type') ?: get_post_type();
  if (is_array($pt)) $pt = reset($pt);

  $breadcrumbs = function_exists('sbp_build_breadcrumbs') ? sbp_build_breadcrumbs() : [];

  $props = [
    'postType'    => $pt,
    'taxonomy'    => '',
    'filters'     => [],
    'endpoint'    => ($pt === 'tribe_events') ? '/wp-json/tsb/v1/events' : '/wp-json/tsb/v1/browse',
    'baseQuery'   => [
      'post_type' => [$pt],
      'per_page'  => 12,
      'order'     => 'DESC',
      'orderby'   => 'date',
    ],
    'title'       => post_type_archive_title('', false),
    'subtitle'    => '',
    'currentTerm' => null,
    'breadcrumbs' => $breadcrumbs,
  ];
}
?>
<main id="content" class="generic-archive">
  <div
    id="generic-archive-root"
    data-component="GenericArchivePage"
    data-props='<?php echo esc_attr( wp_json_encode( $props, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) ); ?>'>
  </div>
</main>
<?php get_footer(); ?>