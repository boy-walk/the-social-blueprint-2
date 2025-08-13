<?php

get_header(); ?>

<div style="align-items: center; display: flex; justify-content: center; padding: 32px">
  <div style="">
  <?php if (have_posts()) {
        while(have_posts()) {
          the_post(); ?>
          <div>
            <?php the_content(); ?>
          </div>
        <?php }
      } ?>
  </div>
</div>
<?php get_footer();