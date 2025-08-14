<?php

get_header(); ?>

<div style="padding: 64px; max-width: 1200px; margin: auto">
  <?php if (have_posts()) {
    while(have_posts()) {
      the_post(); ?>
      <div>
        <?php the_content(); ?>
      </div>
    <?php }
  } ?>
</div>

<?php get_footer();