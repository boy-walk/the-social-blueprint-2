<?php
/**
 * Template Name: Contact Us
 * Description:  Renders the React-based Contact Us form + emergency info.
 */
get_header();
?>

<?php
  // Form id
  $cf7_form_id = get_field('form_id', false, false) ?? '';
?>

<input type="hidden" id="turnstile_site_key" name="turnstile_site_key" value="<?= esc_attr(sbp_get_turnstile_site_key()); ?>">
<input type="hidden" id="cf7_form_id" name="cf7_form_id" value="<?= esc_attr($cf7_form_id); ?>">
<?php if (!empty($cf7_form_id)): ?>
  <main id="contact-us" class="min-h-screen"></main>
<?php else: ?>
  <p>Form id not set.</p>
<?php endif; ?>
<?php get_footer(); ?>

