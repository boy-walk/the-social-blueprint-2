<?php
/**
 * Generalized archive template for CPTs and taxonomies.
 * Save as archive.php in your theme.
 *
 * Supports multi-CPT archives via query var `tsb_multi_pt`
 * (set by the rewrite rule in functions.php) — e.g. /aid_listing.health_listing/
 * ALSO: Reads any public taxonomy query vars (e.g. ?topic_tag=mental-health)
 * and injects them into the API base query.
 */

get_header();

/** ---------------- Helpers ---------------- */

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

/** Robust current-term detector (works for GD too). */
function tsb_detect_current_term(?string $post_type): array {
  $qo = get_queried_object();
  if ( $qo instanceof WP_Term ) return [ $qo->taxonomy, (int)$qo->term_id, $qo->slug ];

  $q_tax  = get_query_var('taxonomy');
  $q_term = get_query_var('term');
  if ( $q_tax && $q_term ) {
    $t = get_term_by('slug', $q_term, $q_tax);
    if ( $t && ! is_wp_error($t) ) return [ $t->taxonomy, (int)$t->term_id, $t->slug ];
  }

  $cat_name = get_query_var('category_name');
  if ( $cat_name ) {
    $t = get_term_by('slug', $cat_name, 'category');
    if ( $t && ! is_wp_error($t) ) return [ 'category', (int)$t->term_id, $t->slug ];
  }

  $tag_slug = get_query_var('tag');
  if ( $tag_slug ) {
    $t = get_term_by('slug', $tag_slug, 'post_tag');
    if ( $t && ! is_wp_error($t) ) return [ 'post_tag', (int)$t->term_id, $t->slug ];
  }

  // Scan taxonomies on this post type (or all public if unknown)
  $tax_objects = $post_type
    ? get_object_taxonomies( $post_type, 'objects' )
    : get_taxonomies( ['public' => true], 'objects' );

  foreach ( $tax_objects as $tx ) {
    $qv  = $tx->query_var ? $tx->query_var : $tx->name;
    $val = get_query_var( $qv );
    if ( $val ) {
      $slug = is_array($val) ? reset($val) : $val;
      $t = get_term_by('slug', $slug, $tx->name);
      if ( $t && ! is_wp_error($t) ) return [ $tx->name, (int)$t->term_id, $t->slug ];
    }
  }

  // URL fallback like /{something}/category/{slug}/ or /{something}/tag/{slug}/
  $req = isset($_SERVER['REQUEST_URI']) ? trim($_SERVER['REQUEST_URI'], '/') : '';
  if ( $req ) {
    $segments = explode('/', $req);
    foreach (['category', 'tag'] as $needle) {
      $i = array_search($needle, $segments, true);
      if ($i !== false && isset($segments[$i+1])) {
        $slug = sanitize_title($segments[$i+1]);
        foreach ($tax_objects as $tx) {
          $rw = is_array($tx->rewrite ?? null) ? ($tx->rewrite['slug'] ?? '') : '';
          if ($rw === $needle) {
            $t = get_term_by('slug', $slug, $tx->name);
            if ( $t && ! is_wp_error($t) ) return [ $tx->name, (int)$t->term_id, $t->slug ];
          }
        }
      }
    }
  }

  return [ null, null, null ];
}

/**
 * Collect ANY public taxonomy filters present in the URL and convert them to
 * WP_Query-style tax_query parts (by term_id).
 * Accepts comma- or dot-separated slug lists: ?topic_tag=mental-health,anxiety
 */
