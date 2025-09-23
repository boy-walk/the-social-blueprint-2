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
  // Honeypot spam protection
  $honeypot = (string) $req->get_param('website');
  if ($honeypot !== '') {
    return new \WP_Error('spam', 'Submission rejected', ['status' => 400]);
  }

  $acf = (array) $req->get_param('acf');
  $acf_files = $_FILES['acf_files'] ?? null;

  // Validate required fields
  $title_acf = isset($acf['title']) ? trim(wp_strip_all_tags($acf['title'])) : '';
  if ($title_acf === '') {
    return new \WP_Error('validation_failed', 'Title is required', ['status' => 400]);
  }

  $content_acf = isset($acf['article_content']) ? trim($acf['article_content']) : '';
  if ($content_acf === '' || strip_tags($content_acf) === '') {
    return new \WP_Error('validation_failed', 'Article content is required', ['status' => 400]);
  }

  // Validate theme is provided
  $theme = $req->get_param('theme');
  if (empty($theme)) {
    return new \WP_Error('validation_failed', 'Theme selection is required', ['status' => 400]);
  }

  // Validate file upload if present
  if ($acf_files && !empty($acf_files['name']['article_image'])) {
    $file_error = $acf_files['error']['article_image'];
    $file_size = $acf_files['size']['article_image'];
    $file_type = $acf_files['type']['article_image'];
    
    // Check for upload errors
    switch ($file_error) {
      case UPLOAD_ERR_INI_SIZE:
      case UPLOAD_ERR_FORM_SIZE:
        return new \WP_Error('file_too_large', 'Image file is too large. Maximum size is ' . wp_max_upload_size() / (1024 * 1024) . 'MB', ['status' => 400]);
      case UPLOAD_ERR_PARTIAL:
        return new \WP_Error('upload_failed', 'File upload was interrupted. Please try again.', ['status' => 400]);
      case UPLOAD_ERR_NO_TMP_DIR:
        return new \WP_Error('server_error', 'Server configuration error. Please contact support.', ['status' => 500]);
      case UPLOAD_ERR_CANT_WRITE:
        return new \WP_Error('server_error', 'Unable to save uploaded file. Please contact support.', ['status' => 500]);
      case UPLOAD_ERR_EXTENSION:
        return new \WP_Error('upload_failed', 'File upload blocked by server extension.', ['status' => 400]);
    }

    // Additional file size check (10MB limit)
    $max_size = 10 * 1024 * 1024; // 10MB
    if ($file_size > $max_size) {
      return new \WP_Error('file_too_large', 'Image file is too large. Maximum size is 10MB', ['status' => 400]);
    }

    // Validate file type
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file_type, $allowed_types)) {
      return new \WP_Error('invalid_file_type', 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.', ['status' => 400]);
    }

    // Additional MIME type validation using finfo
    if (function_exists('finfo_file')) {
      $finfo = finfo_open(FILEINFO_MIME_TYPE);
      $detected_type = finfo_file($finfo, $acf_files['tmp_name']['article_image']);
      finfo_close($finfo);
      
      if (!in_array($detected_type, $allowed_types)) {
        return new \WP_Error('invalid_file_type', 'File appears to be corrupted or not a valid image.', ['status' => 400]);
      }
    }
  }

  // Create the post
  $post_id = wp_insert_post([
    'post_type'   => 'article',
    'post_status' => 'pending',
    'post_title'  => $title_acf,
  ], true);

  if (is_wp_error($post_id)) {
    return new \WP_Error('post_creation_failed', 'Unable to create article. Please try again.', ['status' => 500]);
  }

  // Fix modified timestamps
  $now = current_time('mysql');
  $now_gmt = current_time('mysql', 1);
  $post = get_post($post_id);
  
  if ($post && (
    empty($post->post_modified_gmt) || $post->post_modified_gmt === '0000-00-00 00:00:00' ||
    empty($post->post_modified) || $post->post_modified === '0000-00-00 00:00:00'
  )) {
    wp_update_post([
      'ID' => $post_id,
      'post_modified' => $now,
      'post_modified_gmt' => $now_gmt,
    ]);
  }

  $featured_from_acf = 0;

  // Handle ACF fields
  if (function_exists('acf')) {
    foreach ($acf as $name => $val) {
      $sanitized_name = sanitize_key($name);
      
      if ($name === 'article_content') {
        $val = wp_kses_post((string)$val);
      }
      
      $field_updated = update_field($sanitized_name, $val, $post_id);
      if (!$field_updated) {
        error_log("Failed to update ACF field: {$sanitized_name} for post {$post_id}");
      }
    }

    // Handle existing image ID
    if (!empty($acf['article_image'])) {
      $maybe_id = (int) $acf['article_image'];
      if ($maybe_id > 0 && get_post($maybe_id)) {
        $featured_from_acf = $maybe_id;
      }
    }

    // Handle file upload
    if ($acf_files && !empty($acf_files['name']['article_image']) && $acf_files['error']['article_image'] === UPLOAD_ERR_OK) {
      require_once ABSPATH . 'wp-admin/includes/file.php';
      require_once ABSPATH . 'wp-admin/includes/media.php';
      require_once ABSPATH . 'wp-admin/includes/image.php';

      $field_name = 'article_image';
      $file = [
        'name' => $acf_files['name'][$field_name],
        'type' => $acf_files['type'][$field_name],
        'tmp_name' => $acf_files['tmp_name'][$field_name],
        'error' => $acf_files['error'][$field_name],
        'size' => $acf_files['size'][$field_name],
      ];

      // Sanitize filename
      $file['name'] = sanitize_file_name($file['name']);
      
      $_FILES[$field_name] = $file;

      $attachment_id = media_handle_upload($field_name, $post_id);
      
      if (is_wp_error($attachment_id)) {
        // Clean up the post if image upload fails
        wp_delete_post($post_id, true);
        return new \WP_Error('image_upload_failed', 'Failed to upload image: ' . $attachment_id->get_error_message(), ['status' => 400]);
      }

      update_field($field_name, $attachment_id, $post_id);
      $featured_from_acf = $attachment_id;
      unset($_FILES[$field_name]);
    }
  }

  // Set featured image
  if ($featured_from_acf) {
    $thumbnail_set = set_post_thumbnail($post_id, $featured_from_acf);
    if (!$thumbnail_set) {
      error_log("Failed to set featured image {$featured_from_acf} for post {$post_id}");
    }
  }

  // Handle taxonomies
  $topic_tags = $req->get_param('topic_tags');
  if (is_array($topic_tags) && !empty($topic_tags)) {
    $topic_ids = array_map('intval', array_filter($topic_tags, 'is_numeric'));
    if (!empty($topic_ids)) {
      $topic_result = wp_set_object_terms($post_id, $topic_ids, 'topic_tag', false);
      if (is_wp_error($topic_result)) {
        error_log("Failed to set topic tags for post {$post_id}: " . $topic_result->get_error_message());
      }
    }
  }

  if ($theme) {
    $theme_id = (int) $theme;
    $theme_result = wp_set_object_terms($post_id, [$theme_id], 'theme', false);
    if (is_wp_error($theme_result)) {
      error_log("Failed to set theme for post {$post_id}: " . $theme_result->get_error_message());
    }
  }

  $audience = $req->get_param('audience_tag');
  if ($audience) {
    $audience_id = (int) $audience;
    $audience_result = wp_set_object_terms($post_id, [$audience_id], 'audience_tag', false);
    if (is_wp_error($audience_result)) {
      error_log("Failed to set audience tag for post {$post_id}: " . $audience_result->get_error_message());
    }
  }

  // Send notification email
  try {
    $to = apply_filters('sb_article_submission_notify_to', get_option('admin_email'));
    $blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
    $subject = sprintf('[%s] New Article Submission', $blogname);

    $edit_link = admin_url(sprintf('post.php?post=%d&action=edit', $post_id));
    $permalink = get_permalink($post_id) ?: '';

    $user = wp_get_current_user();
    $submitter = $user && $user->ID 
      ? sprintf('%s <%s>', $user->display_name, $user->user_email) 
      : 'Guest';

    $message = implode("\n", array_filter([
      sprintf('A new Article was submitted on %s.', $blogname),
      '',
      'Title: ' . $title_acf,
      'Submitted by: ' . $submitter,
      'Submission time: ' . current_time('Y-m-d H:i:s'),
      '',
      'Review in admin:',
      $edit_link,
      $permalink ? "\nPreview (may require permissions):\n{$permalink}" : '',
    ]));

    if ($to) {
      $mail_sent = wp_mail($to, $subject, $message);
      if (!$mail_sent) {
        error_log("Failed to send notification email for article submission {$post_id}");
      }
    }
  } catch (Exception $e) {
    error_log("Error sending notification email for article submission {$post_id}: " . $e->getMessage());
  }

  return new \WP_REST_Response([
    'ok' => true, 
    'post_id' => $post_id,
    'message' => 'Article submitted successfully and is pending review.'
  ], 200);
}