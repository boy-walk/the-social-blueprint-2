<?php
/**
 * Generalized archive template (OPTIMIZED)
 * Pre-fetches all filter terms server-side to eliminate client API calls
 */

get_header();

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function tsb_clean_archive_title_from_pts(array $pts): string {
  if (empty($pts)) return get_the_archive_title();
  $labels = array_map(function($pt){
    $o = get_post_type_object($pt);
    return $o && !is_wp_error($o) ? ($o->labels->name ?? $pt) : $pt;
  }, $pts);
  return implode(' and ', $labels);
}

function tsb_clean_archive_title(): string {
  if ( is_category() )          return single_cat_title( '', false );
  if ( is_tag() )               return single_tag_title( '', false );
  if ( is_tax() )               return single_term_title( '', false );
  if ( is_post_type_archive() ) return post_type_archive_title( '', false );
  if ( is_author() )            return get_the_author();
  if ( is_year() )              return get_the_date( 'Y' );
  if ( is_month() )             return get_the_date( 'F Y' );
  if ( is_day() )               return get_the_date( 'F j, Y' );
  return get_the_archive_title();
}

function tsb_detect_current_term(?string $post_type): array {
  $qo = get_queried_object();
  if ( $qo instanceof WP_Term ) return [ $qo->taxonomy, (int)$qo->term_id, $qo->slug, $qo ];

  $q_tax  = get_query_var('taxonomy');
  $q_term = get_query_var('term');
  if ( $q_tax && $q_term ) {
    $t = get_term_by('slug', $q_term, $q_tax);
    if ( $t && ! is_wp_error($t) ) return [ $t->taxonomy, (int)$t->term_id, $t->slug, $t ];
  }

  $cat_name = get_query_var('category_name');
  if ( $cat_name ) {
    $t = get_term_by('slug', $cat_name, 'category');
    if ( $t && ! is_wp_error($t) ) return [ 'category', (int)$t->term_id, $t->slug, $t ];
  }

  $tag_slug = get_query_var('tag');
  if ( $tag_slug ) {
    $t = get_term_by('slug', $tag_slug, 'post_tag');
    if ( $t && ! is_wp_error($t) ) return [ 'post_tag', (int)$t->term_id, $t->slug, $t ];
  }

  $tax_objects = $post_type
    ? get_object_taxonomies( $post_type, 'objects' )
    : get_taxonomies( ['public' => true], 'objects' );

  foreach ( $tax_objects as $tx ) {
    $qv  = $tx->query_var ?: $tx->name;
    $val = get_query_var( $qv );
    if ( $val ) {
      $slug = is_array($val) ? reset($val) : $val;
      $t = get_term_by('slug', $slug, $tx->name);
      if ( $t && ! is_wp_error($t) ) return [ $tx->name, (int)$t->term_id, $t->slug, $t ];
    }
  }

  return [ null, null, null, null ];
}

