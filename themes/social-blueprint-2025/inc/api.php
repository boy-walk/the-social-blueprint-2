<?php
/**
 * Register a custom REST API route for events fetching.
 */
function sbp_register_custom_rest_routes() {
    register_rest_route( 'sbp/v1', '/events', array(
        'methods'  => WP_REST_Server::READABLE, // GET
        'callback' => 'sbp_rest_get_events',
        'permission_callback' => '__return_true',
    ) );
}
add_action( 'rest_api_init', 'sbp_register_custom_rest_routes' );

/**
 * Callback for /events route
 * @return WP_Error|WP_REST_Response
 */
function sbp_rest_get_events( WP_REST_Request $request ) {
    // --- per_page (cap for safety)
    $per_page = (int) ( $request->get_param('per_page') ?? 100 );
    if ( $per_page > 150 ) $per_page = 150;
    if ( $per_page < 1 )   $per_page = 1;

    // --- tax_query
    $tax_query = array();

    $types = $request->get_param('types') ?? '';
    if ( ! empty( $types ) ) {
        $ids = array_filter( array_map( 'intval', explode( ',', $types ) ) );
        if ( $ids ) {
            $tax_query[] = array(
                'taxonomy' => 'theme',
                'field'    => 'term_id',
                'terms'    => $ids,
            );
        }
    }

    $topics = $request->get_param('topics') ?? '';
    if ( ! empty( $topics ) ) {
        $ids = array_filter( array_map( 'intval', explode( ',', $topics ) ) );
        if ( $ids ) {
            $tax_query[] = array(
                'taxonomy' => 'topic_tag',
                'field'    => 'term_id',
                'terms'    => $ids,
            );
        }
    }

    $audience = $request->get_param('audience') ?? '';
    if ( ! empty( $audience ) ) {
        $ids = array_filter( array_map( 'intval', explode( ',', $audience ) ) );
        if ( $ids ) {
            $tax_query[] = array(
                'taxonomy' => 'audience_tag',
                'field'    => 'term_id',
                'terms'    => $ids,
            );
        }
    }

    $locations = $request->get_param('locations') ?? '';
    if ( ! empty( $locations ) ) {
        $ids = array_filter( array_map( 'intval', explode( ',', $locations ) ) );
        if ( $ids ) {
            $tax_query[] = array(
                'taxonomy' => 'location_tag',
                'field'    => 'term_id',
                'terms'    => $ids,
            );
        }
    }

    if ( count( $tax_query ) > 1 ) {
        $tax_query = array_merge( array( 'relation' => 'AND' ), $tax_query );
    }

    // --- meta_query for is_featured (boolean post meta)
    $meta_query = array();
    $is_featured_param = $request->get_param('is_featured');
    if ( $is_featured_param !== null && $is_featured_param !== '' ) {
        // Accept 1/true/yes/on (case-insensitive)
        $truthy = filter_var( $is_featured_param, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );
        if ( $truthy ) {
            $meta_query[] = array(
                'key'     => 'is_featured',
                'value'   => 1,
                'compare' => '=',
                'type'    => 'NUMERIC',
            );
        }
    }
    if ( count( $meta_query ) > 1 ) {
        $meta_query = array_merge( array( 'relation' => 'AND' ), $meta_query );
    }

    // --- Dates & search
    $start_date = sanitize_text_field( $request->get_param('start_date') ?? '' );
    $end_date   = sanitize_text_field( $request->get_param('end_date') ?? '' );
    $search     = sanitize_text_field( $request->get_param('s') ?? '' );

    // --- Build args for tribe_get_events
    $args = array(
        'posts_per_page' => $per_page,
        'post_status'    => array( 'publish', 'future' ),
        // Keep default ordering, or uncomment to order by start date explicitly:
        // 'orderby'     => 'meta_value',
        // 'meta_key'    => '_EventStartDate',
        // 'order'       => 'ASC',
    );

    if ( $start_date ) $args['start_date'] = $start_date;
    if ( $end_date )   $args['end_date']   = $end_date;
    if ( $search )     $args['s']          = $search;
    if ( ! empty( $tax_query ) )  $args['tax_query']  = $tax_query;
    if ( ! empty( $meta_query ) ) $args['meta_query'] = $meta_query;

    // --- Fetch events
    $events = tribe_get_events( $args );

    // --- Shape response for FullCalendar
    $result = array();
    foreach ( $events as $event ) {
        $result[] = array(
            'id'          => $event->ID,
            'title'       => $event->post_title,
            'start'       => tribe_get_start_date( $event, true, 'Y-m-d H:i:s' ),
            'end'         => tribe_get_end_date( $event, true, 'Y-m-d H:i:s' ),
            'url'         => tribe_get_event_link( $event ),
            'description' => tribe_events_get_the_excerpt( $event ),
            'image'       => get_the_post_thumbnail_url( $event, 'medium' ),
        );
    }

    return rest_ensure_response( array( 'events' => $result, 'success' => true ) );
}
