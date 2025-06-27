<?php
/**
 * Single Event Template
 * A single event. This displays the event title, description, meta, and
 * optionally, the Google map for the event.
 *
 * Override this template in your own theme by creating a file at [your-theme]/tribe-events/single-event.php
 *
 * @package TribeEventsCalendar
 * @version 4.6.19
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}
// get_header();

// echo tribe( Template_Bootstrap::class )->get_view_html();

//  get_footer();

require_once dirname( TRIBE_EVENTS_FILE ) . '/src/views/v2/default-template.php';
 ?>
