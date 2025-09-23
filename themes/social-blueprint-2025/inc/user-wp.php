<?php
add_action('rest_api_init', function () {
  // Get user profile
  register_rest_route('custom/v1', '/user-profile', [
    'methods' => 'GET',
    'callback' => function () {
      $user = wp_get_current_user();
      if (!$user || !$user->ID) return new WP_Error('unauthorized', 'Not logged in', ['status' => 401]);

      // Get custom avatar URL if set, otherwise use gravatar
      $avatar_attachment_id = get_user_meta($user->ID, 'uwp_profile_photo', true);
      $avatar_url = $avatar_attachment_id 
        ? wp_get_attachment_image_url($avatar_attachment_id, 'thumbnail') 
        : get_avatar_url($user->ID);

      return [
        'ID' => $user->ID,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
        'display_name' => $user->display_name,
        'username' => $user->user_login,
        'email' => $user->user_email,
        'bio' => get_user_meta($user->ID, 'description', true),
        'phone' => get_user_meta($user->ID, 'phone', true),
        'avatar' => $avatar_url,
        'registration_date' => $user->user_registered,
      ];
    },
    'permission_callback' => '__return_true'
  ]);

  // Update user profile
  register_rest_route('custom/v1', '/user-profile', [
    'methods' => 'POST',
    'callback' => function ($request) {
      $user = wp_get_current_user();
      if (!$user || !$user->ID) return new WP_Error('unauthorized', 'Not logged in', ['status' => 401]);

      $data = $request->get_json_params();

      // Validate email uniqueness
      if (isset($data['email'])) {
        $existing_user = get_user_by('email', sanitize_email($data['email']));
        if ($existing_user && $existing_user->ID !== $user->ID) {
          return new WP_Error('email_exists', 'This email is already registered to another account', ['status' => 400]);
        }
      }

      // Update core user data
      wp_update_user([
        'ID' => $user->ID,
        'first_name' => sanitize_text_field($data['first_name']),
        'last_name' => sanitize_text_field($data['last_name']),
        'user_email' => sanitize_email($data['email']),
        'display_name' => sanitize_text_field(trim($data['first_name'] . ' ' . $data['last_name'])),
      ]);

      // Update meta fields
      update_user_meta($user->ID, 'phone', sanitize_text_field($data['phone']));
      update_user_meta($user->ID, 'description', sanitize_textarea_field($data['bio']));

      return ['success' => true];
    },
    'permission_callback' => function () {
      $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
      return wp_verify_nonce($nonce, 'wp_rest');
    }
  ]);
});

// Upload avatar
add_action('rest_api_init', function () {
  register_rest_route('custom/v1', '/upload-avatar', [
    'methods' => 'POST',
    'callback' => 'custom_upload_avatar',
    'permission_callback' => function () { 
      $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
      return is_user_logged_in() && wp_verify_nonce($nonce, 'wp_rest'); 
    }
  ]);
});

function custom_upload_avatar(WP_REST_Request $request) {
  if (empty($_FILES['avatar'])) {
    return new WP_REST_Response(['message' => 'No file uploaded'], 400);
  }

  // File validation
  $file = $_FILES['avatar'];
  
  // Check file size (2MB limit)
  $max_size = 2 * 1024 * 1024;
  if ($file['size'] > $max_size) {
    return new WP_REST_Response(['message' => 'Image must be less than 2MB'], 400);
  }

  // Check file type
  $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (function_exists('finfo_file')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mime_type, $allowed_types)) {
      return new WP_REST_Response(['message' => 'Please upload a JPEG, PNG, or GIF image'], 400);
    }
  }

  require_once ABSPATH . 'wp-admin/includes/file.php';
  require_once ABSPATH . 'wp-admin/includes/media.php';
  require_once ABSPATH . 'wp-admin/includes/image.php';

  $upload = media_handle_upload('avatar', 0);

  if (is_wp_error($upload)) {
    return new WP_REST_Response(['message' => $upload->get_error_message()], 400);
  }

  $user_id = get_current_user_id();
  
  // Delete old avatar if exists
  $old_avatar_id = get_user_meta($user_id, 'uwp_profile_photo', true);
  if ($old_avatar_id && $old_avatar_id !== $upload) {
    wp_delete_attachment($old_avatar_id, true);
  }
  
  update_user_meta($user_id, 'uwp_profile_photo', $upload);

  $url = wp_get_attachment_image_url($upload, 'full');

  return new WP_REST_Response(['url' => $url], 200);
}

// Change password
add_action('rest_api_init', function () {
  register_rest_route('custom/v1', '/change-password', [
    'methods' => 'POST',
    'callback' => function ($request) {
      if (!is_user_logged_in()) {
        return new WP_REST_Response(['message' => 'Not logged in'], 401);
      }

      $params = $request->get_json_params();
      $user = wp_get_current_user();

      if (!wp_check_password($params['current_password'], $user->user_pass, $user->ID)) {
        return new WP_Error('incorrect_password', 'Current password is incorrect', ['status' => 400]);
      }

      if (empty($params['new_password']) || strlen($params['new_password']) < 8) {
        return new WP_Error('weak_password', 'Password must be at least 8 characters long', ['status' => 400]);
      }

      if ($params['new_password'] === $params['current_password']) {
        return new WP_Error('same_password', 'New password must be different from current password', ['status' => 400]);
      }

      wp_set_password($params['new_password'], $user->ID);
      
      // Log the user back in since wp_set_password logs them out
      wp_set_current_user($user->ID);
      wp_set_auth_cookie($user->ID);
      
      return ['success' => true, 'message' => 'Password changed successfully'];
    },
    'permission_callback' => function () {
      $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
      return wp_verify_nonce($nonce, 'wp_rest');
    },
  ]);
});