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
$user_id = $current_user->ID;

// Get the UsersWP avatar attachment ID (if available)
$uwp_avatar_id = get_user_meta($user_id, 'uwp_profile_photo', true);
$avatar_url = $uwp_avatar_id ? wp_get_attachment_image_url($uwp_avatar_id, 'thumbnail') : get_avatar_url($user_id, ['size' => 150]);

// Match the structure returned by your REST API endpoint
$profile_data = [
  'ID' => $user_id, // Add the missing ID field
  'first_name' => $current_user->first_name ?: '', // Use core user fields
  'last_name' => $current_user->last_name ?: '',
  'display_name' => $current_user->display_name ?: '',
  'username' => $current_user->user_login,
  'email' => $current_user->user_email,
  'phone' => get_user_meta($user_id, 'phone', true) ?: '',
  'bio' => get_user_meta($user_id, 'description', true) ?: '',
  'avatar' => $avatar_url ?: '',
  'registration_date' => $current_user->user_registered
];

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
    data-profile='<?php echo json_encode($profile_data); ?>'
    data-links='<?php echo json_encode($links); ?>'>
</div>

<?php get_footer(); ?>