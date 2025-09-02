<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
  </head>
  <body <?php body_class(); ?>>
  <div
  id="header"
  class="sticky z-[1000]"
  style="top: var(--wp-admin--admin-bar--height, 0px);"
  isUserLoggedIn="<?php echo is_user_logged_in() ? 'true' : 'false'; ?>"
></div>
    