<?php

get_header(); ?>

<div style="align-items: center; display: flex; justify-content: center; padding: 32px;">
<div style="max-width: 50%">
<?php if (have_posts()) {
      while(have_posts()) {
        the_post(); ?>
        <div>
          <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
          <?php the_content(); ?>
        </div>
      <?php }
    } ?>
</div>
  </div>
<?php get_footer();