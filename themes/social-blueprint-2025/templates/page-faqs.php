<?php
/**
 * Template Name: FAQs
 */

get_header();

$breadcrumbs = sbp_build_breadcrumbs();

$faqs = get_field('faq');

$props = ['breadcrumbs' => $breadcrumbs
, 'faqs' => $faqs];
?>

<div
    id="faqs-root"
    data-props='<?php echo esc_attr( wp_json_encode( $props)); ?>'
  >
</div>

<?php get_footer(); ?>
