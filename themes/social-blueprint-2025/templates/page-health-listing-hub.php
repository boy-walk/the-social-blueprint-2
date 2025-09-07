<?php
/**
 * Template Name: Health Listing Hub
 */

get_header();

$breadcrumbs = sbp_build_breadcrumbs();

$post_id = get_the_ID();

$props = ['breadcrumbs' => $breadcrumbs];
?>

<div
    id="health-listing-hub-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
