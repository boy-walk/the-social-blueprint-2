<?php
/**
 * Template Name: Aid Listing Hub
 */

 if (!is_user_logged_in()) {
  wp_redirect(home_url('/login'));
  exit;
}

get_header();

$breadcrumbs = sbp_build_breadcrumbs();

$post_id = get_the_ID();

$props = ['breadcrumbs' => $breadcrumbs];
?>

<div
    id="aid-listing-hub-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
