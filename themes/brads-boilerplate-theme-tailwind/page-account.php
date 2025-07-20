<?php
/**
 * Template Name: Account Page
 */

get_header();

// Ensure user is logged in
if (!is_user_logged_in()) {
  wp_redirect(wp_login_url(get_permalink()));
  exit;
}

// Get current user
$current_user = wp_get_current_user();

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
     data-user='<?php echo json_encode($user); ?>'>
</div>

<?php get_footer(); ?>
