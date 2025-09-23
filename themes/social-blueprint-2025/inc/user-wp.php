<?php
add_action('rest_api_init', function () {
  // Get user profile
  register_rest_route('custom/v1', '/user-profile', [
    'methods' => 'GET',
    'callback' => 'custom_get_user_profile',
    'permission_callback' => function () {
      return is_user_logged_in();
    }
  ]);

  // Update user profile
  register_rest_route('custom/v1', '/user-profile', [
    'methods' => 'POST',
    'callback' => 'custom_update_user_profile',
    'permission_callback' => function () {
      $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
      return is_user_logged_in() && wp_verify_nonce($nonce, 'wp_rest');
    },
    'args' => [
      'first_name' => [
        'required' => true,
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'validate_callback' => function($param) {
          return !empty(trim($param));
        }
      ],
      'last_name' => [
        'required' => true,
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'validate_callback' => function($param) {
          return !empty(trim($param));
        }
      ],
      'email' => [
        'required' => true,
        'type' => 'string',
        'sanitize_callback' => 'sanitize_email',
        'validate_callback' => function($param, $request, $key) {
          if (!is_email($param)) {
            return new WP_Error('invalid_email', 'Please enter a valid email address');
          }
          
          // Check if email is already taken by another user
          $current_user = wp_get_current_user();
          $existing_user = get_user_by('email', $param);
          
          if ($existing_user && $existing_user->ID !== $current_user->ID) {
            return new WP_Error('email_exists', 'This email is already registered to another account');
          }
          
          return true;
        }
      ],
      'phone' => [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field'
      ],
      'bio' => [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_textarea_field'
      ]
    ]
  ]);

  // Upload avatar
  register_rest_route('custom/v1', '/upload-avatar', [
    'methods' => 'POST',
    'callback' => 'custom_upload_avatar',
    'permission_callback' => function () {
      $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
      return is_user_logged_in() && wp_verify_nonce($nonce, 'wp_rest');
    }
  ]);

  // Change password
  register_rest_route('custom/v1', '/change-password', [
    'methods' => 'POST',
    'callback' => 'custom_change_password',
    'permission_callback' => function () {
      $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
      return is_user_logged_in() && wp_verify_nonce($nonce, 'wp_rest');
    },
    'args' => [
      'current_password' => [
        'required' => true,
        'type' => 'string'
      ],
      'new_password' => [
        'required' => true,
        'type' => 'string',
        'validate_callback' => function($param) {
          if (strlen($param) < 8) {
            return new WP_Error('weak_password', 'Password must be at least 8 characters long');
          }
          return true;
        }
      ]
    ]
  ]);
});

function custom_get_user_profile() {
  $user = wp_get_current_user();
  
  if (!$user || !$user->ID) {
    return new WP_Error('unauthorized', 'Not logged in', ['status' => 401]);
  }

  // Get custom avatar URL if set, otherwise use gravatar
  $avatar_attachment_id = get_user_meta($user->ID, 'uwp_profile_photo', true);
  $avatar_url = $avatar_attachment_id 
    ? wp_get_attachment_image_url($avatar_attachment_id, 'thumbnail') 
    : get_avatar_url($user->ID, ['size' => 150]);

  return [
    'ID' => $user->ID,
    'first_name' => $user->first_name ?: '',
    'last_name' => $user->last_name ?: '',
    'display_name' => $user->display_name ?: '',
    'username' => $user->user_login ?: '',
    'email' => $user->user_email ?: '',
    'bio' => get_user_meta($user->ID, 'description', true) ?: '',
    'phone' => get_user_meta($user->ID, 'phone', true) ?: '',
    'avatar' => $avatar_url ?: '',
    'registration_date' => $user->user_registered
  ];
}

function custom_update_user_profile($request) {
  $user = wp_get_current_user();
  
  if (!$user || !$user->ID) {
    return new WP_Error('unauthorized', 'Not logged in', ['status' => 401]);
  }

  $data = $request->get_params();

  try {
    // Update core user data
    $user_data = [
      'ID' => $user->ID,
      'first_name' => $data['first_name'],
      'last_name' => $data['last_name'],
      'user_email' => $data['email'],
    ];

    // Generate display name from first and last name
    $display_name = trim($data['first_name'] . ' ' . $data['last_name']);
    if (!empty($display_name)) {
      $user_data['display_name'] = $display_name;
    }

    $result = wp_update_user($user_data);
    
    if (is_wp_error($result)) {
      return new WP_Error('update_failed', $result->get_error_message(), ['status' => 400]);
    }

    // Update meta fields
    if (isset($data['phone'])) {
      update_user_meta($user->ID, 'phone', $data['phone']);
    }
    
    if (isset($data['bio'])) {
      update_user_meta($user->ID, 'description', $data['bio']);
    }

    // Return updated profile data
    return custom_get_user_profile();
    
  } catch (Exception $e) {
    error_log("Profile update error for user {$user->ID}: " . $e->getMessage());
    return new WP_Error('server_error', 'An error occurred while updating your profile', ['status' => 500]);
  }
}

