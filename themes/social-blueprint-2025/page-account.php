<?php
/**
 * Template Name: Account Page
 */

get_header();

// Ensure user is logged in
if (!is_user_logged_in()) {
  wp_redirect(home_url('/login'));
  exit;
}

// Get current user
$current_user = wp_get_current_user();

$today = date('Y-m-d H:i:s');

$query = new WP_Query([
  'post_type' => 'tribe_events',
  'posts_per_page' => 10,
  'post_status' => 'any',
  'author' => $current_user->ID,
]);

$events = [];

while ($query->have_posts()) {
    $query->the_post();
    $event_id = get_the_ID();
    $start_date = tribe_get_start_date($event_id, false, 'D, M j \a\t g:ia');
    $location = tribe_get_venue($event_id);

    $events[] = [
        'id' => $event_id,
        'title' => get_the_title(),
        'excerpt' => get_the_excerpt(),
        'permalink' => get_permalink(),
        'thumbnail' => get_the_post_thumbnail_url($event_id, 'medium'),
        'startDate' => $start_date,
        'location' => $location,
        'post_type' => get_post_type($post),
    ];
}

wp_reset_postdata();

// Prepare data
$user = [
  'ID'           => $current_user->ID,
  'first_name'   => get_user_meta($current_user->ID, 'first_name', true),
  'last_name'    => get_user_meta($current_user->ID, 'last_name', true),
  'display_name' => $current_user->display_name,
  'email'        => $current_user->user_email,
];

?>

<div id="account-dashboard-root"
     data-user='<?php echo json_encode($user); ?>'
     data-events='<?php echo wp_json_encode($events); ?>'>
</div>

<?php get_footer(); ?>
