<?php

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

function enqueue_google_fonts() {
  wp_enqueue_style(
    'google-fonts',
    'https://fonts.googleapis.com/css2?family=Heebo:wght@100..900&family=IBM+Plex+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=IBM+Plex+Sans+Hebrew:wght@100;200;300;400;500;600;700&display=swap',
    false
  );
}
add_action('wp_enqueue_scripts', 'enqueue_google_fonts');

// 1. Add nonce to localized script
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_script('ourmainjs'); // Replace with your actual handle
  wp_localize_script('ourmainjs', 'wpApiSettings', [
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

  // Basic validation
  if (
    empty($data['email']) ||
    empty($data['password']) ||
    empty($data['first_name'])
  ) {
    return new WP_REST_Response(['message' => 'Missing required fields'], 400);
  }

  if (!is_email($data['email'])) {
    return new WP_REST_Response(['message' => 'Invalid email'], 400);
  }

  // Create the user
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

  // Store checkbox value
  update_user_meta($user_id, 'agree', sanitize_text_field($data['agree']));

  // Notify UsersWP
  do_action('uwp_user_register', $user_id, null, $data);

  return new WP_REST_Response(['success' => true], 200);
}

add_action( 'wp_enqueue_scripts', function () {
	$handle = 'theme-frontend';                // ← change to your real JS handle
	$src    = get_theme_file_uri( 'build/index.js' );

	// enqueue main bundle first (if not already enqueued elsewhere)
	if ( ! wp_script_is( $handle, 'enqueued' ) ) {
		wp_enqueue_script( $handle, $src, [ 'wp-api-fetch' ], null, true );
	}

	// UsersWP provides its own nonce via wp_create_nonce( 'wp_rest' )
	wp_localize_script( $handle, 'UWP_LOGIN', [
		'endpoint' => rest_url( 'uwp/v1/login' ), // UsersWP REST route
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
  file_put_contents(
    __DIR__ . '/login-debug.log', // adjust path as needed
    print_r($data, true),
    FILE_APPEND
  );
  $data = $request->get_json_params();

  $creds = [
    'user_login'    => isset($data['email']) ? sanitize_user($data['email']) : '',
    'user_password' => $data['password'] ?? '',
    'remember'      => true,
  ];

  $user = wp_signon($creds, false);

  if (is_wp_error($user)) {
    return new WP_REST_Response(['message' => $user->get_error_message()], 403);
  }

  // Optional: Set current user + cookie for auth
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

  // --- minimal validation -------------------------------------------------
  foreach ( [ 'email', 'password', 'first_name', 'organisation' ] as $key ) {
    if ( empty( $d[ $key ] ) )
      return new WP_REST_Response( [ 'message' => "Missing field: $key" ], 400 );
  }
  if ( ! is_email( $d['email'] ) )
    return new WP_REST_Response( [ 'message' => 'Invalid email' ], 400 );

  // --- create user --------------------------------------------------------
  $user_id = wp_insert_user( [
    'user_login' => sanitize_user( $d['email'] ),
    'user_pass'  => $d['password'],
    'user_email' => sanitize_email( $d['email'] ),
    'first_name' => sanitize_text_field( $d['first_name'] ),
    'last_name'  => sanitize_text_field( $d['last_name'] ),
    'display_name' => sanitize_text_field( $d['organisation'] ),
    'role'       => 'subscriber',                // or a custom 'organisation' role
  ] );

  if ( is_wp_error( $user_id ) )
    return new WP_REST_Response( [ 'message' => $user_id->get_error_message() ], 400 );

  // --- meta + UsersWP fields ---------------------------------------------
  update_user_meta( $user_id, 'organisation_name', sanitize_text_field( $d['organisation'] ) );
  update_user_meta( $user_id, 'business_type',     sanitize_text_field( $d['business_type'] ) );
  update_user_meta( $user_id, 'phone',             sanitize_text_field( $d['phone'] ) );
  update_user_meta( $user_id, 'news_opt_in',       $d['news_opt_in'] === 'yes' ? 'yes' : 'no' );
  update_user_meta( $user_id, 'agree',             $d['agree'] === 'yes' ? 'yes' : 'no' );

  // tell UsersWP
  do_action( 'uwp_user_register', $user_id, null, $d );

  return new WP_REST_Response( [ 'success' => true ], 200 );
}

add_action('init', function () {
  // ===== REGISTER CUSTOM POST TYPES =====
  $post_types = [
    'event' => 'Event',
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
      'rewrite' => ['slug' => $slug . 's'], // e.g. /podcasts
      'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
      'show_in_rest' => true,
      'menu_position' => 5,
      'menu_icon' => 'dashicons-media-document', // Customize per type if you want
    ]);
  }

  // ===== REGISTER CUSTOM TAXONOMIES =====
  $taxonomies = [
    'category'      => 'Category',
    'topic_tag'     => 'Topic',
    'audience_tag'  => 'Audience',
    'location_tag'  => 'Location',
    'feature_tag'   => 'Feature',
    'people_tag'    => 'People',
  ];

  foreach ($taxonomies as $slug => $name) {
    register_taxonomy($slug, ['event', 'podcast', 'article', 'directory', 'resource'], [
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

// Load ACF JSON from your theme folder
add_filter('acf/settings/load_json', function ($paths) {
  // Remove default path
  unset($paths[0]);

  // Append theme path
  $paths[] = get_stylesheet_directory() . '/acf-json';

  return $paths;
});