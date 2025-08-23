<?php

/**
 * Register a custom REST API route for events fetching.
 */
function sbp_register_custom_rest_routes() {
    register_rest_route( 'sbp/v1', '/events', array(
        'methods'  => WP_REST_Server::READABLE, // Allows GET requests
        'callback' => 'sbp_rest_get_events',
        'permission_callback' => '__return_true', // Allows public access
    ) );
}
add_action( 'rest_api_init', 'sbp_register_custom_rest_routes' );

/**
 * Callback for /events route
 * @return WP_Error|WP_REST_Response
 */
function sbp_rest_get_events(WP_REST_Request $request) {
    $per_page = $request->get_param('per_page') ?? 100;
    $per_page = (int) $per_page;

    if ($per_page > 150) {
        $per_page = 150; // for performance reason
    }

    $tax_query = [];

    $types = $request->get_param('types') ?? '';
    if (!empty($types)) {
        $types = explode(',', $types);
        $tax_query[] = [
            'taxonomy' => 'theme',
            'field' => 'term_id',
            'terms' => $types
        ];
    }

    $topics = $request->get_param('topics') ?? '';
    if (!empty($topics)) {
        $topics = explode(',', $topics);
        $tax_query[] = [
            'taxonomy' => 'topic_tag',
            'field' => 'term_id',
            'terms' => $topics
        ];
    }

    $audience = $request->get_param('audience') ?? '';
    if (!empty($audience)) {
        $audience = explode(',', $audience);
        $tax_query[] = [
            'taxonomy' => 'audience_tag',
            'field' => 'term_id',
            'terms' => $audience
        ];
    }

    $locations = $request->get_param('locations') ?? '';
    if (!empty($locations)) {
        $locations = explode(',', $locations);
        $tax_query[] = [
            'taxonomy' => 'location_tag',
            'field' => 'term_id',
            'terms' => $locations
        ];
    }

    $events = tribe_get_events([
        'posts_per_page' => $request->get_param('per_page') ?? 100,
        'start_date' => $request->get_param('start_date') ?? '',
        'end_date' => $request->get_param('end_date') ?? '',
        'tax_query' => $tax_query,
        's' => $request->get_param('s') ?? ''
    ]);

    $result = [];
    foreach ($events as $event) {
        // setup_postdata($event);
        // The keys are named to match what FullCalendar.io expect
        $result[] = [
            'id' => $event->ID,
            'title' => $event->post_title,
            'start' => tribe_get_start_date($event, true, 'Y-m-d H:i:s'),
            'end' => tribe_get_end_date($event, true, 'Y-m-d H:i:s'),
            'url' => tribe_get_event_link($event)
        ];
    }

    return rest_ensure_response( ['events' => $result, 'success' => true] );
}