<?php
/**
 * Template Name: Contact Us
 * Description:  Renders the React-based Contact Us form + emergency info.
 */
get_header();
?>
<div id="cf7-proxy" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">
  <?php echo do_shortcode('[contact-form-7 id="a97f8d1" title="Contact form 1"]'); ?>
</div>
<main id="contact-us" class="min-h-screen"></main>

<?php get_footer(); ?>

