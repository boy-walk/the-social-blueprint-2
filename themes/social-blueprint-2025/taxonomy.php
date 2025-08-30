<?php
get_header();

$props = [];
if ( is_tax() ) {
  $qo        = get_queried_object();                 // term object
  $taxonomy  = $qo->taxonomy;
  $term_slug = $qo->slug;

  // All post types attached to this taxonomy
  $tx        = get_taxonomy( $taxonomy );
  $attached  = $tx ? (array) $tx->object_type : [];

  // Choose which types you actually want to show on taxonomy archives:
  $allowed   = ['article', 'podcast', 'tribe_events']; // adjust as needed
  $post_types = array_values( array_intersect( $attached, $allowed ) );
  if ( empty( $post_types ) ) {
    // sensible fallback
    $post_types = $allowed;
  }

  // Filters to expose in the UI (only ones that make sense across these types)
  $filters = [
    ['taxonomy' => 'topic_tag',    'label' => 'Topic Tags'],
    ['taxonomy' => 'audience_tag', 'label' => 'Audience Tags'],
  ];
  if ( in_array( 'tribe_events', $post_types, true ) ) {
    $filters[] = ['taxonomy' => 'tribe_events_cat', 'label' => 'Event Category'];
  }

  $props = [
    // For mixed results, set null (or omit) so the React page doesn’t assume GD/events.
    'postType' => (count($post_types) === 1) ? $post_types[0] : null,
    'taxonomy' => $taxonomy,
    'filters'  => $filters,

    // IMPORTANT: use your browse endpoint (supports multiple post types)
    'endpoint' => '/wp-json/tsb/v1/browse',

    'baseQuery' => [
      'post_type' => $post_types,
      'per_page'  => 12,
      'order'     => 'DESC',
      'orderby'   => 'date',
      'tax'       => [
        [
          'taxonomy' => $taxonomy,
          'field'    => 'slug',
          'terms'    => [ $term_slug ],
        ],
      ],
      'tax_relation' => 'AND',
    ],

    'title'    => single_term_title('', false),
    'subtitle' => term_description( $qo, $taxonomy ),
  ];
} else {
  // Fallback for normal post-type archives (your existing logic)
  $pt = get_query_var('post_type') ?: get_post_type();
  if (is_array($pt)) $pt = reset($pt);

  $props = [
    'postType' => $pt,
    'taxonomy' => null,
    'filters'  => [
      // tailor per post type if you wish
    ],
    'endpoint'  => ($pt === 'tribe_events') ? '/wp-json/tsb/v1/events' : '/wp-json/tsb/v1/browse',
    'baseQuery' => [
      'post_type' => [$pt],
      'per_page'  => 12,
      'order'     => 'DESC',
      'orderby'   => 'date',
    ],
    'title' => post_type_archive_title('', false),
  ];
}
?>
<div
  id="taxonomy-root"
  data-props='<?php echo esc_attr( wp_json_encode( $props, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) ); ?>'>
</div>
<?php get_footer(); ?>
