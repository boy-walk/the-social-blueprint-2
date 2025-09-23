<?php
/**
 * Template Name: Account Settings
 */

get_header();

if (!is_user_logged_in()) {
  wp_redirect(wp_login_url());
  exit;
}

$current_user = wp_get_current_user();

$links = [
  'profileHref'  => home_url('/account-settings'),
  'passwordHref' => home_url('/change-password'),
  'logoutHref'   => wp_logout_url( home_url('/') ),
];
?>

<div id="account-settings-root"
    data-user='<?php echo json_encode([
      'email' => $current_user->user_email,
      'id' => $current_user->ID,
    ]); ?>'
    data-links='<?php echo json_encode($links); ?>'>
</div>

<?php get_footer(); ?>