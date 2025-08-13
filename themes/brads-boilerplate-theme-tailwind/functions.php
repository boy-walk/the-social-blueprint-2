<?php
// functions.php
require_once get_template_directory() . '/inc/related.php';

function boilerplate_load_assets() {
  wp_enqueue_script('ourmainjs', get_theme_file_uri('/build/index.js'), array('wp-element', 'react-jsx-runtime'), '1.0', true);
  wp_enqueue_style('ourmaincss', get_theme_file_uri('/build/index.css'));
}
add_action('wp_enqueue_scripts', 'boilerplate_load_assets');

function boilerplate_add_support() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'boilerplate_add_support');

add_action('init', function () {
  register_post_type('sponsorship-banner', [
    'public' => true,
    'label' => 'Sponsorship Banner',
  ]);
});

// 1. Add nonce to localized script
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_script('ourmainjs');
  wp_localize_script('ourmainjs', 'wpApiSettings', [
    'nonce' => wp_create_nonce('wp_rest'),
  ]);
});
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_script('ourmainjs');
  wp_localize_script('ourmainjs', 'WPData', [
    'nonce' => wp_create_nonce('wp_rest'),
  ]);
});

// 2. Register REST route
add_action('rest_api_init', function () {
  register_rest_route('uwp-custom/v1', '/register', [
    'methods' => 'POST',
    'callback' => 'uwp_custom_register_user',
    'permission_callback' => function () {
      return wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'] ?? '', 'wp_rest');
    },
  ]);
});

// 3. REST Callback to register user
function uwp_custom_register_user(WP_REST_Request $request) {
  $data = $request->get_json_params();

  if (empty($data['email']) || empty($data['password']) || empty($data['first_name'])) {
    return new WP_REST_Response(['message' => 'Missing required fields'], 400);
  }
  if (!is_email($data['email'])) {
    return new WP_REST_Response(['message' => 'Invalid email'], 400);
  }

  $user_id = wp_insert_user([
    'user_login' => sanitize_user($data['email']),
    'user_pass'  => $data['password'],
    'user_email' => sanitize_email($data['email']),
    'first_name' => sanitize_text_field($data['first_name']),
    'last_name'  => sanitize_text_field($data['last_name']),
    'role'       => 'subscriber',
  ]);

  if (is_wp_error($user_id)) {
    return new WP_REST_Response(['message' => $user_id->get_error_message()], 400);
  }

  update_user_meta($user_id, 'agree', sanitize_text_field($data['agree']));
  do_action('uwp_user_register', $user_id, null, $data);

  return new WP_REST_Response(['success' => true], 200);
}

add_action( 'wp_enqueue_scripts', function () {
	$handle = 'theme-frontend';
	$src    = get_theme_file_uri( 'build/index.js' );

	if ( ! wp_script_is( $handle, 'enqueued' ) ) {
		wp_enqueue_script( $handle, $src, [ 'wp-api-fetch' ], null, true );
	}

	wp_localize_script( $handle, 'UWP_LOGIN', [
		'endpoint' => rest_url( 'uwp/v1/login' ),
		'nonce'    => wp_create_nonce( 'wp_rest' ),
	] );
} );

add_action('rest_api_init', function () {
  register_rest_route('uwp-custom/v1', '/login', [
    'methods' => 'POST',
    'callback' => 'uwp_custom_login_user',
    'permission_callback' => '__return_true',
  ]);
});

function uwp_custom_login_user(WP_REST_Request $request) {
  $data = $request->get_json_params(); // moved BEFORE debug
  // optional debug:
  // file_put_contents(__DIR__ . '/login-debug.log', print_r($data, true), FILE_APPEND);

  $creds = [
    'user_login'    => isset($data['email']) ? sanitize_user($data['email']) : '',
    'user_password' => $data['password'] ?? '',
    'remember'      => true,
  ];

  $user = wp_signon($creds, false);

  if (is_wp_error($user)) {
    return new WP_REST_Response(['message' => $user->get_error_message()], 403);
  }

  wp_set_current_user($user->ID);
  wp_set_auth_cookie($user->ID);

  return new WP_REST_Response(['success' => true, 'user_id' => $user->ID], 200);
}

