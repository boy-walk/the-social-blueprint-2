<?php
// taxonomy-topic_tag.php
get_header(); ?>

<main class="container mx-auto py-8">
  <h1 class="text-2xl font-bold mb-4"><?php single_term_title(); ?></h1>

  <?php if (term_description()) : ?>
    <div class="mb-6 text-gray-600"><?php echo term_description(); ?></div>
  <?php endif; ?>

  <?php if (have_posts()) : ?>
    <ul class="space-y-4">
      <?php while (have_posts()) : the_post(); ?>
        <li>
          <a href="<?php the_permalink(); ?>" class="block hover:underline">
            <?php the_title(); ?>
          </a>
        </li>
      <?php endwhile; ?>
    </ul>

    <div class="mt-6">
      <?php the_posts_pagination(); ?>
    </div>
  <?php else : ?>
    <p>No posts found in this topic.</p>
  <?php endif; ?>
</main>

<?php get_footer();
