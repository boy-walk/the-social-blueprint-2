<?php

// die;
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

$events_label_singular = tribe_get_event_label_singular();
$events_label_plural   = tribe_get_event_label_plural();

$event_id = get_the_ID();

/**
 * Allows filtering of the single event template title classes.
 *
 * @since 5.8.0
 *
 * @param array  $title_classes List of classes to create the class string from.
 * @param string $event_id The ID of the displayed event.
 */
$title_classes = apply_filters( 'tribe_events_single_event_title_classes', [ 'tribe-events-single-event-title' ], $event_id );
$title_classes = implode( ' ', tribe_get_classes( $title_classes ) );

/**
 * Allows filtering of the single event template title before HTML.
 *
 * @since 5.8.0
 *
 * @param string $before HTML string to display before the title text.
 * @param string $event_id The ID of the displayed event.
 */
$before = apply_filters( 'tribe_events_single_event_title_html_before', '<h1 class="' . $title_classes . '">', $event_id );

/**
 * Allows filtering of the single event template title after HTML.
 *
 * @since 5.8.0
 *
 * @param string $after HTML string to display after the title text.
 * @param string $event_id The ID of the displayed event.
 */
$after = apply_filters( 'tribe_events_single_event_title_html_after', '</h1>', $event_id );

/**
 * Allows filtering of the single event template title HTML.
 *
 * @since 5.8.0
 *
 * @param string $after HTML string to display. Return an empty string to not display the title.
 * @param string $event_id The ID of the displayed event.
 */
$title = apply_filters( 'tribe_events_single_event_title_html', the_title( $before, $after, false ), $event_id );

?>

<div id="tribe-events-content" class="tribe-events-single csp-custom-single-event">

	<!-- Notices -->
	<?php tribe_the_notices() ?>



	<?php // echo $title; ?>

	<div class="row">

	<div class="col-md-12 col-lg-8 order-2 order-lg-0" data-spy="scroll" data-target="#pattern-list-container" data-offset="0">

<div class="tribe-events-schedule tribe-clearfix">
	<?php echo tribe_events_event_schedule_details( $event_id, '<h2>', '</h2>' ); ?>
	<?php if ( tribe_get_cost() ) : ?>
		<span class="tribe-events-cost"><?php echo tribe_get_cost( null, true ) ?></span>
	<?php endif; ?>
</div>

<!-- Event header -->
<div id="tribe-events-header" <?php tribe_events_the_header_attributes() ?>>
	<!-- Navigation -->
	<nav class="tribe-events-nav-pagination" aria-label="<?php printf( esc_html__( '%s Navigation', 'the-events-calendar' ), $events_label_singular ); ?>">
		<ul class="tribe-events-sub-nav">
			<li class="tribe-events-nav-previous"><?php tribe_the_prev_event_link( '<span>&laquo;</span> %title%' ) ?></li>
			<li class="tribe-events-nav-next"><?php tribe_the_next_event_link( '%title% <span>&raquo;</span>' ) ?></li>
		</ul>
		<!-- .tribe-events-sub-nav -->
	</nav>
</div>
<!-- #tribe-events-header -->

<?php while ( have_posts() ) :  the_post(); ?>
	<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<!-- Event featured image, but exclude link -->
		<?php echo tribe_event_featured_image( $event_id, 'full', false ); ?>

		<!-- Event content -->
		<?php do_action( 'tribe_events_single_event_before_the_content' ) ?>
		<div class="tribe-events-single-event-description tribe-events-content">
			<?php the_content(); ?>
		</div>

		<div class="tribe-events-schedule tribe-clearfix">
	<?php echo tribe_events_event_schedule_details( $event_id, '<h2>', '</h2>' ); ?>
	<?php if ( tribe_get_cost() ) : ?>
		<span class="tribe-events-cost"><?php echo tribe_get_cost( null, true ) ?></span>
	<?php endif; ?>
</div>

		<!-- .tribe-events-single-event-description -->
		<?php do_action( 'tribe_events_single_event_after_the_content' ) ?>

		<div class="csp-social-share mb-5">

			<h3 class="vc_custom_heading mb-3 align-left">Share to your network</h2>
			<?php echo do_shortcode('[porto_share]'); ?>
			<?php do_action( 'tribe_events_single_event_after_the_meta' ) ?>

		</div>
	</div>

	</div>

	<div id="pattern-list-container" class="col-md-12 col-lg-4 sidebar">
		<div class="widget mt-0 pt-0">

			<div class="csp-event-sidebar">
				<!-- Event meta -->
				<?php do_action( 'tribe_events_single_event_before_the_meta' ) ?>
				<?php tribe_get_template_part( 'modules/meta' ); ?>
				<?php //do_action( 'tribe_events_single_event_after_the_meta' ) ?>
			</div> <!-- #post-x -->

		</div>
	</div>

</div>

		<?php if ( get_post_type() == Tribe__Events__Main::POSTTYPE && tribe_get_option( 'showComments', false ) ) comments_template() ?>
<?php endwhile; ?>


		<!-- Event footer -->
		<div id="tribe-events-footer">
			<!-- Navigation -->
			<nav class="tribe-events-nav-pagination" aria-label="<?php printf( esc_html__( '%s Navigation', 'the-events-calendar' ), $events_label_singular ); ?>">
				<ul class="tribe-events-sub-nav">
					<li class="tribe-events-nav-previous"><?php tribe_the_prev_event_link( '<span>&laquo;</span> %title%' ) ?></li>
					<li class="tribe-events-nav-next"><?php tribe_the_next_event_link( '%title% <span>Next &raquo;</span>' ) ?></li>
				</ul>
				<!-- .tribe-events-sub-nav -->
			</nav>
		</div>
		<!-- #tribe-events-footer -->


		<p class="tribe-events-back">
		<a href="<?php echo esc_url( tribe_get_events_link() ); ?>"> <?php printf( '&laquo; ' . esc_html_x( 'All %s', '%s Events plural label', 'the-events-calendar' ), $events_label_plural ); ?></a>
	</p>

</div><!-- #tribe-events-content -->


<style>
	#pattern-list-container > .widget {
    position: sticky;
    top: 30px;
}
@media screen and (max-width: 767px){
	.tribe-events-single .tribe-events-sub-nav {
    display: block;
    padding: 0;
}
.tribe-events-single .tribe-events-sub-nav {
    display: block;
    padding: 0;
}
.tribe-events-single .tribe-events-sub-nav li {
    padding-bottom: 10px;
}
.tribe-events-single li.tribe-events-nav-next {
    text-align: right;
}
}
</style>
<script>
	/*jQuery(window).scroll(function($){
if(jQuery("#pattern-list-container").length > 0){
var offsetTopContainer = document.getElementById("pattern-list-container").offsetTop - window.scrollY;
//var offsetTopContainer = window.scrollY + document.querySelector('#pattern-list-container').getBoundingClientRect().top
//console.log(offsetTopContainer);
    if (offsetTopContainer <= 0) {
    var listWidth  = document.getElementById("pattern-list-container").offsetWidth;
    document.getElementById("pattern-list-container").style.width = listWidth + "px";
//    alert(listWidth);
jQuery('#pattern-list-container').addClass('csp-sticky');
//        $('nav div').addClass('visible-title');
    }
    else {
        jQuery('#pattern-list-container').removeClass('csp-sticky');
//        $('nav div').removeClass('visible-title');
    }
}



});*/
</script>
