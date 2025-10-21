<?php
/*
Template Name: Topic Directory
*/
get_header(); ?>

<main class="bg-schemesSurface text-schemesOnSurface min-h-screen">
  <div class="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <h1 class="Blueprint-headline-large mb-8">Explore Topics</h1>

    <?php
    // Configure the groups you want to show: label => taxonomy slug
    $groups = [
      [ 'label' => 'Topics',    'tax' => 'topic_tag' ],
      [ 'label' => 'Audiences', 'tax' => 'audience_tag' ],
      [ 'label' => 'Locations', 'tax' => 'location_tag' ],
      [ 'label' => 'Theme',     'tax' => 'theme' ],
    ];

    // Recursive printer for hierarchical terms – prints the node + its children
    if ( ! function_exists('sb_render_term_branch') ) {
      function sb_render_term_branch( WP_Term $term, string $taxonomy ) {
        $children = get_terms([
          'taxonomy'   => $taxonomy,
          'parent'     => $term->term_id,
          'hide_empty' => false,
        ]);
        ?>
        <li class="leading-7">
          <a href="<?php echo esc_url( get_term_link( $term ) ); ?>" class="hover:underline">
            <?php echo esc_html( $term->name ); ?>
          </a>
          <?php if ( ! empty( $children ) && ! is_wp_error( $children ) ) : ?>
            <ul class="pl-4 mt-1 space-y-1">
              <?php foreach ( $children as $child ) { sb_render_term_branch( $child, $taxonomy ); } ?>
            </ul>
          <?php endif; ?>
        </li>
        <?php
      }
    }

    foreach ( $groups as $group ) :
      $taxonomy = $group['tax'];
      $label    = $group['label'];

      // Top-level terms (roots)
      $roots = get_terms([
        'taxonomy'   => $taxonomy,
        'parent'     => 0,
        'hide_empty' => true,
        'orderby'    => 'name',
        'order'      => 'ASC',
      ]);
      ?>
      <section class="mb-12">
        <h2 class="Blueprint-headline-small-emphasized mb-8"><?php echo esc_html( $label ); ?></h2>

        <?php if ( ! empty( $roots ) && ! is_wp_error( $roots ) ) : ?>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php foreach ( $roots as $root ) : ?>
              <div>
                <h3 class="Blueprint-title-small mb-2">
                  <a href="<?php echo esc_url( get_term_link( $root ) ); ?>" class="hover:underline">
                    <?php echo esc_html( $root->name ); ?>
                  </a>
                </h3>
                <?php
                // List only the children under this root to avoid duplicating the root itself
                $children = get_terms([
                  'taxonomy'   => $taxonomy,
                  'parent'     => $root->term_id,
                  'hide_empty' => false,
                  'orderby'    => 'name',
                  'order'      => 'ASC',
                ]);
                if ( ! empty( $children ) && ! is_wp_error( $children ) ) : ?>
                  <ul class="space-y-1">
                    <?php foreach ( $children as $child ) { sb_render_term_branch( $child, $taxonomy ); } ?>
                  </ul>
                <?php endif; /* no else — don’t print the root again */ ?>
              </div>
            <?php endforeach; ?>
          </div>
        <?php else : ?>
          <p class="text-schemesOnSurfaceVariant">No terms found for <?php echo esc_html( $label ); ?>.</p>
        <?php endif; ?>
      </section>
    <?php endforeach; ?>
  </div>
</main>

<?php get_footer();
