<?php
/**
 * Template Name: Account Listings
 */
get_header();

if ( ! is_user_logged_in() ) {
  echo '<main class="max-w-3xl mx-auto p-8"><p>You must be logged in to view this page.</p></main>';
  get_footer(); exit;
}

$user_id = get_current_user_id();

/* collect CPTs: all GeoDirectory types, Articles, Events Calendar (if present) */
$all_public = get_post_types(['public' => true], 'names');
$gd_types   = array_values(array_filter($all_public, static function($n){ return str_starts_with($n, 'gd_'); }));
$post_types = array_values(array_unique(array_merge(
  $gd_types,
  in_array('tribe_events', $all_public, true) ? ['tribe_events'] : [],
  ['post'] // articles
)));

$q = new WP_Query([
  'post_type'      => $post_types,
  'post_status'    => ['publish','pending','draft','future','private'],
  'author'         => $user_id,
  'orderby'        => 'modified',
  'order'          => 'DESC',
  'posts_per_page' => 150,
  'no_found_rows'  => true,
]);

$list = [];
if ( $q->have_posts() ) {
  foreach ( $q->posts as $p ) {
    $type = get_post_type($p);
    $src  = str_starts_with($type, 'gd_') ? 'GeoDirectory' : ($type === 'tribe_events' ? 'Events Calendar' : 'Article');

    $start = '';
    $end   = '';
    if ( $type === 'tribe_events' ) {
      $start = get_post_meta($p->ID, '_EventStartDate', true);
      $end   = get_post_meta($p->ID, '_EventEndDate', true);
    } else {
      $start = get_post_meta($p->ID, 'event_start', true) ?: '';
      $end   = get_post_meta($p->ID, 'event_end', true) ?: '';
    }

    $list[] = [
      'id'         => $p->ID,
      'title'      => get_the_title($p),
      'permalink'  => get_permalink($p),
      'status'     => get_post_status($p),
      'post_type'  => $type,
      'source'     => $src,
      'date'       => get_the_date('c', $p),
      'modified'   => get_post_modified_time('c', true, $p),
      'thumbnail'  => get_the_post_thumbnail_url($p, 'medium') ?: '',
      'start'      => $start,
      'end'        => $end,
    ];
  }
  wp_reset_postdata();
}

?>
<div id="account-listings-root"
     data-items="<?php echo esc_attr( wp_json_encode($list) ); ?>"></div>
<?php get_footer();
