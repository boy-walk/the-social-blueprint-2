<?php
/**
 * Template Name: Register Individual
 */

get_header();
?>

<?php
    $turnstile_key = esc_attr(sbp_get_turnstile_site_key());
?>

<input type="hidden" id="turnstile_site_key" name="turnstile_site_key" value="<?= esc_attr(sbp_get_turnstile_site_key()); ?>">

<div id="register-individual"></div>

<?php get_footer(); ?>