function tsb_collect_url_tax_filters(): array {
  $out = [];
  $tax_objects = get_taxonomies( ['public' => true], 'objects' );
  foreach ( $tax_objects as $tx ) {
    $qv  = $tx->query_var ?: $tx->name;
    $val = get_query_var( $qv );
    if ( ! $val ) continue;

    if ( is_array($val) ) {
      $slugs = array_map('sanitize_title', $val);
    } else {
      $slugs = preg_split('/[.,\s]+/', (string)$val, -1, PREG_SPLIT_NO_EMPTY);
      $slugs = array_map('sanitize_title', $slugs);
    }

    $term_ids = [];
    foreach ($slugs as $slug) {
      $t = null;
      if ( $qv === 'category_name' )      $t = get_term_by('slug', $slug, 'category');
      elseif ( $qv === 'tag' )            $t = get_term_by('slug', $slug, 'post_tag');
      else                                $t = get_term_by('slug', $slug, $tx->name);

      if ( $t && ! is_wp_error($t) ) $term_ids[] = (int)$t->term_id;
    }

    if ($term_ids) {
      $out[] = [
        'taxonomy'         => ($qv === 'category_name') ? 'category' : (($qv === 'tag') ? 'post_tag' : $tx->name),
        'field'            => 'term_id',
        'terms'            => array_values(array_unique($term_ids)),
        'operator'         => 'IN',
        'include_children' => true,
      ];
    }
  }
  return $out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Get terms for a taxonomy filtered by post types (with caching)
// ─────────────────────────────────────────────────────────────────────────────
function tsb_get_filtered_terms_for_archive(string $taxonomy, array $post_types, int $limit = 200): array {
  global $wpdb;
  
  $cache_key = 'tsb_terms_' . md5($taxonomy . implode(',', $post_types));
  $cached = wp_cache_get($cache_key, 'tsb_terms');
  if ($cached !== false) {
    return $cached;
  }
  
  // Exclude event post types unless specifically included
  $excluded_pts = ['tribe_events', 'tribe_venue', 'tribe_organizer'];
  $filtered_pts = array_diff($post_types, $excluded_pts);
  
  if (empty($filtered_pts)) {
    $terms = get_terms([
      'taxonomy'   => $taxonomy,
      'hide_empty' => true,
      'number'     => $limit,
    ]);
    
    if (is_wp_error($terms)) return [];
    
    $result = array_map(fn($t) => [
      'id'     => (int) $t->term_id,
      'name'   => $t->name,
      'slug'   => $t->slug,
      'parent' => (int) $t->parent,
    ], $terms);
    
    wp_cache_set($cache_key, $result, 'tsb_terms', 300);
    return $result;
  }
  
  $all_terms = get_terms([
    'taxonomy'   => $taxonomy,
    'hide_empty' => false,
    'number'     => $limit,
  ]);
  
  if (is_wp_error($all_terms) || empty($all_terms)) return [];
  
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
  
  // Include ancestors
  $all_valid_ids = $terms_with_posts;
  foreach ($terms_with_posts as $tid) {
    $ancestors = get_ancestors($tid, $taxonomy, 'taxonomy');
    $all_valid_ids = array_merge($all_valid_ids, $ancestors);
  }
  $all_valid_ids = array_unique($all_valid_ids);
  
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

function tsb_build_term_tree_for_archive(array $terms): array {
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
  
  $sort_tree = function(&$nodes) use (&$sort_tree) {
    usort($nodes, fn($a, $b) => strcasecmp($a['name'], $b['name']));
    foreach ($nodes as &$n) {
      if (!empty($n['children'])) $sort_tree($n['children']);
    }
  };
  $sort_tree($roots);
  
  return $roots;
}

/**
 * Get children of a specific term that have posts
 */
function tsb_get_term_children_with_posts(int $parent_term_id, string $taxonomy, array $post_types): array {
  global $wpdb;
  
  $children = get_terms([
    'taxonomy'   => $taxonomy,
    'parent'     => $parent_term_id,
    'hide_empty' => false,
    'orderby'    => 'name',
    'order'      => 'ASC',
  ]);
  
  if (is_wp_error($children) || empty($children)) return [];
  
  // Filter by post types if specified
  $excluded_pts = ['tribe_events', 'tribe_venue', 'tribe_organizer'];
  $filtered_pts = array_diff($post_types, $excluded_pts);
  
  if (empty($filtered_pts)) {
    // No filtering needed, just return non-empty children
    return array_values(array_filter(
      array_map(fn($c) => [
        'id'     => (int) $c->term_id,
        'name'   => $c->name,
        'slug'   => $c->slug,
        'parent' => (int) $c->parent,
      ], $children),
      fn($c) => get_term($c['id'])->count > 0
    ));
  }
  
  $child_ids = wp_list_pluck($children, 'term_id');
  $term_placeholders = implode(',', array_fill(0, count($child_ids), '%d'));
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
  ", array_merge($child_ids, [$taxonomy], $filtered_pts));
  
  $children_with_posts = $wpdb->get_col($query);
  $children_with_posts = array_map('intval', $children_with_posts);
  
  $result = [];
  foreach ($children as $child) {
    if (in_array((int)$child->term_id, $children_with_posts, true)) {
      $result[] = [
        'id'     => (int) $child->term_id,
        'name'   => $child->name,
        'slug'   => $child->slug,
        'parent' => (int) $child->parent,
      ];
    }
  }
  
  return $result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Resolve context
// ─────────────────────────────────────────────────────────────────────────────

$multi_pt_raw = get_query_var('tsb_multi_pt');
$post_types   = [];

if ( $multi_pt_raw ) {
  $slugs = array_filter(array_map('trim', explode('.', $multi_pt_raw)));
  foreach ($slugs as $slug) {
    $base = sanitize_key($slug);
    $gd   = 'gd_' . $base;
    if ( post_type_exists($gd) )      $post_types[] = $gd;
    elseif ( post_type_exists($base) ) $post_types[] = $base;
    elseif ( post_type_exists($slug) ) $post_types[] = $slug;
  }
  $post_types = array_values(array_unique($post_types));
}

if ( empty($post_types) ) {
  $q_pt = get_query_var('post_type');
  if ( is_array($q_pt) )       $post_types = array_values(array_filter($q_pt));
  elseif ( is_string($q_pt) && $q_pt )  $post_types = [$q_pt];

  if ( is_post_type_archive() ) {
    $pt = get_post_type();
    if ($pt) $post_types = [$pt];
  }

  if ( empty($post_types) && ! empty($_SERVER['REQUEST_URI']) ) {
    $parts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
    if (!empty($parts[0]) && preg_match('/^[a-z0-9_]+$/i', $parts[0])) {
      $maybe_gd = 'gd_' . sanitize_key($parts[0]);
      if ( post_type_exists($maybe_gd) ) {
        $post_types = [$maybe_gd];
      } elseif ( post_type_exists(sanitize_key($parts[0])) ) {
        $post_types = [sanitize_key($parts[0])];
      }
    }
  }
}

if ( empty($post_types) ) $post_types = ['post'];

$for_term_detection = count($post_types) === 1 ? $post_types[0] : null;
list($taxonomy, $current_term_id, $current_term_slug, $current_term_obj) = tsb_detect_current_term($for_term_detection);

// Get taxonomy object if we have a current taxonomy
$current_tax_obj = $taxonomy ? get_taxonomy($taxonomy) : null;

// ─────────────────────────────────────────────────────────────────────────────
// Build filters WITH pre-fetched terms
// ─────────────────────────────────────────────────────────────────────────────
$filters = [];
$excluded_taxonomies = ['theme', 'location_tag', 'post_tag', 'category', 'audience_tag', 'tribe_events_cat', 'post_format', 'nav_menu', 'link_category', 'wp_theme'];

// ─────────────────────────────────────────────────────────────────────────────
// If we're on a taxonomy archive, handle the current taxonomy specially
// ─────────────────────────────────────────────────────────────────────────────
if ($taxonomy && $current_term_id && $current_tax_obj) {
  // Check if current taxonomy is hierarchical and if current term has children
  if ($current_tax_obj->hierarchical) {
    $child_terms = tsb_get_term_children_with_posts($current_term_id, $taxonomy, $post_types);
    
    if (!empty($child_terms)) {
      // Current term has children - show them as filter options
      $filters[] = [
        'taxonomy' => $taxonomy,
        'label'    => $current_tax_obj->labels->singular_name ?? 'Subcategory',
        'terms'    => $child_terms,
      ];
    }
    // If no children, don't add this taxonomy to filters at all
    // (user is already filtered to a leaf term)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Collect other taxonomies (not the current one we're filtering by)
// ─────────────────────────────────────────────────────────────────────────────
if (count($post_types) === 1) {
  $all_taxonomies = get_object_taxonomies($post_types[0], 'objects');
  
  foreach ($all_taxonomies as $slug => $tax_obj) {
    // Skip excluded taxonomies
    if (in_array($slug, $excluded_taxonomies, true)) continue;
    
    // Skip the current taxonomy (already handled above)
    if ($slug === $taxonomy) continue;
    
    // Skip non-public taxonomies
    if (!$tax_obj->public) continue;
    
    $tax_terms = tsb_get_filtered_terms_for_archive($slug, $post_types);
    if (empty($tax_terms)) continue;
    
    $is_hierarchical = $tax_obj->hierarchical && count(array_filter($tax_terms, fn($t) => $t['parent'] > 0)) > 0;
    
    $filters[] = [
      'taxonomy' => $slug,
      'label'    => $tax_obj->labels->singular_name,
      'terms'    => $is_hierarchical ? tsb_build_term_tree_for_archive($tax_terms) : $tax_terms,
    ];
  }
} else {
  // Multi CPT: find shared taxonomies
  $shared_taxonomies = null;
  foreach ($post_types as $pt) {
    $pt_taxonomies = get_object_taxonomies($pt, 'names');
    if ($shared_taxonomies === null) {
      $shared_taxonomies = $pt_taxonomies;
    } else {
      $shared_taxonomies = array_intersect($shared_taxonomies, $pt_taxonomies);
    }
  }
  
  if ($shared_taxonomies) {
    foreach ($shared_taxonomies as $tax_name) {
      // Skip excluded taxonomies
      if (in_array($tax_name, $excluded_taxonomies, true)) continue;
      
      // Skip the current taxonomy (already handled above)
      if ($tax_name === $taxonomy) continue;
      
      $tax_obj = get_taxonomy($tax_name);
      if (!$tax_obj || !$tax_obj->public) continue;
      
      $tax_terms = tsb_get_filtered_terms_for_archive($tax_name, $post_types);
      if (empty($tax_terms)) continue;
      
      $is_hierarchical = $tax_obj->hierarchical && count(array_filter($tax_terms, fn($t) => $t['parent'] > 0)) > 0;
      
      $filters[] = [
        'taxonomy' => $tax_name,
        'label'    => $tax_obj->labels->singular_name,
        'terms'    => $is_hierarchical ? tsb_build_term_tree_for_archive($tax_terms) : $tax_terms,
      ];
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Base API query
// ─────────────────────────────────────────────────────────────────────────────
$base_query = [
  'post_type' => $post_types,
  'per_page'  => 12,
  'order'     => 'DESC',
  'orderby'   => 'date',
];

$tax_parts = [];

if ($taxonomy && $current_term_id) {
  $tax_parts[] = [
    'taxonomy'         => $taxonomy,
    'field'            => 'term_id',
    'terms'            => [(int)$current_term_id],
    'operator'         => 'IN',
    'include_children' => true,
  ];
}

$extra_parts = tsb_collect_url_tax_filters();
foreach ($extra_parts as $tp) {
  $tax_parts[] = $tp;
}

if (!empty($tax_parts)) {
  $base_query['tax'] = $tax_parts;
  $base_query['tax_relation'] = 'AND';
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint and title
// ─────────────────────────────────────────────────────────────────────────────
$endpoint = (count($post_types) === 1 && $post_types[0] === 'tribe_events')
  ? '/wp-json/tsb/v1/events'
  : '/wp-json/tsb/v1/browse';

if (count($post_types) === 1 && $post_types[0] === 'podcast') {
  $title = 'Podcasts and Interviews';
} elseif (count($post_types) > 1) {
  $title = tsb_clean_archive_title_from_pts($post_types);
} else {
  $title = tsb_clean_archive_title();
}

// Build subtitle for taxonomy archives
$subtitle = '';
if ($taxonomy && $current_term_obj) {
  $subtitle = wp_strip_all_tags(term_description($current_term_obj, $taxonomy) ?: '');
}

$breadcrumbs = function_exists('sbp_build_breadcrumbs') ? sbp_build_breadcrumbs() : [];

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
$props = [
  'postType'    => (count($post_types) === 1) ? $post_types[0] : $post_types,
  'taxonomy'    => $taxonomy ?: '',
  'filters'     => $filters,
  'endpoint'    => $endpoint,
  'baseQuery'   => $base_query,
  'title'       => $title,
  'subtitle'    => $subtitle,
  'currentTerm' => ($taxonomy && $current_term_id) ? [
    'id'       => (int)$current_term_id,
    'slug'     => $current_term_slug,
    'taxonomy' => $taxonomy,
  ] : null,
  'breadcrumbs' => $breadcrumbs,
];

?>
<main id="content" class="generic-archive">
  <div
    id="generic-archive-root"
    data-component="GenericArchivePage"
    data-props='<?php echo esc_attr( wp_json_encode( $props, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) ); ?>'>
  </div>
</main>
<?php get_footer(); ?>