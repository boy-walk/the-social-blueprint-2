
<?php
/**
 * Template Name: GD Add Listing Page
 * Template Post Type: page
 */

get_header(); ?>
<div>
  <div class="min-h-screen bg-schemesSurface">
    <div class="bg-schemesPrimaryFixed" style="height: 200px;">
      <?php 
        if (have_posts()) {
          while(have_posts()) {
            the_post(); ?>
            <div class="p-16 max-w-[1600px] mx-auto Blueprint-headline-large">
              <?php the_title(); ?>
            </div>
          <?php }
        } ?>
    </div>
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