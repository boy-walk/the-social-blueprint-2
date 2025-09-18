<?php

get_header(); ?>

<div>
  <div class="min-h-screen bg-schemesSurface">
    <?php if (have_posts()) {
          while(have_posts()) {
            the_post(); ?>
            <div className="px-4 Blueprint-body-medium">
              <?php the_content(); ?>
            </div>
          <?php }
        } ?>
  </div>
</div>
<?php get_footer();