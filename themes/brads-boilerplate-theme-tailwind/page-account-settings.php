<?php
/**
 * Template Name: Account Settings
 */

get_header();if (!is_user_logged_in()) {
  wp_redirect(wp_login_url());
  exit;
}

$current_user = wp_get_current_user();
$user_id = $current_user->ID;

// Get the UsersWP avatar attachment ID (if available)
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
?>

<div id="account-settings-root"
     data-props='<?php echo json_encode($profile_data); ?>'></div>

<?php get_footer(); ?>