/**
 *  Register a BUSINESS / ORGANISATION account
 *  POST /wp-json/uwp-custom/v1/register-organisation
 */
add_action( 'rest_api_init', function () {
  register_rest_route( 'uwp-custom/v1', '/register-organisation', [
    'methods'  => 'POST',
    'callback' => 'uwp_custom_register_organisation',
    'permission_callback' => function () {
      return wp_verify_nonce( $_SERVER['HTTP_X_WP_NONCE'] ?? '', 'wp_rest' );
    },
  ] );
} );

function uwp_custom_register_organisation( WP_REST_Request $request ) {
  $d = $request->get_json_params();

  foreach ( [ 'email', 'password', 'first_name', 'organisation' ] as $key ) {
    if ( empty( $d[ $key ] ) )
      return new WP_REST_Response( [ 'message' => "Missing field: $key" ], 400 );
  }
  if ( ! is_email( $d['email'] ) )
    return new WP_REST_Response( [ 'message' => 'Invalid email' ], 400 );

  $user_id = wp_insert_user( [
    'user_login' => sanitize_user( $d['email'] ),
    'user_pass'  => $d['password'],
    'user_email' => sanitize_email( $d['email'] ),
    'first_name' => sanitize_text_field( $d['first_name'] ),
    'last_name'  => sanitize_text_field( $d['last_name'] ),
    'display_name' => sanitize_text_field( $d['organisation'] ),
    'role'       => 'subscriber',
  ] );

  if ( is_wp_error( $user_id ) )
    return new WP_REST_Response( [ 'message' => $user_id->get_error_message() ], 400 );

  update_user_meta( $user_id, 'organisation_name', sanitize_text_field( $d['organisation'] ) );
  update_user_meta( $user_id, 'business_type',     sanitize_text_field( $d['business_type'] ) );
  update_user_meta( $user_id, 'phone',             sanitize_text_field( $d['phone'] ) );
  update_user_meta( $user_id, 'news_opt_in',       $d['news_opt_in'] === 'yes' ? 'yes' : 'no' );
  update_user_meta( $user_id, 'agree',             $d['agree'] === 'yes' ? 'yes' : 'no' );

  do_action( 'uwp_user_register', $user_id, null, $d );

  return new WP_REST_Response( [ 'success' => true ], 200 );
}

add_action('init', function () {
  // ===== REGISTER CUSTOM POST TYPES =====
  $post_types = [
    'podcast' => 'Podcast',
    'article' => 'Article',
    'directory' => 'Directory Listing',
    'resource' => 'Resource',
  ];

  foreach ($post_types as $slug => $name) {
    register_post_type($slug, [
      'labels' => [
        'name' => $name . 's',
        'singular_name' => $name,
        'add_new_item' => 'Add New ' . $name,
        'edit_item' => 'Edit ' . $name,
        'new_item' => 'New ' . $name,
        'view_item' => 'View ' . $name,
        'search_items' => 'Search ' . $name . 's',
      ],
      'public' => true,
      'has_archive' => true,
      'rewrite' => ['slug' => $slug . 's'],
      'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
      'show_in_rest' => true,
      'menu_position' => 5,
      'menu_icon' => 'dashicons-media-document',
    ]);
  }
});

add_action('init', function () {
  // Your taxonomies and their labels
  $taxonomies = [
    'category'      => 'Category',
    'topic_tag'     => 'Topic',
    'audience_tag'  => 'Audience',
    'location_tag'  => 'Location',
    'feature_tag'   => 'Feature',
    'people_tag'    => 'People',
  ];

  foreach ($taxonomies as $slug => $name) {
    register_taxonomy($slug, ['tribe_events', 'podcast', 'article', 'directory', 'resource'], [
      'label' => $name . ' Tags',
      'hierarchical' => false,
      'public' => true,
      'rewrite' => ['slug' => $slug],
      'show_in_rest' => true,
    ]);
  }
});

