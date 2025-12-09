<?php
/**
 * Taxonomy archive template
 * Handles all taxonomy term archives with support for hierarchical drilling
 */

get_header();

$props = [];

if ( is_tax() ) {
  $qo        = get_queried_object();  // WP_Term object
  $taxonomy  = $qo->taxonomy;
  $term_id   = (int) $qo->term_id;
  $term_slug = $qo->slug;

  // All post types attached to this taxonomy
  $tx        = get_taxonomy( $taxonomy );
  $attached  = $tx ? (array) $tx->object_type : [];

  // Choose which types you actually want to show on taxonomy archives
  $allowed   = ['article', 'podcast', 'tribe_events'];
  $post_types = array_values( array_intersect( $attached, $allowed ) );
  if ( empty( $post_types ) ) {
    $post_types = $allowed;
  }

  // Build filters array
  $filters = [];

  // Current taxonomy filter - with child terms pre-fetched
  if ( $tx && $tx->hierarchical ) {
    $children = get_terms([
      'taxonomy'   => $taxonomy,
      'parent'     => $term_id,
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
          'parent' => $term_id,
          'count'  => (int) $child->count,
        ];
      }
      // Only add filter if there are children
      $filters[] = [
        'taxonomy' => $taxonomy,
        'label'    => $tx->labels->singular_name ?? 'Subtopic',
        'terms'    => $child_terms,  // Pre-fetched terms
      ];
    }
  }

  // Other taxonomy filters
  if ( $taxonomy !== 'topic_tag' ) {
    $filters[] = ['taxonomy' => 'topic_tag', 'label' => 'Topic'];
  }
  if ( $taxonomy !== 'audience_tag' ) {
    $filters[] = ['taxonomy' => 'audience_tag', 'label' => 'Audience'];
  }
  if ( in_array( 'tribe_events', $post_types, true ) && $taxonomy !== 'tribe_events_cat' ) {
    $filters[] = ['taxonomy' => 'tribe_events_cat', 'label' => 'Event Category'];
  }

  // Build breadcrumbs
  $breadcrumbs = function_exists('sbp_build_breadcrumbs') ? sbp_build_breadcrumbs() : [];

  $props = [
    'postType'    => (count($post_types) === 1) ? $post_types[0] : $post_types,
    'taxonomy'    => $taxonomy,
    'filters'     => $filters,
    'endpoint'    => '/wp-json/tsb/v1/browse',
    'baseQuery'   => [
      'post_type' => $post_types,
      'per_page'  => 12,
      'order'     => 'DESC',
      'orderby'   => 'date',
      'tax'       => [
        [
          'taxonomy'         => $taxonomy,
          'field'            => 'term_id',
          'terms'            => [ $term_id ],
          'include_children' => true,
        ],
      ],
      'tax_relation' => 'AND',
    ],
    'title'       => single_term_title('', false),
    'subtitle'    => term_description( $qo, $taxonomy ),
    'currentTerm' => [
      'id'       => $term_id,
      'slug'     => $term_slug,
      'taxonomy' => $taxonomy,
    ],
    'breadcrumbs' => $breadcrumbs,
  ];

} else {
  // Fallback for normal post-type archives
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