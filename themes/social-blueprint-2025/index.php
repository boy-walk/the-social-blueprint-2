<?php

get_header(); ?>

<div>
  <div style="padding: 64px">
  <?php if (have_posts()) {
        while(have_posts()) {
          the_post(); ?>
          <div className="max-w-4xl mx-auto px-4 Blueprint-body-medium">
            <h1 class="text-3xl font-bold mb-4"><?php the_title(); ?></h1>
            <?php the_content(); ?>
          </div>
        <?php }
      } ?>
  </div>
</div>
<?php get_footer();