function tsb_collect_url_tax_filters(): array {
  $out = [];
  $tax_objects = get_taxonomies( ['public' => true], 'objects' );
  foreach ( $tax_objects as $tx ) {
    $qv  = $tx->query_var ? $tx->query_var : $tx->name; // e.g. 'topic_tag', 'category_name', 'tag'
    $val = get_query_var( $qv );
    if ( ! $val ) continue;

    // Normalize into an array of slugs
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

/** ---------------- Resolve context (single or multi CPT) ---------------- */

// 1) Multi-CPT via our custom query var (set by rewrite rule)
$multi_pt_raw = get_query_var('tsb_multi_pt'); // e.g. "aid_listing.health_listing"
$post_types   = [];

if ( $multi_pt_raw ) {
  $slugs = array_filter(array_map('trim', explode('.', $multi_pt_raw)));
  foreach ($slugs as $slug) {
    $base = sanitize_key($slug); // keep underscores
    $gd   = 'gd_' . $base;
    if ( post_type_exists($gd) )      $post_types[] = $gd;
    elseif ( post_type_exists($base) ) $post_types[] = $base;
    elseif ( post_type_exists($slug) ) $post_types[] = $slug;
  }
  $post_types = array_values(array_unique($post_types));
}

// 2) If not multi, fall back to WordPress-normal detection
if ( empty($post_types) ) {
  $q_pt = get_query_var('post_type');
  if ( is_array($q_pt) )       $post_types = array_values(array_filter($q_pt));
  elseif ( is_string($q_pt) )  $post_types = [$q_pt];

  if ( is_post_type_archive() ) {
    $pt = get_post_type();
    if ($pt) $post_types = [$pt];
  }

  // Infer GD CPT from first URL segment if still unknown
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

// Final fallback
if ( empty($post_types) ) $post_types = ['post'];

// Detect a single "current term" (only used for title/context on real tax archives)
$for_term_detection = count($post_types) === 1 ? $post_types[0] : null;
list($taxonomy, $current_term_id, $current_term_slug) = tsb_detect_current_term($for_term_detection);

/** ---------------- Filters (server-provided) ----------------
 * For single CPT we emit its taxonomies (except excluded ones).
 * For multi CPT, we find SHARED taxonomies across all post types.
 */
$filters = [];
$excluded_taxonomies = [ 'theme', 'location_tag', 'post_tag', 'category', 'audience_tag' ];

if ( count($post_types) === 1 ) {
  // Single CPT: use its taxonomies
  $all_taxonomies = get_object_taxonomies( $post_types[0], 'objects' );
  $taxonomies = array_filter( $all_taxonomies, function( $tax ) use ( $excluded_taxonomies ) {
    return ! in_array( $tax->name, $excluded_taxonomies, true );
  } );
  foreach ( $taxonomies as $slug => $tax_obj ) {
    $filters[] = [
      'taxonomy' => $slug,
      'label'    => $tax_obj->labels->singular_name,
    ];
  }
} else {
  // Multi CPT: find shared taxonomies across all post types
  $shared_taxonomies = null;
  foreach ( $post_types as $pt ) {
    $pt_taxonomies = get_object_taxonomies( $pt, 'names' );
    if ( $shared_taxonomies === null ) {
      $shared_taxonomies = $pt_taxonomies;
    } else {
      $shared_taxonomies = array_intersect( $shared_taxonomies, $pt_taxonomies );
    }
  }
  
  if ( $shared_taxonomies ) {
    foreach ( $shared_taxonomies as $tax_name ) {
      if ( in_array( $tax_name, $excluded_taxonomies, true ) ) continue;
      $tax_obj = get_taxonomy( $tax_name );
      if ( $tax_obj ) {
        $filters[] = [
          'taxonomy' => $tax_name,
          'label'    => $tax_obj->labels->singular_name,
        ];
      }
    }
  }
}

/** ---------------- Base API query ---------------- */
$base_query = [
  'post_type' => $post_types,   // <<< supports multiple CPTs
  'per_page'  => 12,
  'order'     => 'DESC',
  'orderby'   => 'date',
];

// Compile tax filters from (a) the actual tax archive context and (b) query-string filters
$tax_parts = [];

if ( $taxonomy && $current_term_id ) {
  $tax_parts[] = [
    'taxonomy'         => $taxonomy,
    'field'            => 'term_id',
    'terms'            => [ (int)$current_term_id ],
    'operator'         => 'IN',
    'include_children' => true,
    'hide_empty'      => true,
  ];
}

// Add any extra filters from URL query vars, e.g. ?topic_tag=mental-health
$extra_parts = tsb_collect_url_tax_filters();
foreach ($extra_parts as $tp) {
  $tax_parts[] = $tp;
}

if ( !empty($tax_parts) ) {
  $base_query['tax'] = $tax_parts;
  $base_query['tax_relation'] = 'AND';
}

/** ---------------- Endpoint selection ---------------- */
$endpoint = (count($post_types) === 1 && $post_types[0] === 'tribe_events')
  ? '/wp-json/tsb/v1/events'
  : '/wp-json/tsb/v1/browse';

/** ---------------- Title ---------------- */
if (count($post_types) === 1 && $post_types[0] === 'podcast') {
  $title = 'Podcasts and Interviews';
} elseif (count($post_types) > 1) {
  $title = tsb_clean_archive_title_from_pts($post_types);
} else {
  $title = tsb_clean_archive_title();
}

$breadcrumbs = sbp_build_breadcrumbs();

/** ---------------- Props ---------------- */
$props = [
  'postType'    => (count($post_types) === 1) ? $post_types[0] : $post_types, // string or array
  'taxonomy'    => $taxonomy ?: '',
  'filters'     => $filters,
  'endpoint'    => $endpoint,
  'baseQuery'   => $base_query,
  'title'       => $title,
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