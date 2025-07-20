<?php
/**
 * Template Name: Login Page
 */

if (is_user_logged_in()) {
  wp_redirect(home_url('/account-dashboard'));
  exit;
}

get_header();
?>


<main id="login-form"></main>

<?php
get_footer();