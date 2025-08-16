<?php
/**
 * Template for rendering single podcast posts
 */

get_header();

$post_id = get_the_ID();

// ACF fields you already use
$image_url      = get_field('article_image', $post_id);
$subtitle       = get_field('subtitle', $post_id);
$content = get_field('article_content', $post_id) ?: [];

// -------- Author (rich object) --------
$author_id = (int) get_post_field('post_author', $post_id);
$first = trim( get_the_author_meta( 'first_name', $author_id ) );
$last  = trim( get_the_author_meta( 'last_name', $author_id ) );

$author_name = $first || $last
  ? trim( $first . ' ' . $last )
  : get_the_author_meta( 'display_name', $author_id );

$uwp_avatar_id = get_user_meta($author_id, 'uwp_profile_photo', true);
$avatar_url = $uwp_avatar_id ? wp_get_attachment_url($uwp_avatar_id) : get_avatar_url($author_id, ['size' => 96]);

$author_obj = [
  'id'     => $author_id,
  'name'   => $author_name,
  'url'    => get_author_posts_url($author_id),
  'avatar' => $avatar_url,
];

$terms = get_the_terms( $post->ID, 'topic_tag' ); 
if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
  $terms = array_map( function( $term ) {
    return $term->name;
  }, $terms );
} else {
  $terms = [];
}


// -------- Retrieve 3 other podcasts for "more interviews" --------
$more_articles = new WP_Query([
  'post_type'      => 'article',
  'posts_per_page' => 3,
  'post__not_in'   => [$post_id],
  'orderby'        => 'rand',
]);

if ($more_articles->have_posts()) {
  $more_articles_data = [];
  while ($more_articles->have_posts()) {
    $more_articles->the_post();
    $more_articles_data[] = [
      'id'        => get_the_ID(),
      'title'     => get_the_title(),
      'link'      => get_permalink(),
      'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
    ];
  }
  wp_reset_postdata();
} else {
  $more_articles_data = [];
}

$related_content = sb_get_related_by_topic_tags( get_the_ID(), 3 );

$more_by_author = new WP_Query([
  'post_type'      => 'article',
  'posts_per_page' => 3,
  'post__not_in'   => [$post_id],
  'author'         => $author_id,
  'orderby'        => 'date',
  'order'          => 'DESC',
]);

if ($more_by_author->have_posts()) {
  $more_by_author_data = [];
  while ($more_by_author->have_posts()) {
    $more_by_author->the_post();
    $more_by_author_data[] = [
      'id'        => get_the_ID(),
      'title'     => get_the_title(),
      'link'      => get_permalink(),
      'thumbnail' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
    ];
  }
  wp_reset_postdata();
} else {
  $more_by_author_data = [];
}
?>

<div id="article-root"
     data-title="<?php echo esc_attr(get_the_title()); ?>"
     data-date="<?php echo esc_attr(get_the_date('j F Y')); ?>"
     data-subtitle="<?php echo esc_attr($subtitle); ?>"
     data-image-url="<?php echo esc_url($image_url); ?>"
     data-content="<?php echo esc_attr( wp_json_encode($content) ); ?>"
     data-more-articles='<?php echo esc_attr( wp_json_encode($more_articles_data) ); ?>'
     data-author-obj='<?php echo esc_attr( wp_json_encode($author_obj) ); ?>'
     data-tags='<?php echo esc_attr( wp_json_encode($terms) ); ?>'
     data-related-content='<?php echo esc_attr( wp_json_encode(array_map(function($post) {
       return [
         'id'        => $post->ID,
         'title'     => get_the_title($post),
         'link'      => get_permalink($post),
         'thumbnail' => get_the_post_thumbnail_url($post, 'medium'),
       ];
     }, $related_content)) ); ?>'
    data-more-by-author='<?php echo esc_attr( wp_json_encode($more_by_author_data) ); ?>'
>
</div>

<?php get_footer(); ?>
