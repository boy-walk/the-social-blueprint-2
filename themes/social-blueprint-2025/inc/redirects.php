<?php
function redirect_to_home() {
  if(is_page('add-listing-hub') && !is_user_logged_in()) {
    wp_redirect(home_url('/login'));
    exit();
  }
  if(is_page('add-listing') && !is_user_logged_in()) {
    wp_redirect(home_url('/login'));
    exit();
  }
  if(is_page('account-dashboard') && !is_user_logged_in()) {
    wp_redirect(home_url('/login'));
    exit();
  }
  if(is_page('account-settings') && !is_user_logged_in()) {
    wp_redirect(home_url('/login'));
    exit();
  }
  if(is_page('account-listings') && !is_user_logged_in()) {
    wp_redirect(home_url('/login'));
    exit();
  }
}
add_action('template_redirect', 'redirect_to_home');