<?php
/**
 * Archive template specifically for GeoDirectory "Message Boards" (gd_discount).
 * Save as: archive-gd_discount.php
 *
 * Mounts a specialized React app: MessageBoardArchivePage.
 * It passes explicit taxonomies attached to gd_discount so the React side
 * can fetch terms regardless of show_in_rest status (via fallback endpoint).
 */

get_header();

/** ---------- Helpers ---------- */
if (!function_exists('tsb_mb_title')) {
  function tsb_mb_title(): string {
    if ( is_category() )          return single_cat_title('', false);
    if ( is_tag() )               return single_tag_title('', false);
    if ( is_tax() )               return single_term_title('', false);
    if ( is_post_type_archive() ) return post_type_archive_title('', false);
    if ( is_author() )            return get_the_author();
    if ( is_year() )              return get_the_date('Y');
    if ( is_month() )             return get_the_date('F Y');
    if ( is_day() )               return get_the_date('F j, Y');
    return get_the_archive_title();
  }
}

if (!function_exists('tsb_mb_detect_current_term')) {
  function tsb_mb_detect_current_term(): array {
    $qo = get_queried_object();
    if ($qo instanceof WP_Term) return [ $qo->taxonomy, (int)$qo->term_id, $qo->slug ];
    $q_tax  = get_query_var('taxonomy');
    $q_term = get_query_var('term');
    if ($q_tax && $q_term) {
      $t = get_term_by('slug', $q_term, $q_tax);
      if ($t && !is_wp_error($t)) return [ $t->taxonomy, (int)$t->term_id, $t->slug ];
    }
    return [ null, null, null ];
  }
}

if (!function_exists('tsb_mb_collect_url_tax_filters')) {
  function tsb_mb_collect_url_tax_filters(): array {
    $out = [];
    $tax_objects = get_taxonomies(['public' => true], 'objects');
    foreach ($tax_objects as $tx) {
      $qv  = $tx->query_var ? $tx->query_var : $tx->name;
      $val = get_query_var($qv);
      if (!$val) continue;

      if (is_array($val)) $slugs = array_map('sanitize_title', $val);
      else $slugs = preg_split('/[.,\s]+/', (string)$val, -1, PREG_SPLIT_NO_EMPTY);

      $term_ids = [];
      foreach ($slugs as $slug) {
        $taxonomy_for_lookup = ($qv === 'category_name') ? 'category' : (($qv === 'tag') ? 'post_tag' : $tx->name);
        $t = get_term_by('slug', $slug, $taxonomy_for_lookup);
        if ($t && !is_wp_error($t)) $term_ids[] = (int)$t->term_id;
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
}

/** ---------- Fixed CPT context ---------- */
$post_type = 'gd_discount';
list($taxonomy, $current_term_id, $current_term_slug) = tsb_mb_detect_current_term();

/**
 * Build filters from all taxonomies attached to gd_discount (except obvious globals).
 * We do NOT require show_in_rest; the React app will fall back to /tsb/v1/terms.
 */
$filters = [];
$tax_objects = get_object_taxonomies($post_type, 'objects');
foreach ($tax_objects as $slug => $tx) {
  if (in_array($slug, ['post_tag', 'category', 'theme', 'location_tag', 'people_tag'], true)) continue;
  $filters[] = [
    'taxonomy' => $slug,
    'label'    => $tx->labels->singular_name ?? $slug,
  ];
}

/** ---------- Base API query ---------- */
$base_query = [
  'post_type' => [$post_type],
  'per_page'  => 12,
  'order'     => 'DESC',
  'orderby'   => 'date',
];

$tax_parts = [];
if ($taxonomy && $current_term_id) {
  $tax_parts[] = [
    'taxonomy'         => $taxonomy,
    'field'            => 'term_id',
    'terms'            => [ (int)$current_term_id ],
    'operator'         => 'IN',
    'include_children' => true,
  ];
}
$extra = tsb_mb_collect_url_tax_filters();
foreach ($extra as $tp) $tax_parts[] = $tp;

if ($tax_parts) {
  $base_query['tax'] = $tax_parts;
  $base_query['tax_relation'] = 'AND';
}

$breadcrumbs = sbp_build_breadcrumbs();

/** ---------- Props for React ---------- */
$props = [
  'postType'    => $post_type,
  'taxonomy'    => $taxonomy ?: '',
  'currentTerm' => ($taxonomy && $current_term_id) ? [
    'id'       => (int)$current_term_id,
    'slug'     => $current_term_slug,
    'taxonomy' => $taxonomy,
  ] : null,
  'filters'     => $filters,
  'endpoint'    => '/wp-json/tsb/v1/browse',
  'baseQuery'   => $base_query,
  'title'       => tsb_mb_title(),
  'breadcrumbs' => $breadcrumbs,
];

?>
<main id="content" class="generic-archive">
  <div
    id="messageboard-archive-root"
    data-component="MessageBoardArchivePage"
    data-props='<?php echo esc_attr( wp_json_encode( $props, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) ); ?>'>
  </div>
</main>
<?php get_footer(); ?>
