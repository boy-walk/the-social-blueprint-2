<?php

get_header(); ?>

<div>
  <div className="p-16">
  <?php if (have_posts()) {
        while(have_posts()) {
          the_post(); ?>
          <div className="max-w-4xl mx-auto px-4 Blueprint-body-medium">
            <?php the_content(); ?>
          </div>
        <?php }
      } ?>
  </div>
</div>
<?php get_footer();