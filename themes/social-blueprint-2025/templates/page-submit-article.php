<?php
/* Template Name: Submit Article */
get_header();
wp_enqueue_script('tsb-frontend');

if ( ! is_user_logged_in() ) {
  echo '<main class="py-16 flex items-center justify-center bg-schemesSurface px-6">
    <div class="max-w-2xl mx-auto text-center space-y-6">
      <h1 class="Blueprint-headline-medium md:Blueprint-headline-large text-schemesOnSurface">
        Log in required
      </h1>
      <p class="Blueprint-body-large text-schemesOnSurfaceVariant">
        You must be logged in to submit an article.
      </p>
      <div class="flex justify-center gap-4 mt-6">
        <a
          href="/login"
          class="px-6 py-3 rounded-lg bg-schemesPrimary text-schemesOnPrimary Blueprint-label-large hover:bg-schemesPrimaryContainer transition"
        >
          Log in
        </a>
        <a
          href="/register-individual"
          class="px-6 py-3 rounded-lg bg-schemesSurfaceContainerHigh text-schemesOnSurface Blueprint-label-large hover:bg-schemesSurfaceContainer transition"
        >
          Register
        </a>
      </div>
    </div>
  </main>';
  get_footer(); exit;
}

$props = [
  'restUrl' => esc_url_raw(rest_url('sb/v1/article-submissions')),
  'wpNonce' => wp_create_nonce('wp_rest'),
  'taxonomies' => (object)[
    'topic_tag'    => (object)array_column(get_terms(['taxonomy'=>'topic_tag','hide_empty'=>false]) ?: [], 'name', 'term_id'),
    'theme'        => (object)array_column(get_terms(['taxonomy'=>'theme','hide_empty'=>false]) ?: [], 'name', 'term_id'),
    'audience_tag' => (object)array_column(get_terms(['taxonomy'=>'audience_tag','hide_empty'=>false]) ?: [], 'name', 'term_id'),
  ],
];

?>
<main id="main">
  <div id="submit-article-root"
       data-props='<?php echo wp_json_encode($props, JSON_UNESCAPED_SLASHES); ?>'></div>
</main>
<?php get_footer(); ?>
