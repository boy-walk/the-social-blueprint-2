<?php
/**
 * Template: Single Event (The Events Calendar)
 * File: single-tribe_events.php
 */

get_header();

$post_id      = get_the_ID();
$title        = get_the_title($post_id);
$excerpt      = has_excerpt($post_id) ? get_the_excerpt($post_id) : '';
$hero         = get_the_post_thumbnail_url($post_id, 'full');

$start_iso    = function_exists('tribe_get_start_date') ? tribe_get_start_date($post_id, true, 'c') : '';
$end_iso      = function_exists('tribe_get_end_date')   ? tribe_get_end_date($post_id, true, 'c')   : '';

$venue_name   = function_exists('tribe_get_venue') ? tribe_get_venue($post_id) : '';
$venue_link   = function_exists('tribe_get_venue_link') ? tribe_get_venue_link($post_id) : '';
$venue_address = function_exists('tribe_get_address') ? tribe_get_address($post_id) : '';
$event_site   = function_exists('tribe_get_event_website_url') ? tribe_get_event_website_url($post_id) : '';
$ical_url = '';
if ( function_exists('tribe_get_single_ical_link') ) {
  $ical = tribe_get_single_ical_link(); // may be a URL or an <a> tag, depending on version/settings
  if ( is_string( $ical ) && strpos( $ical, 'href=' ) !== false ) {
    $urls = wp_extract_urls( $ical );
    $ical_url = $urls ? esc_url_raw( $urls[0] ) : '';
  } else {
    $ical_url = esc_url_raw( $ical );
  }
}

$organizer    = function_exists('tribe_get_organizer') ? tribe_get_organizer($post_id) : '';
$author_id    = get_post_field('post_author', $post_id);
$uwp_avatar_id = get_user_meta($author_id, 'uwp_profile_photo', true);
$avatar_url = $uwp_avatar_id ? wp_get_attachment_url($uwp_avatar_id) : get_avatar_url($author_id, ['size' => 96]);
$organizer    = $organizer ?: get_the_author_meta('display_name', $author_id);

$terms = wp_get_object_terms(
  $post_id,
  ['topic_tag', 'people_tag', 'location_tag', 'audience_tag', 'theme'],
  ['fields' => 'names']         // returns array of term names directly
);

if ( is_wp_error( $terms ) || empty( $terms ) ) {
  $terms = [];
} else {
  // Ensure unique, reindex
  $terms = array_values( array_unique( $terms ) );
}

$content_html = apply_filters('the_content', get_post_field('post_content', $post_id));
$sections = [['text' => $content_html]];

$related = sb_get_related_by_topic_tags( $post_id, 3, true, ['tribe_events'] );
$breadcrumbs = sbp_build_breadcrumbs();

$more_week = [];
$week_start = (new DateTime('monday this week'))->format('Y-m-d 00:00:00');
$week_end   = (new DateTime('sunday this week'))->format('Y-m-d 23:59:59');
$week_q = new WP_Query([
  'post_type'      => 'tribe_events',
  'posts_per_page' => 8,
  'post__not_in'   => [$post_id],
  'meta_key'       => '_EventStartDate',
  'meta_type'      => 'DATETIME',
  'meta_query'     => [[
    'key'     => '_EventStartDate',
    'value'   => [$week_start, $week_end],
    'compare' => 'BETWEEN',
    'type'    => 'DATETIME',
  ]],
  'orderby'        => 'meta_value',
  'order'          => 'ASC',
  'no_found_rows'  => true,
]);
if ($week_q->have_posts()) {
  while ($week_q->have_posts()) { $week_q->the_post();
    $more_week[] = [
      'id'        => get_the_ID(),
      'title'     => get_the_title(),
      'post_type' => get_post_type(),
      'link'      => get_permalink(),
      'image'     => get_the_post_thumbnail_url(get_the_ID(), 'medium_large'),
      'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'medium_large'),
      'subtitle'  => get_post_meta(get_the_ID(), '_EventStartDate', true),
      'date'      => get_the_date('', get_the_ID()),
      'author'    => get_the_author_meta('display_name', get_post_field('post_author', get_the_ID())),
    ];
  }
  wp_reset_postdata();
}

$props = [
  'title'          => $title,
  'subtitle'       => $excerpt,
  'startISO'       => $start_iso,
  'endISO'         => $end_iso,
  'locationLabel'  => $venue_name ? "In person @ {$venue_name}" : '',
  'locationAddress' => $venue_address,
  'venueUrl'       => $venue_link,
  'isOnline'       => false,
  'heroUrl'        => $hero,
  'organizer'      => ['name' => $organizer, 'avatar' => $avatar_url],
  'sections'       => $sections,
  'tags'           => $terms,
  'relatedContent' => array_map(function($post) {
    $id = $post->ID;
    return [
      'id'        => $post->ID,
      'title'     => get_the_title($post),
      'link'      => get_permalink($post),
      'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
      'description' => get_the_excerpt($post),
      'location' => function_exists('tribe_get_venue') ? tribe_get_venue($id) : '',
    ];
  }, $related),
  'moreThisWeek'   => $more_week,
  'calendarUrl'    => $ical_url,
  'bookingUrl'     => $event_site ?: get_permalink($post_id),
  'breadcrumbs'   => $breadcrumbs,
];


?>
<div
  id="tsb-event-root"
  class="tsb-event-root"
  data-component="EventPage"
  data-props='<?php echo esc_attr( wp_json_encode( $props, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) ); ?>'>
</div>
<?php get_footer(); ?>