function custom_upload_avatar(WP_REST_Request $request) {
  $user_id = get_current_user_id();
  
  if (!$user_id) {
    return new WP_Error('unauthorized', 'Not logged in', ['status' => 401]);
  }

  if (empty($_FILES['avatar'])) {
    return new WP_Error('no_file', 'No file uploaded', ['status' => 400]);
  }

  // Validate file
  $file = $_FILES['avatar'];
  
  // Check file size (2MB limit)
  $max_size = 2 * 1024 * 1024;
  if ($file['size'] > $max_size) {
    return new WP_Error('file_too_large', 'Image must be less than 2MB', ['status' => 400]);
  }

  // Check file type
  $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  $finfo = finfo_open(FILEINFO_MIME_TYPE);
  $mime_type = finfo_file($finfo, $file['tmp_name']);
  finfo_close($finfo);
  
  if (!in_array($mime_type, $allowed_types)) {
    return new WP_Error('invalid_file_type', 'Please upload a JPEG, PNG, or GIF image', ['status' => 400]);
  }

  try {
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    // Add filter to modify upload directory for avatars
    add_filter('upload_dir', 'custom_avatar_upload_dir');
    
    $attachment_id = media_handle_upload('avatar', 0, [
      'post_title' => "Avatar for user {$user_id}",
      'post_content' => '',
      'post_status' => 'inherit'
    ]);

    // Remove filter
    remove_filter('upload_dir', 'custom_avatar_upload_dir');

    if (is_wp_error($attachment_id)) {
      return new WP_Error('upload_failed', $attachment_id->get_error_message(), ['status' => 400]);
    }

    // Delete old avatar if exists
    $old_avatar_id = get_user_meta($user_id, 'uwp_profile_photo', true);
    if ($old_avatar_id && $old_avatar_id !== $attachment_id) {
      wp_delete_attachment($old_avatar_id, true);
    }

    // Update user meta
    update_user_meta($user_id, 'uwp_profile_photo', $attachment_id);

    // Get the new avatar URL
    $avatar_url = wp_get_attachment_image_url($attachment_id, 'thumbnail');
    
    if (!$avatar_url) {
      return new WP_Error('url_generation_failed', 'Failed to generate avatar URL', ['status' => 500]);
    }

    return [
      'success' => true,
      'url' => $avatar_url,
      'attachment_id' => $attachment_id
    ];

  } catch (Exception $e) {
    error_log("Avatar upload error for user {$user_id}: " . $e->getMessage());
    return new WP_Error('server_error', 'An error occurred while uploading your avatar', ['status' => 500]);
  }
}

function custom_avatar_upload_dir($upload) {
  $upload['subdir'] = '/avatars' . $upload['subdir'];
  $upload['path'] = $upload['basedir'] . $upload['subdir'];
  $upload['url'] = $upload['baseurl'] . $upload['subdir'];
  return $upload;
}

function custom_change_password($request) {
  $user_id = get_current_user_id();
  
  if (!$user_id) {
    return new WP_Error('unauthorized', 'Not logged in', ['status' => 401]);
  }

  $params = $request->get_params();
  $user = get_user_by('ID', $user_id);

  // Verify current password
  if (!wp_check_password($params['current_password'], $user->user_pass, $user->ID)) {
    return new WP_Error('incorrect_password', 'Current password is incorrect', ['status' => 400]);
  }

  // Additional password strength checks
  $new_password = $params['new_password'];
  
  if (strlen($new_password) < 8) {
    return new WP_Error('weak_password', 'Password must be at least 8 characters long', ['status' => 400]);
  }

  if ($new_password === $params['current_password']) {
    return new WP_Error('same_password', 'New password must be different from current password', ['status' => 400]);
  }

  try {
    wp_set_password($new_password, $user->ID);
    
    // Log the user back in since wp_set_password logs them out
    wp_set_current_user($user->ID);
    wp_set_auth_cookie($user->ID);
    
    return [
      'success' => true,
      'message' => 'Password changed successfully'
    ];
    
  } catch (Exception $e) {
    error_log("Password change error for user {$user_id}: " . $e->getMessage());
    return new WP_Error('server_error', 'An error occurred while changing your password', ['status' => 500]);
  }
}