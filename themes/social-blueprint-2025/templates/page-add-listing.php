<?php
/**
 * Template Name: Add Listing
 */

get_header();

$breadcrumbs = sbp_build_breadcrumbs();

$props = ['breadcrumbs' => $breadcrumbs];
?>

<div
    id="add-listing-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
