<?php
/**
 * Template Name: Reset Password
 * Description: Password reset confirmation page using UsersWP
 */

get_header();

// Get the reset key and login from URL
$reset_key = isset($_GET['key']) ? sanitize_text_field($_GET['key']) : '';
$user_login = isset($_GET['login']) ? sanitize_text_field($_GET['login']) : '';
$action = isset($_GET['action']) ? sanitize_text_field($_GET['action']) : '';

?>

<div id="reset-password-root" 
     data-props='<?php echo esc_attr(wp_json_encode([
         'restUrl' => rest_url('sb/v1/password-reset-confirm'),
         'wpNonce' => wp_create_nonce('wp_rest'),
         'loginUrl' => uwp_get_page_link('login'),
         'resetKey' => $reset_key,
         'userLogin' => $user_login,
         'action' => $action,
     ])); ?>'>
</div>

<?php
get_footer();