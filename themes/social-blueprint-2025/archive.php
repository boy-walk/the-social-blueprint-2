<?php
/**
 * Generalized archive template for CPTs and taxonomies.
 * Passes post_type/taxonomy and filter definitions to a React component.
 * Save this as archive.php in your theme or place inside templates/archive and use a template_include filter.
 */

get_header();

// Determine if this is a CPT archive or a taxonomy archive.
$queried_object = get_queried_object();
$post_type      = null;
$taxonomy       = null;
$current_term   = null;

// CPT archive (e.g. /directory/)
if ( is_post_type_archive() ) {
    $post_type = get_post_type(); // e.g. 'gd_discount' or 'podcast'
}
// Taxonomy archive (e.g. /topic_tag/community-connection/)
elseif ( is_category() || is_tag() || is_tax() ) {
    if ( isset( $queried_object->taxonomy ) ) {
        $taxonomy   = $queried_object->taxonomy; // e.g. 'topic_tag' or 'theme'
        $current_term = $queried_object->slug;   // slug of the current term
        // Identify which post types are associated with this taxonomy.  If more than one, pick the first.
        $tax_object = get_taxonomy( $taxonomy );
        if ( isset( $tax_object->object_type ) && count( $tax_object->object_type ) > 0 ) {
            $post_type = $tax_object->object_type[0];
        }
    }
}

// Fall back to 'post' if nothing determined.
$post_type = $post_type ?: 'post';

// Build list of taxonomies associated with the current post type.

$all_taxonomies = get_object_taxonomies( $post_type, 'objects' );
$taxonomies = array_filter( $all_taxonomies, function( $tax ) {
    return ! in_array( $tax->name, [ 'theme', 'location_tag', 'people_tag' ], true );
} );
$filters = [];
foreach ( $taxonomies as $slug => $tax_obj ) {
    // Hide WordPress defaults like post_tag and category unless they are your custom filters
    if ( in_array( $slug, [ 'post_tag', 'category' ], true ) ) continue;
    $filters[] = [
        'taxonomy'   => $slug,
        'label'      => $tax_obj->labels->singular_name,
    ];
}

// Build a base query that the React component will post to your API.
// For example, your custom API /wp-json/tsb/v1/browse can accept post_type and tax filters.
$base_query = [
    'post_type'   => [$post_type],
    'per_page'    => 12,
    'order'       => 'DESC',
    'orderby'     => 'date',
];
// If the user is viewing a taxonomy archive, pre‑filter results by the current term.
if ( $taxonomy && $current_term ) {
    $base_query['tax'] = [
        [
            'taxonomy' => $taxonomy,
            'field'    => 'slug',
            'terms'    => [ $current_term ],
        ],
    ];
}

// Choose the API endpoint.  Use your existing browse endpoint or special events endpoint for tribe_events.
$endpoint = '/wp-json/tsb/v1/browse';
if ( $post_type === 'tribe_events' ) {
    $endpoint = '/wp-json/tsb/v1/events';
}

if (!function_exists('tsb_clean_archive_title')) {
  function tsb_clean_archive_title(): string {
    if (is_category())            return single_cat_title('', false);
    if (is_tag())                 return single_tag_title('', false);
    if (is_tax())                 return single_term_title('', false);
    if (is_post_type_archive())   return post_type_archive_title('', false);
    if (is_author())              return get_the_author();
    if (is_year())                return get_the_date('Y');
    if (is_month())               return get_the_date('F Y');
    if (is_day())                 return get_the_date('F j, Y');
    // Fallback to WP's default if none matched
    return get_the_archive_title();
  }
}

// Props for the React component.  You can add more fields as needed.
$props = [
    'postType' => $post_type,
    'taxonomy' => $taxonomy ?: '',
    'filters'  => $filters,
    'endpoint' => $endpoint,
    'baseQuery'=> $base_query,
    'title'    => tsb_clean_archive_title(),
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
