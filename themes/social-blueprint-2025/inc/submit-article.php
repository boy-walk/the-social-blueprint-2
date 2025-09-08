<?php
add_action('rest_api_init', function () {
  register_rest_route('sb/v1', '/article-submissions', [
    'methods'  => 'POST',
    'callback' => 'sb_submit_article_acf',
    'permission_callback' => function () {
      $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
      return wp_verify_nonce($nonce, 'wp_rest');
    },
  ]);
});

function sb_submit_article_acf(\WP_REST_Request $req) {
  $honeypot = (string) $req->get_param('website');
  if ($honeypot !== '') return new \WP_Error('spam', 'Rejected', ['status' => 400]);

  $acf       = (array) $req->get_param('acf');
  $acf_files = $_FILES['acf_files'] ?? null;

  $title_acf = isset($acf['title']) ? trim(wp_strip_all_tags($acf['title'])) : '';
  if ($title_acf === '') return new \WP_Error('invalid', 'Missing ACF title', ['status' => 400]);

  $post_id = wp_insert_post([
    'post_type'   => 'article',
    'post_status' => 'pending',
    'post_title'  => $title_acf,
  ], true);
  if (is_wp_error($post_id)) return $post_id;

  // ensure modified timestamps are valid
  $now     = current_time('mysql');
  $now_gmt = current_time('mysql', 1);
  $p = get_post($post_id);
  if (
    empty($p->post_modified_gmt) || $p->post_modified_gmt === '0000-00-00 00:00:00' ||
    empty($p->post_modified)     || $p->post_modified     === '0000-00-00 00:00:00'
  ) {
    wp_update_post([
      'ID'                => $post_id,
      'post_modified'     => $now,
      'post_modified_gmt' => $now_gmt,
    ]);
  }

  $featured_from_acf = 0;

  if (function_exists('acf')) {
    foreach ($acf as $name => $val) {
      if ($name === 'article_content') $val = wp_kses_post((string)$val);
      update_field(sanitize_key($name), $val, $post_id);
    }

    if (!empty($acf['article_image'])) {
      $maybe_id = (int) $acf['article_image'];
      if ($maybe_id > 0 && get_post($maybe_id)) $featured_from_acf = $maybe_id;
    }

    if ($acf_files && !empty($acf_files['name']['article_image'])) {
      require_once ABSPATH.'wp-admin/includes/file.php';
      require_once ABSPATH.'wp-admin/includes/media.php';
      require_once ABSPATH.'wp-admin/includes/image.php';

      $field_name = 'article_image';
      $file = [
        'name'     => $acf_files['name'][$field_name],
        'type'     => $acf_files['type'][$field_name],
        'tmp_name' => $acf_files['tmp_name'][$field_name],
        'error'    => $acf_files['error'][$field_name],
        'size'     => $acf_files['size'][$field_name],
      ];
      $_FILES[$field_name] = $file;

      $attachment_id = media_handle_upload($field_name, $post_id);
      if (!is_wp_error($attachment_id)) {
        update_field($field_name, $attachment_id, $post_id);
        $featured_from_acf = $attachment_id;
      }
      unset($_FILES[$field_name]);
    }
  }

  if ($featured_from_acf) {
    set_post_thumbnail($post_id, $featured_from_acf);
  }

  $topic_tags = $req->get_param('topic_tags');
  if (is_array($topic_tags) && !empty($topic_tags)) {
    wp_set_object_terms($post_id, array_map('intval', $topic_tags), 'topic_tag', false);
  }

  $theme = $req->get_param('theme');
  if ($theme) wp_set_object_terms($post_id, [(int)$theme], 'theme', false);

  $aud = $req->get_param('audience_tag');
  if ($aud) wp_set_object_terms($post_id, [(int)$aud], 'audience_tag', false);

  // ---- notify site owner ----------------------------------------------------
  $to       = apply_filters('sb_article_submission_notify_to', get_option('admin_email'));
  $blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
  $subject  = sprintf('[%s] New Article Submission', $blogname);

  $edit_link = admin_url(sprintf('post.php?post=%d&action=edit', $post_id));
  $permalink = get_permalink($post_id) ?: '';

  $user   = wp_get_current_user();
  $submitter = $user && $user->ID ? sprintf('%s <%s>', $user->display_name, $user->user_email) : 'Guest';

  $message = implode("\n", array_filter([
    sprintf('A new Article was submitted on %s.', $blogname),
    '',
    'Title: ' . $title_acf,
    'Submitted by: ' . $submitter,
    '',
    'Review in admin:',
    $edit_link,
    $permalink ? "\nPreview (may require permissions):\n{$permalink}" : '',
  ]));

  if ($to) {
    // keep plain-text for deliverability/simplicity; no headers needed
    wp_mail($to, $subject, $message);
  }
  // ---------------------------------------------------------------------------

  return new \WP_REST_Response(['ok' => true, 'post_id' => $post_id], 200);
}