add_filter('acf/settings/save_json', function ($path) {
  return get_stylesheet_directory() . '/acf-json';
});
add_filter('acf/settings/load_json', function ($paths) {
  unset($paths[0]);
  $paths[] = get_stylesheet_directory() . '/acf-json';
  return $paths;
});

add_action('rest_api_init', function () {
  register_rest_route('custom/v1', '/user-profile', [
    'methods' => 'GET',
    'callback' => function () {
      $user = wp_get_current_user();
      if (!$user || !$user->ID) return new WP_Error('unauthorized', 'Not logged in', ['status' => 401]);

      return [
        'ID' => $user->ID,
        'first_name' => $user->first_name,
        'last_name' => $user->last_name,
        'display_name' => $user->display_name,
        'email' => $user->user_email,
        'bio' => get_user_meta($user->ID, 'description', true),
        'phone' => get_user_meta($user->ID, 'phone', true),
        'avatar_url' => get_avatar_url($user->ID),
      ];
    },
    'permission_callback' => '__return_true'
  ]);

  register_rest_route('custom/v1', '/user-profile', [
    'methods' => 'POST',
    'callback' => function ($request) {
      $user = wp_get_current_user();
      if (!$user || !$user->ID) return new WP_Error('unauthorized', 'Not logged in', ['status' => 401]);

      $data = $request->get_json_params();

      wp_update_user([
        'ID' => $user->ID,
        'first_name' => sanitize_text_field($data['first_name']),
        'last_name' => sanitize_text_field($data['last_name']),
        'user_email' => sanitize_email($data['email']),
        'display_name' => sanitize_text_field($data['display_name']),
      ]);

      update_user_meta($user->ID, 'phone', sanitize_text_field($data['phone']));
      update_user_meta($user->ID, 'description', sanitize_textarea_field($data['bio']));

      return ['success' => true];
    },
    'permission_callback' => '__return_true'
  ]);
});

add_action('rest_api_init', function () {
  register_rest_route('custom/v1', '/upload-avatar', [
    'methods' => 'POST',
    'callback' => 'custom_upload_avatar',
    'permission_callback' => function () { return is_user_logged_in(); }
  ]);
});

function custom_upload_avatar(WP_REST_Request $request) {
  if (empty($_FILES['avatar'])) {
    return new WP_REST_Response(['message' => 'No file uploaded'], 400);
  }

  require_once ABSPATH . 'wp-admin/includes/file.php';
  require_once ABSPATH . 'wp-admin/includes/media.php';
  require_once ABSPATH . 'wp-admin/includes/image.php';

  $upload = media_handle_upload('avatar', 0);

  if (is_wp_error($upload)) {
    return new WP_REST_Response(['message' => $upload->get_error_message()], 400);
  }

  $user_id = get_current_user_id();
  update_user_meta($user_id, 'uwp_profile_photo', $upload);

  $url = wp_get_attachment_image_url($upload, 'full');

  return new WP_REST_Response(['url' => $url], 200);
}

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
        return new WP_REST_Response(['message' => 'Current password is incorrect'], 400);
      }

      if (empty($params['new_password']) || strlen($params['new_password']) < 6) {
        return new WP_REST_Response(['message' => 'Password must be at least 6 characters'], 400);
      }

      wp_set_password($params['new_password'], $user->ID);
      return ['success' => true];
    },
    'permission_callback' => '__return_true',
  ]);
});

function register_historical_photos_cpt() {
  register_post_type('historical_photo', [
    'label' => 'Historical Photos',
    'public' => false,
    'show_ui' => true,
    'exclude_from_search' => true,
    'show_in_nav_menus' => false,
    'supports' => ['title', 'thumbnail'],
    'menu_icon' => 'dashicons-format-image',
  ]);
}
add_action('init', 'register_historical_photos_cpt');