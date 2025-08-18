<?php
// archive.php
get_header(); ?>

<main class="bg-schemesSurface text-schemesOnSurface">
  <div class="p-6 md:p-8 lg:p-12">
    <div class="mx-auto lg:max-w-[1600px] px-0 lg:px-16">
      <header class="mb-6 md:mb-8">
        <h1 class="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large">
          <?php echo get_the_archive_title(); ?>
        </h1>
        <?php if ( get_the_archive_description() ) : ?>
          <div class="Blueprint-body-large text-schemesOnSurfaceVariant mt-2">
            <?php echo get_the_archive_description(); ?>
          </div>
        <?php endif; ?>
      </header>

      <?php if ( have_posts() ) : ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <?php while ( have_posts() ) : the_post(); ?>
            <article class="rounded-xl overflow-hidden border border-schemesOutlineVariant">
              <a href="<?php the_permalink(); ?>" class="block">
                <?php if ( has_post_thumbnail() ) : ?>
                  <div class="aspect-[16/9] overflow-hidden">
                    <?php the_post_thumbnail('large', ['class' => 'w-full h-full object-cover']); ?>
                  </div>
                <?php endif; ?>

                <div class="p-4 space-y-2">
                  <div class="Blueprint-label-large text-schemesOnSurfaceVariant">
                    <?php echo get_the_date(); ?>
                  </div>
                  <h2 class="Blueprint-title-large-emphasized">
                    <?php the_title(); ?>
                  </h2>
                  <p class="Blueprint-body-medium text-schemesOnSurfaceVariant">
                    <?php echo wp_trim_words( get_the_excerpt(), 26 ); ?>
                  </p>
                </div>
              </a>
            </article>
          <?php endwhile; ?>
        </div>

        <div class="mt-8">
          <?php the_posts_pagination([
            'prev_text' => '&larr;',
            'next_text' => '&rarr;',
          ]); ?>
        </div>
      <?php else : ?>
        <p class="Blueprint-body-large text-schemesOnSurfaceVariant">No results found.</p>
      <?php endif; ?>
    </div>
  </div>
</main>

<?php get_footer();
