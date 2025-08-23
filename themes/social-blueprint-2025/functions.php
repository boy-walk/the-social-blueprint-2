<?php
// functions.php
require_once get_template_directory() . '/inc/related.php';
require_once get_template_directory() . '/inc/api.php';

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

add_action('rest_api_init', function () {
  register_rest_route('uwp-custom/v1', '/login', [
    'methods'  => 'POST',
    'callback' => 'uwp_custom_login_user',
    'permission_callback' => '__return_true',
  ]);
});

function uwp_custom_login_user( WP_REST_Request $request ) {
  $data = $request->get_json_params();

  // Keep emails intact; don't use sanitize_user() here
  $login    = isset($data['email'])    ? sanitize_text_field($data['email']) : '';
  $password = isset($data['password']) ? $data['password'] : '';

  if (!$login || !$password) {
    return new WP_REST_Response(['message' => 'Missing credentials.'], 400);
  }

  $creds = [
    'user_login'    => $login,       // can be username OR email
    'user_password' => $password,
    'remember'      => true,         // persistent cookie
  ];

  // Let WP decide secure cookie based on HTTPS/FORCE_SSL_ADMIN
  $user = wp_signon($creds);         // <-- no second arg, no manual cookie calls

  if ( is_wp_error($user) ) {
    return new WP_REST_Response(['message' => $user->get_error_message()], 403);
  }

  // DO NOT call wp_set_current_user/wp_set_auth_cookie again.
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
    'phone' => sanitize_text_field( $d['phone'] ),
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
    add_post_type_support($slug, 'author');
  }
});

add_action('init', function () {
  $post_types = [
    'tribe_events', 'podcast', 'article',
    'gd_discount', 'gd_aid_listing', 'gd_health_listing', 'gd_business',
    'gd_photo_gallery', 'gd_cost_of_living'
  ];

  // Register THEME (multi-select, tag-like), but lock creation/deletion of new terms.
  register_taxonomy('theme', $post_types, [
    'label'        => 'Theme',
    'labels'       => [
      'name'          => 'Themes',
      'singular_name' => 'Theme',
      'menu_name'     => 'Themes',
      'search_items'  => 'Search Themes',
      'all_items'     => 'All Themes',
      'edit_item'     => 'Edit Theme',
      'update_item'   => 'Update Theme',
      'add_new_item'  => 'Add New Theme',
      'new_item_name' => 'New Theme',
    ],
    'hierarchical' => true,           // tag-like (multi by default)
    'public'       => true,
    'rewrite'      => ['slug' => 'theme'],
    'show_in_rest' => true,            // visible in block editor / REST
    'show_ui'      => true,
    // Block adding/editing/deleting terms; allow assigning only.
  ]);

  // Other tag-like taxonomies (unchanged)
  $other_tax = [
    'topic_tag'    => 'Topic',
    'audience_tag' => 'Audience',
    'location_tag' => 'Location',
    'people_tag'   => 'People',
  ];
  foreach ($other_tax as $slug => $name) {
    register_taxonomy($slug, $post_types, [
      'label'        => $name . ' Tags',
      'hierarchical' => false,
      'public'       => true,
      'rewrite'      => ['slug' => $slug],
      'show_in_rest' => true,
    ]);
  }

  // Seed the fixed Theme terms (safe to run on every init — checks existence)
  $themes = [
    'community-and-connection' => 'Community and Connection',
    'learning-and-growth'      => 'Learning and Growth',
    'events-and-experiences'   => 'Events and Experiences',
    'support-and-services'     => 'Support and Services',
    'culture-and-identity'     => 'Culture and Identity',
  ];
  foreach ($themes as $slug => $name) {
    if (!term_exists($slug, 'theme')) {
      wp_insert_term($name, 'theme', ['slug' => $slug]);
    }
  }

  // Register flags in REST (unchanged)
  foreach ($post_types as $pt) {
    register_post_meta($pt, 'is_featured', [
      'type'              => 'boolean',
      'single'            => true,
      'default'           => false,
      'show_in_rest'      => true,
      'sanitize_callback' => 'rest_sanitize_boolean',
      'auth_callback'     => function () { return current_user_can('edit_posts'); },
    ]);
    register_post_meta($pt, 'is_sponsored', [
      'type'              => 'boolean',
      'single'            => true,
      'default'           => false,
      'show_in_rest'      => true,
      'sanitize_callback' => 'rest_sanitize_boolean',
      'auth_callback'     => function () { return current_user_can('edit_posts'); },
    ]);
  }
}, 10);

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

add_filter('single_template', function ($template) {
  if (!is_singular()) return $template;
  $pt = get_post_type();
  if (strpos($pt, 'gd_') !== 0) return $template;

  if ($specific = locate_template("single-{$pt}.php")) return $specific;
  if ($generic  = locate_template('single-gd_generic.php')) return $generic;

  return $template;
}, 20);


add_action('add_meta_boxes', function () {
  $pts = [
    'tribe_events','podcast','article','directory',
    'gd_discount','gd_aid_listing','gd_health_listing','gd_business',
    'gd_photo_gallery','gd_cost_of_living'
  ];
  foreach ($pts as $pt) {
    add_meta_box(
      'tsb_flags_box',
      'Flags',
      function ($post) {
        $featured   = (bool) get_post_meta($post->ID, 'is_featured', true);
        $sponsored  = (bool) get_post_meta($post->ID, 'is_sponsored', true);
        wp_nonce_field('tsb_flags_save', 'tsb_flags_nonce');
        ?>
        <p>
          <label>
            <input type="checkbox" name="is_featured" value="1" <?php checked($featured, true); ?> />
            Featured
          </label>
        </p>
        <p>
          <label>
            <input type="checkbox" name="is_sponsored" value="1" <?php checked($sponsored, true); ?> />
            Sponsored
          </label>
        </p>
        <p class="description">Used for badges and prioritisation.</p>
        <?php
      },
      $pt,
      'side',
      'high'
    );
  }
});

add_action('save_post', function ($post_id) {
  if (!isset($_POST['tsb_flags_nonce']) || !wp_verify_nonce($_POST['tsb_flags_nonce'], 'tsb_flags_save')) return;
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
  if (!current_user_can('edit_post', $post_id)) return;

  update_post_meta($post_id, 'is_featured',  isset($_POST['is_featured'])  ? '1' : '0');
  update_post_meta($post_id, 'is_sponsored', isset($_POST['is_sponsored']) ? '1' : '0');
});
