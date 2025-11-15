<?php
/**
 * Template Name: Forgot Password
 * Description: Password reset page using UsersWP
 */

get_header();
?>

<div id="forgot-password-root" 
     data-props='<?php echo esc_attr(wp_json_encode([
         'restUrl' => rest_url('sb/v1/password-reset'),
         'wpNonce' => wp_create_nonce('wp_rest'),
         'loginUrl' => uwp_get_page_link('login'),
     ])); ?>'>
</div>

<?php
get_footer();