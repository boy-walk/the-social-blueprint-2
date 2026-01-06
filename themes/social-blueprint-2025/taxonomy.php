<?php
/**
 * Taxonomy archive template
 * Handles all taxonomy term archives with support for:
 * - Multiple terms via dot notation: /topic_tag/term1.term2.term3
 * - Hierarchical drilling into child terms
 */

get_header();

$props = [];

if ( is_tax() || is_category() || is_tag() ) {
  $qo = get_queried_object();  // WP_Term object (primary term)
  
  if ( ! $qo instanceof WP_Term ) {
    get_template_part( '404' );
    return;
  }

  $taxonomy  = $qo->taxonomy;
  $tx        = get_taxonomy( $taxonomy );

  // ──────────────────────────────────────────────────────────────────────────
  // Parse multiple terms from query var (set by our request filter)
  // ──────────────────────────────────────────────────────────────────────────
  $multi_term_string = get_query_var('tsb_multi_term', '');
  
  $terms    = [ $qo ];
  $term_ids = [ (int) $qo->term_id ];

  if ( $multi_term_string && strpos($multi_term_string, '.') !== false ) {
    $slugs = array_filter(array_map('sanitize_title', explode('.', $multi_term_string)));
    
    if ( count($slugs) > 1 ) {
      $terms    = [];
      $term_ids = [];

      foreach ( $slugs as $slug ) {
        $term = get_term_by('slug', $slug, $taxonomy);
        if ( $term && ! is_wp_error($term) ) {
          $terms[]    = $term;
          $term_ids[] = (int) $term->term_id;
        }
      }

      // Fallback to queried object if no valid terms found
      if ( empty($terms) ) {
        $terms    = [ $qo ];
        $term_ids = [ (int) $qo->term_id ];
      }
    }
  }

  $is_multi_term = count($terms) > 1;

  // ──────────────────────────────────────────────────────────────────────────
  // Determine post types
  // ──────────────────────────────────────────────────────────────────────────
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

  // ──────────────────────────────────────────────────────────────────────────
  // Build filters
  // ──────────────────────────────────────────────────────────────────────────
  $filters = [];
  $excluded_taxonomies = ['post_format', 'nav_menu', 'link_category', 'wp_theme', 'tribe_events_cat'];

  // Add child terms filter for hierarchical taxonomies (single term only)
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
          'count'  => (int) $child->count,
        ];
      }
      $filters[] = [
        'taxonomy' => $taxonomy,
        'label'    => $tx->labels->singular_name ?? 'Subcategory',
        'terms'    => $child_terms,
      ];
    }
  }

  // Add other relevant taxonomy filters
  $other_taxonomies = [];
  foreach ( $post_types as $pt ) {
    $pt_taxes = get_object_taxonomies($pt, 'objects');
    foreach ( $pt_taxes as $pt_tax ) {
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

  foreach ( $other_taxonomies as $other_tax ) {
    if ( $other_tax->name === 'tribe_events_cat' && !in_array('tribe_events', $post_types, true) ) {
      continue;
    }
    $filters[] = [
      'taxonomy' => $other_tax->name,
      'label'    => $other_tax->labels->singular_name ?? $other_tax->label,
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Build title and subtitle
  // ──────────────────────────────────────────────────────────────────────────
  if ( $is_multi_term ) {
    $term_names = array_map(function($t) { return $t->name; }, $terms);
    $title = implode(', ', $term_names);
    $subtitle = sprintf('Browsing %s', $tx->labels->name ?? $taxonomy);
  } else {
    $title = single_term_title('', false);
    $subtitle = wp_strip_all_tags(term_description($qo, $taxonomy) ?: '');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Build breadcrumbs
  // ──────────────────────────────────────────────────────────────────────────
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
        'label' => implode(' + ', array_map(function($t) { return $t->name; }, $terms)),
        'url'   => '',
      ];
    } else {
      $breadcrumbs = sbp_build_breadcrumbs();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Build props
  // ──────────────────────────────────────────────────────────────────────────
  $current_term_info = $is_multi_term 
    ? [
        'multiple' => true,
        'terms'    => array_map(function($t) use ($taxonomy) {
          return [
            'id'       => (int) $t->term_id,
            'slug'     => $t->slug,
            'name'     => $t->name,
            'taxonomy' => $taxonomy,
          ];
        }, $terms),
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
  // Fallback for post-type archives
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