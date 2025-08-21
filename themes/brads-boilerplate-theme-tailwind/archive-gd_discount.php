<?php
/**
 * Archive template for GeoDirectory Message Board listings (post type: gd_discount)
 * File: archive-gd_discount.php
 */

get_header();

/** Preferred title = the CPT label, falling back to "Message Board" */
$pt_obj = get_post_type_object('gd_discount');
$archive_title = $pt_obj && !empty($pt_obj->labels->name) ? $pt_obj->labels->name : 'Message Board';

/** Helper: robust permalink for GeoDirectory posts */
function tsb_gd_discount_permalink() {
  $post = get_post();
  $link = get_permalink($post); // default

  // Use GeoDirectory helpers when available
  if (function_exists('geodir_get_post_link')) {
    $maybe = geodir_get_post_link($post);
    if (!empty($maybe)) { $link = $maybe; }
  } elseif (function_exists('geodir_get_permalink')) {
    $maybe = geodir_get_permalink($post);
    if (!empty($maybe)) { $link = $maybe; }
  }

  // Absolute last resort (non-pretty single)
  if (empty($link) || $link === '#') {
    $link = add_query_arg(['post_type' => 'gd_discount', 'p' => $post->ID], home_url('/'));
  }

  return $link;
}
?>

<main class="bg-schemesSurface text-schemesOnSurface">
  <div class="p-6 md:p-8 lg:p-12">
    <div class="mx-auto lg:max-w-[1600px] px-0 lg:px-16">

      <header class="mb-6 md:mb-8">
        <h1 class="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large">
          <?php echo esc_html($archive_title); ?>
        </h1>

        <?php
        // Many installs store shortcodes in the CPT archive description (e.g. [porto_block ...]).
        // To avoid printing raw shortcode text, either render it OR suppress it for this CPT.
        // Uncomment ONE of the options below.

        // OPTION A (recommended): render shortcodes safely
        // if ( $desc = get_the_archive_description() ) {
        //   echo '<div class="Blueprint-body-large text-schemesOnSurfaceVariant mt-2">';
        //   echo do_shortcode( $desc );
        //   echo '</div>';
        // }

        // OPTION B: suppress description for gd_discount (keeps page clean)
        // (nothing printed)
        ?>
      </header>

      <?php if ( have_posts() ) : ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <?php while ( have_posts() ) : the_post(); ?>
            <?php
              $link = tsb_gd_discount_permalink();
              $has_thumb = has_post_thumbnail();
            ?>
            <article class="h-full rounded-xl overflow-hidden border border-schemesOutlineVariant flex flex-col">
              <a href="<?php echo esc_url($link); ?>" class="block h-full focus:outline-none focus:ring-2 focus:ring-schemesPrimary">
                <?php if ( $has_thumb ) : ?>
                  <div class="aspect-[16/9] overflow-hidden">
                    <?php the_post_thumbnail('large', ['class' => 'w-full h-full object-cover']); ?>
                  </div>
                <?php else : ?>
                  <div class="aspect-[16/9] bg-schemesSurfaceContainerHigh flex items-center justify-center Blueprint-label-large text-schemesOnSurfaceVariant">
                    No image
                  </div>
                <?php endif; ?>

                <div class="p-4 space-y-2">
                  <div class="Blueprint-label-large text-schemesOnSurfaceVariant">
                    <?php echo esc_html( get_the_date() ); ?>
                  </div>

                  <h2 class="Blueprint-title-large-emphasized">
                    <?php the_title(); ?>
                  </h2>

                  <p class="Blueprint-body-medium text-schemesOnSurfaceVariant">
                    <?php echo esc_html( wp_trim_words( get_the_excerpt(), 26 ) ); ?>
                  </p>

                  <?php
                  // Optional: show attached categories/tags as small chips
                  $cats = get_the_terms( get_the_ID(), 'category' );
                  if ( ! is_wp_error( $cats ) && ! empty( $cats ) ) :
                  ?>
                    <div class="flex flex-wrap gap-1.5 pt-2">
                      <?php foreach ( $cats as $t ) : ?>
                        <span class="px-2 py-0.5 rounded-full border border-schemesOutlineVariant Blueprint-label-large text-schemesOnSurfaceVariant">
                          <?php echo esc_html( $t->name ); ?>
                        </span>
                      <?php endforeach; ?>
                    </div>
                  <?php endif; ?>
                </div>
              </a>
            </article>
          <?php endwhile; ?>
        </div>

        <div class="mt-8">
          <?php
          the_posts_pagination([
            'prev_text' => '&larr;',
            'next_text' => '&rarr;',
            'class'     => 'flex gap-2',
          ]);
          ?>
        </div>

      <?php else : ?>
        <p class="Blueprint-body-large text-schemesOnSurfaceVariant">No message board listings found.</p>
      <?php endif; ?>
    </div>
  </div>
</main>

<?php get_footer(); ?>
