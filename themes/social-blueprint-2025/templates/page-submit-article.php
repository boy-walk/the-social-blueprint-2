<?php
/* Template Name: Submit Article */
get_header();
wp_enqueue_script('tsb-frontend');

$props = [
  'restUrl' => esc_url_raw(rest_url('sb/v1/article-submissions')),
  'wpNonce' => wp_create_nonce('wp_rest'),
  'taxonomies' => [
    'topic_tag'    => get_terms(['taxonomy'=>'topic_tag','hide_empty'=>false,'fields'=>'id=>name']),
    'theme'        => get_terms(['taxonomy'=>'theme','hide_empty'=>false,'fields'=>'id=>name']),
    'audience_tag' => get_terms(['taxonomy'=>'audience_tag','hide_empty'=>false,'fields'=>'id=>name']),
  ],
];

?>
<main id="main">
  <div id="submit-article-root"
       data-props='<?php echo wp_json_encode($props, JSON_UNESCAPED_SLASHES); ?>'></div>
</main>
<?php get_footer(); ?>
