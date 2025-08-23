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
$user_id = $current_user->ID;
$uwp_avatar_id = get_user_meta($user_id, 'uwp_profile_photo', true);
$avatar_url = $uwp_avatar_id ? wp_get_attachment_url($uwp_avatar_id) : get_avatar_url($user_id, ['size' => 96]);

$profile_data = [
  'first_name' => get_user_meta($user_id, 'first_name', true),
  'last_name' => get_user_meta($user_id, 'last_name', true),
  'username' => $current_user->user_login,
  'email' => $current_user->user_email,
  'phone' => get_user_meta($user_id, 'phone', true),
  'bio' => get_user_meta($user_id, 'description', true),
  'avatar' => $avatar_url,
];

$links = [
  'profileHref'  => home_url('/account-settings'),
  'passwordHref' => home_url('/change-password'),
  'logoutHref'   => wp_logout_url( home_url('/') ),
]
?>

<div id="account-change-password-root"
     data-user='<?php echo json_encode([
       'email' => $current_user->user_email,
       'id' => $current_user->ID,
     ]); ?>'
     data-profile='<?php echo json_encode($profile_data); ?>'
     data-links='<?php echo json_encode($links); ?>'>
</div>

<?php get_footer(); ?>
