<?php
/**
 * Template Name: Account Change Password
 */

get_header();

if (!is_user_logged_in()) {
  wp_redirect(wp_login_url(get_permalink()));
  exit;
}

$current_user = wp_get_current_user();

?>

<div id="account-change-password-root"
     data-user='<?php echo json_encode([
       'email' => $current_user->user_email,
       'id' => $current_user->ID,
     ]); ?>'>
</div>

<?php get_footer(); ?>
