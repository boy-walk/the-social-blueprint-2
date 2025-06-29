<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Porto builders library
 *
 * @since 6.0
 */
class PortoBuilders {

	const BUILDER_SLUG = 'porto_builder';

	const ADMIN_MENU_SLUG = 'edit.php?post_type=' . self::BUILDER_SLUG;

	const BUILDER_TAXONOMY_SLUG = 'porto_builder_type';

	const BUILDER_CAP = 'edit_pages';

	private $lib_condition = null;

	private $post_terms = null;

	public $builder_types;

	/**
	 * Constructor
	 * 
	 * @since 3.1.0 - Added - display condition edits in templates list page.
	 * 
	 * @access public
	 */
	public function __construct() {
		global $porto_settings_optimize;
		if ( empty( $porto_settings_optimize ) ) {
			if ( ! is_customize_preview() ) {
				$porto_settings_optimize = get_option( 'porto_settings_optimize', array() );
			} else {
				$porto_settings_optimize = array();
			}
		}
		if ( ! is_admin() && ( isset( $_REQUEST['elementor-preview'] ) || ( defined( 'WPB_VC_VERSION' ) && isset( $_REQUEST['vc_editable'] ) ) ) ) {
			add_filter(
				'body_class',
				function( $classes ) {
					global $post;
					if ( $post && 'popup' == get_post_meta( (int) $post->ID, self::BUILDER_TAXONOMY_SLUG, true ) ) {
						$classes[] = 'porto-popup-template';
					}
					return $classes;
				}
			);
			//WPB Frontend Builder
			if ( isset( $_REQUEST['vc_editable'] ) ) {
				add_action(
					'wp_enqueue_scripts',
					function() {
						global $post;
						if ( $post && 'popup' == get_post_meta( (int) $post->ID, self::BUILDER_TAXONOMY_SLUG, true ) ) {
							ob_start();
							$popup_width = empty( get_post_meta( (int) $post->ID, 'popup_width', true ) ) ? '740px' : (int) get_post_meta( (int) $post->ID, 'popup_width', true ) . 'px';
							?>
						.page-wrapper {
							position: absolute;
							max-width: <?php echo porto_strip_script_tags( $popup_width ); ?>;
							width: 100%;
							left: 50%;
							top: 50%;
							transform: translate(-50%,-50%);
							z-index: 9999;
							background: #fff;
						}
							<?php
							$style = ob_get_clean();
							wp_add_inline_style( 'porto-theme', $style );
						}
					},
					1001
				);
			}
		}
		$this->builder_types = array(
			'block'   => __( 'Block', 'porto-functionality' ),
			'header'  => __( 'Header', 'porto-functionality' ),
			'footer'  => __( 'Footer', 'porto-functionality' ),
			'product' => __( 'Single Product', 'porto-functionality' ),
			'shop'    => __( 'Product Archive', 'porto-functionality' ),
			'archive' => __( 'Archive', 'porto-functionality' ),
			'single'  => __( 'Single', 'porto-functionality' ),
			'popup'   => __( 'Popup', 'porto-functionality' ),
			'type'    => __( 'Post Type', 'porto-functionality' ),
		);

		if ( ! empty( $porto_settings_optimize['disabled_pbs'] ) && is_array( $porto_settings_optimize['disabled_pbs'] ) ) {
			foreach ( $porto_settings_optimize['disabled_pbs'] as $key ) {
				if ( isset( $this->builder_types[ $key ] ) ) {
					unset( $this->builder_types[ $key ] );
				}
			}
		}

		$this->builder_types = apply_filters( 'porto_templates_builder_types', $this->builder_types );

		add_action( 'init', array( $this, 'add_builder_type' ) );
		add_action( 'admin_menu', array( $this, 'add_builder_menu' ), 20 );
		register_activation_hook(
			PORTO_FUNC_FILE,
			function() {
				$this->add_builder_type();
				flush_rewrite_rules();
			}
		);

		if ( is_admin() ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
			add_action( 'porto_builder_condition_pre_enqueue', array( $this, 'enqueue' ) );
			add_filter( 'views_edit-' . self::BUILDER_SLUG, array( $this, 'admin_print_tabs' ) );
			add_filter( 'manage_' . self::BUILDER_SLUG . '_posts_columns', array( $this, 'admin_column_header' ) );
			add_action( 'manage_' . self::BUILDER_SLUG . '_posts_custom_column', array( $this, 'admin_column_content' ), 10, 2 );
			add_action( 'admin_action_porto-new-builder', array( $this, 'add_builder_post' ) );

			add_action(
				'admin_footer',
				function() {
					include_once PORTO_BUILDERS_PATH . 'views/popup_content.php';
					if ( defined( 'WPB_VC_VERSION' ) && ( vc_is_inline() || 'post-new.php' == $GLOBALS['pagenow'] || 'post.php' == $GLOBALS['pagenow'] ) ) {
						include_once PORTO_BUILDERS_PATH . 'views/edit_area.tpl.php';
					}
				}
			);

			add_action(
				'init',
				function() {
					if ( defined( 'WPB_VC_VERSION' ) ) {
						require_once PORTO_BUILDERS_PATH . 'lib/class-builder-function.php';
					}
					$load_search_lib = false;
					if ( 'post.php' == $GLOBALS['pagenow'] && ( ( isset( $_REQUEST['post'] ) && self::BUILDER_SLUG == get_post_type( $_REQUEST['post'] ) ) || ( isset( $_REQUEST['post_id'] ) && self::BUILDER_SLUG == get_post_type( $_REQUEST['post_id'] ) ) ) ) {

						if ( isset( $_REQUEST['post'] ) ) {
							$post_id = $_REQUEST['post'];
						} else {
							$post_id = $_REQUEST['post_id'];
						}
						if ( 'block' != get_post_meta( (int) $post_id, self::BUILDER_TAXONOMY_SLUG, true ) ) {
							$load_search_lib = true;
						}
					}

					if ( 'edit.php' == $GLOBALS['pagenow'] && ( ! empty( $_REQUEST['post_type'] ) && self::BUILDER_SLUG == $_REQUEST['post_type'] ) ) {
						$load_search_lib = true;
					}

					if ( wp_doing_ajax() && isset( $_REQUEST['action'] ) && 0 === strpos( $_REQUEST['action'], 'porto_builder_' ) ) {
						$load_search_lib = true;
					}

					if ( $load_search_lib ) {
						require_once PORTO_BUILDERS_PATH . 'lib/class-condition.php';
						new Porto_Builder_Condition;
					}
				}
			);

            add_action( 'trashed_post', array( $this, 'template_builder_trash' ), 99, 2 );
		}
		if ( ! empty( $_REQUEST['post'] ) && ! empty( get_post_meta( $_REQUEST['post'], PortoBuilders::BUILDER_TAXONOMY_SLUG, true ) ) ||
			! empty( $_REQUEST['post_id'] ) && ! empty( get_post_meta( $_REQUEST['post_id'], PortoBuilders::BUILDER_TAXONOMY_SLUG, true ) )
		 ) {
			add_filter(
				'porto_builder',
				function( $vars ) {
					$post_id = ! empty( $_REQUEST['post'] ) ? $_REQUEST['post'] : $_REQUEST['post_id'];
					$post_id = (int) $post_id;
					$vars['builder_type'] = get_post_meta( $post_id, PortoBuilders::BUILDER_TAXONOMY_SLUG, true );
					if ( 'header' == $vars['builder_type'] ) {
						$vars['header_type'] = get_post_meta( $post_id, 'header_type', true );
						if ( 'side' == $vars['header_type'] ) {
							$vars['header_side_width'] = get_post_meta( $post_id, 'header_side_width', true );
						}
					}
					return $vars;
				}
			);
			if ( 'header' == get_post_meta( ! empty( $_REQUEST['post'] ) ? $_REQUEST['post'] : $_REQUEST['post_id'], PortoBuilders::BUILDER_TAXONOMY_SLUG, true ) ) {
				add_filter( 'porto_header_builder', '__return_true' );
			}
		}
		// register builder elements
		add_action(
			'init',
			function() {
				global $porto_settings;
				// if ( ! defined( 'ELEMENTOR_VERSION' ) && ! defined( 'WPB_VC_VERSION' ) && ! empty( $porto_settings['enable-gfse'] ) ) {
				// 	require_once PORTO_BUILDERS_PATH . 'elements/header/init.php';
				// 	return;
				// }
				if ( is_admin() && defined( 'WPB_VC_VERSION' ) && ( ! empty( $_REQUEST['post'] ) || ! empty( $_REQUEST['post_id'] ) ) ) {
					$post_id = -1;
					if ( ! empty( $_REQUEST['post'] ) ) {
						$post_id = $_REQUEST['post'];
					} else {
						$post_id = $_REQUEST['post_id'];
					}

					$builder_type = get_post_meta( (int) $post_id, PortoBuilders::BUILDER_TAXONOMY_SLUG, true );

					if ( 'header' == $builder_type || 'footer' == $builder_type ) {
						global $vc_row_layouts;

						$vc_row_layouts = array(
							array(
								'cells'      => 'flex1_flexauto',
								'mask'       => '215',
								'title'      => 'flex-1 + flex-auto',
								'icon_class' => 'flex-1_flex-auto',
							),
							array(
								'cells'      => 'flex1_flexauto_flex1',
								'mask'       => '216',
								'title'      => 'flex-1 + flex-auto + flex-1',
								'icon_class' => 'flex-1_flex-auto_flex-1',
							),
							array(
								'cells'      => 'flexauto_flex1_flexauto',
								'mask'       => '217',
								'title'      => 'flex-auto + flex-1 + flex-auto',
								'icon_class' => 'flex-auto_flex-1_flex-auto',
							),
							array(
								'cells'      => '11',
								'mask'       => '12',
								'title'      => '1/1',
								'icon_class' => '1-1',
							),
							array(
								'cells'      => '12_12',
								'mask'       => '26',
								'title'      => '1/2 + 1/2',
								'icon_class' => '1-2_1-2',
							),
							array(
								'cells'      => '23_13',
								'mask'       => '29',
								'title'      => '2/3 + 1/3',
								'icon_class' => '2-3_1-3',
							),
							array(
								'cells'      => '13_13_13',
								'mask'       => '312',
								'title'      => '1/3 + 1/3 + 1/3',
								'icon_class' => '1-3_1-3_1-3',
							),
							array(
								'cells'      => '14_14_14_14',
								'mask'       => '420',
								'title'      => '1/4 + 1/4 + 1/4 + 1/4',
								'icon_class' => '1-4_1-4_1-4_1-4',
							),
							array(
								'cells'      => '14_34',
								'mask'       => '212',
								'title'      => '1/4 + 3/4',
								'icon_class' => '1-4_3-4',
							),
							array(
								'cells'      => '14_12_14',
								'mask'       => '313',
								'title'      => '1/4 + 1/2 + 1/4',
								'icon_class' => '1-4_1-2_1-4',
							),
							array(
								'cells'      => '56_16',
								'mask'       => '218',
								'title'      => '5/6 + 1/6',
								'icon_class' => '5-6_1-6',
							),
							array(
								'cells'      => '16_16_16_16_16_16',
								'mask'       => '642',
								'title'      => '1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6',
								'icon_class' => '1-6_1-6_1-6_1-6_1-6_1-6',
							),
							array(
								'cells'      => '16_23_16',
								'mask'       => '319',
								'title'      => '1/6 + 4/6 + 1/6',
								'icon_class' => '1-6_2-3_1-6',
							),
							array(
								'cells'      => '16_16_16_12',
								'mask'       => '424',
								'title'      => '1/6 + 1/6 + 1/6 + 1/2',
								'icon_class' => '1-6_1-6_1-6_1-2',
							),
							array(
								'cells'      => '15_15_15_15_15',
								'mask'       => '530',
								'title'      => '1/5 + 1/5 + 1/5 + 1/5 + 1/5',
								'icon_class' => 'l_15_15_15_15_15',
							),
						);
					}
				}
				if ( array_key_exists( 'header', $this->builder_types ) ) {
					require_once PORTO_BUILDERS_PATH . 'elements/header/init.php';
				}

				if ( array_key_exists( 'type', $this->builder_types ) ) {
					require_once PORTO_BUILDERS_PATH . 'elements/type/init.php';
				}

				if ( class_exists( 'Woocommerce' ) ) {
					if ( array_key_exists( 'product', $this->builder_types ) ) {
						require_once PORTO_BUILDERS_PATH . 'elements/product/init.php';
					}

					if ( array_key_exists( 'shop', $this->builder_types ) ) {
						require_once PORTO_BUILDERS_PATH . 'elements/shop/init.php';
					}
				} else {
					unset( $this->builder_types['product'] );
					unset( $this->builder_types['shop'] );
				}

				if ( array_key_exists( 'archive', $this->builder_types ) ) {
					require_once PORTO_BUILDERS_PATH . 'elements/archive/init.php';
				}

				if ( array_key_exists( 'single', $this->builder_types ) ) {
					require_once PORTO_BUILDERS_PATH . 'elements/single/init.php';
				}
			},
			2
		);

		add_action(
			'wp',
			function () {
				if ( is_singular( PortoBuilders::BUILDER_SLUG ) ) {
					$this->post_terms = wp_get_post_terms( get_the_ID(), PortoBuilders::BUILDER_TAXONOMY_SLUG, array( 'fields' => 'names' ) );
					if ( empty( $this->post_terms ) ) {
						return;
					}
					if ( 'product' == $this->post_terms[0] ) {
						add_filter( 'body_class', array( $this, 'filter_body_class' ) );
						add_filter( 'porto_is_product', '__return_true' );
					}
					if ( 'shop' == $this->post_terms[0] ) {
						add_filter( 'body_class', array( $this, 'filter_body_class' ) );
						add_filter( 'porto_is_shop', '__return_true' );
					}
					if ( 'archive' == $this->post_terms[0] ) {
						add_filter( 'body_class', array( $this, 'filter_body_class' ) );
						add_filter( 'porto_is_archive', '__return_true' );
					}
					if ( 'single' == $this->post_terms[0] ) {
						add_filter( 'body_class', array( $this, 'filter_body_class' ) );
					}
				}
			}
		);

		// save edit area size
		add_action( 'wp_ajax_vc_save', array( $this, 'save_custom_panel_options' ), 9 );
		add_action( 'save_post', array( $this, 'save_custom_panel_options' ), 1 );
	}

	/**
	 * Filters the body classes.
	 * 
	 * @since 2.6.0
	 */
	public function filter_body_class( $classes ) {
		global $post;
		if ( $post && PortoBuilders::BUILDER_SLUG == $post->post_type ) {
			$classes[] = 'product' == $this->post_terms[0] ? 'single-product' : $this->post_terms[0] . '-builder';
			if ( 'shop' == $this->post_terms[0] ) {
				$classes[] = 'woocommerce-page archive';
			}
		}
		return $classes;
	}

	/**
	 * Enqueue needed scripts
	 */
	public function enqueue() {
		$screen = get_current_screen();
		if ( defined( 'PORTO_JS' ) /*&& $screen && ( ( 'edit' == $screen->base && 'edit-porto_builder' == $screen->id ) || ( 'post' == $screen->base && self::BUILDER_SLUG == $screen->id ) )*/ ) {
			wp_enqueue_style( 'porto-builder-fonts', '//fonts.googleapis.com/css?family=Poppins%3A400%2C600%2C700&display=swap' );
			wp_enqueue_style( 'jquery-magnific-popup', PORTO_CSS . '/magnific-popup.min.css', false, '1.1.0', 'all' );
			wp_enqueue_script( 'jquery-magnific-popup', PORTO_JS . '/libs/jquery.magnific-popup.min.js', array( 'jquery-core' ), '1.1.0', true );
			wp_enqueue_script( 'porto-builder-admin', str_replace( '/shortcodes', '/builders', PORTO_SHORTCODES_URL ) . 'assets/admin.js', array( 'jquery-core' ), PORTO_FUNC_VERSION, true );
		}
	}

	/**
	 * Register builder post type and builder types as taxonomies
	 */
	public function add_builder_type() {
		global $porto_settings;
		// Gutenberg Full Site Editing
		// if ( ! defined( 'ELEMENTOR_VERSION' ) && ! defined( 'WPB_VC_VERSION' ) && ! empty( $porto_settings['enable-gfse'] ) ) {
		// 	return;
		// }
		$singular_name = __( 'Template Builder', 'porto-functionality' );
		$name          = __( 'Templates Builder', 'porto-functionality' );
		$current_type  = $singular_name;
		if ( ! empty( $_REQUEST[ self::BUILDER_TAXONOMY_SLUG ] ) && isset( $this->builder_types[ $_REQUEST[ self::BUILDER_TAXONOMY_SLUG ] ] ) ) {
			$current_type = $this->builder_types[ $_REQUEST[ self::BUILDER_TAXONOMY_SLUG ] ];
		}
		$labels = array(
			'name'               => $name,
			'singular_name'      => $current_type,
			/* translators: current type */
			'add_new'            => sprintf( __( 'Add New %s', 'porto-functionality' ), str_replace( $singular_name, '', $current_type ) ),
			/* translators: %s: content type singular name */
			'add_new_item'       => sprintf( __( 'Add New %s', 'porto-functionality' ), $current_type ),
			/* translators: %s: content type singular name */
			'edit_item'          => sprintf( __( 'Edit %s', 'porto-functionality' ), $current_type ),
			/* translators: %s: content type singular name */
			'new_item'           => sprintf( __( 'New %s', 'porto-functionality' ), $current_type ),
			/* translators: %s: content type singular name */
			'view_item'          => sprintf( __( 'View %s', 'porto-functionality' ), $current_type ),
			/* translators: %s: content type singular label */
			'search_items'       => sprintf( __( 'Search %s', 'porto-functionality' ), $name ),
			/* translators: %s: content type singular label */
			'not_found'          => sprintf( __( 'No %s found', 'porto-functionality' ), $name ),
			/* translators: %s: content type singular label */
			'not_found_in_trash' => sprintf( __( 'No %s found in Trash', 'porto-functionality' ), $name ),
			'parent_item_colon'  => '',
		);

		$args = array(
			'labels'               => $labels,
			'public'               => true,
			'rewrite'              => false,
			'menu_icon'            => 'dashicons-admin-page',
			'show_ui'              => true,
			'show_in_menu'         => false,
			'show_in_nav_menus'    => false,
			'exclude_from_search'  => true,
			'capability_type'      => 'post',
			'hierarchical'         => false,
			'show_in_rest'         => true,
			'supports'             => array(
				'title',
				'thumbnail',
				'author',
				'editor',
			),
			'register_meta_box_cb' => array( $this, 'add_meta_boxes' ),
		);
		if ( defined( 'ELEMENTOR_VERSION' ) ) {
			$args['supports'][] = 'elementor';
		}

		register_post_type( self::BUILDER_SLUG, $args );

		$args = array(
			'hierarchical'      => false,
			'show_ui'           => false,
			'show_in_nav_menus' => false,
			'show_admin_column' => true,
			'query_var'         => is_admin(),
			'rewrite'           => false,
			'public'            => false,
			'label'             => __( 'Type', 'porto-functionality' ),
			'show_in_rest'      => true,
		);
		register_taxonomy( self::BUILDER_TAXONOMY_SLUG, self::BUILDER_SLUG, $args );
	}

	public function add_builder_menu() {
		// global $porto_settings;
		// Gutenberg Full Site Editing
		// if ( defined( 'ELEMENTOR_VERSION' ) || defined( 'WPB_VC_VERSION' ) || empty( $porto_settings['enable-gfse'] ) ) {
		add_submenu_page( 'porto', __( 'Templates Builder', 'porto-functionality' ), __( 'Templates Builder', 'porto-functionality' ), 'administrator', 'edit.php?post_type=' . PortoBuilders::BUILDER_SLUG );

		add_submenu_page( 'porto', __( 'Header Builder', 'porto-functionality' ), __( 'Header Builder', 'porto-functionality' ), 'administrator', 'edit.php?post_type=' . PortoBuilders::BUILDER_SLUG . '&porto_builder_type=header' );
		add_submenu_page( 'porto', __( 'Footer Builder', 'porto-functionality' ), __( 'Footer Builder', 'porto-functionality' ), 'administrator', 'edit.php?post_type=' . PortoBuilders::BUILDER_SLUG . '&porto_builder_type=footer' );
		add_submenu_page( 'porto', __( 'Popup Builder', 'porto-functionality' ), __( 'Popup Builder', 'porto-functionality' ), 'administrator', 'edit.php?post_type=' . PortoBuilders::BUILDER_SLUG . '&porto_builder_type=popup' );
		add_submenu_page( 'porto', __( 'Block Builder', 'porto-functionality' ), __( 'Block Builder', 'porto-functionality' ), 'administrator', 'edit.php?post_type=' . PortoBuilders::BUILDER_SLUG . '&porto_builder_type=block' );
		// }
	}

	public function add_meta_boxes() {
		if ( ! function_exists( 'get_current_screen' ) ) {
			return;
		}
		$screen = get_current_screen();
		if ( function_exists( 'add_meta_box' ) && $screen && 'post' == $screen->base && self::BUILDER_SLUG == $screen->id ) {
			add_meta_box(
				self::BUILDER_SLUG . '-meta-box',
				__( 'Layout Options', 'porto-functionality' ),
				'porto_block_meta_box',
				self::BUILDER_SLUG,
				'normal',
				'high'
			);
		}
	}

	public function admin_print_tabs( $views ) {
		if ( ! current_user_can( self::BUILDER_CAP ) ) {
			return;
		}

		$active_class = ' nav-tab-active';
		$current_type = '';

		if ( ! empty( $_REQUEST[ self::BUILDER_TAXONOMY_SLUG ] ) ) {
			$current_type = $_REQUEST[ self::BUILDER_TAXONOMY_SLUG ];
			$active_class = '';
		}

		$baseurl = add_query_arg( 'post_type', self::BUILDER_SLUG, admin_url( 'edit.php' ) );
		?>
		<div id="porto-builders-tabs" class="nav-tab-wrapper">
			<a class="nav-tab<?php echo esc_attr( $active_class ); ?>" href="<?php echo esc_url( $baseurl ); ?>"><?php esc_html_e( 'All', 'porto-functionality' ); ?></a>

		<?php
		foreach ( $this->builder_types as $type => $label ) :
			$active_class = '';
			if ( $current_type === $type ) {
				$active_class = ' nav-tab-active';
			}
			$builder_url = add_query_arg( self::BUILDER_TAXONOMY_SLUG, $type, $baseurl );
			echo '<a class="nav-tab' . $active_class . '" href="' . esc_url( $builder_url ) . '">' . esc_html( $label ) . '</a>';
		endforeach;
		?>
		</div>
		<?php
		return $views;
	}

	/**
	 * Add additional column to templates list table header
	 * 
	 * @since 3.1.0 - Remove author column from table header
	 * 
	 * @access public
	 */
	public function admin_column_header( $defaults ) {
		// Remove Author Field.
		unset( $defaults['author'] );

		$defaults['condition']      = __( 'Applied Conditions', 'porto-functionality' );
		$defaults['edit_condition'] = __( 'Edit Conditions', 'porto-functionality' );
		$defaults['shortcode']      = __( 'Shortcode', 'porto-functionality' );
		return $defaults;
	}

	/**
	 * Print Condition Status
	 * 
	 * @since 3.1.0 - Pring Display Condition Status on Templates List Table Column
	 * 
	 * @access public
	 * @static print_condition_status
	 */
	public static function print_condition_status( $conditions ) {
		if ( ! empty( $conditions ) ) {
			$names       = array(
				'archive/date'   => __( 'Date Archive', 'porto-functionaltiy' ),
				'archive/author' => __( 'Author Archive', 'porto-functionaltiy' ),
				'archive/search' => __( 'Search Results', 'porto-functionaltiy' ),
				'single/page'    => __( 'Pages', 'porto-functionaltiy' ),
				'single/404'     => __( '404 Page', 'porto-functionaltiy' ),
			);
			$_post_types = get_post_types( array( 'show_in_nav_menus' => true ), 'objects' );
			$post_types  = array();
			foreach ( $_post_types as $post_type => $object ) {
				$post_types[ $post_type ] = $object->labels->singular_name;
			}
			$post_types = apply_filters( 'porto_builder_post_types', $post_types );

			foreach ( $conditions as $index => $condition ) {
				if ( $index ) {
					echo '<br>';
				}

				echo '<span class="porto-template-condition-item">';

				if ( isset( $condition[0] ) && empty( $condition[0] ) ) {
					esc_html_e( 'All', 'porto-functionaltiy' );
					echo '</span>';
					continue;
				} /* elseif ( ! empty( $condition[0] ) ) {
					if ( 'single' == $condition[0] ) {
						esc_html_e( 'Single', 'porto-functionaltiy' );
					} else {
						esc_html_e( 'Archive', 'porto-functionaltiy' );
					}
				} */

				if ( ! empty( $condition[1] ) ) {

					if ( isset( $names[ $condition[1] ] ) ) {
						echo esc_html( $names[ $condition[1] ] );
					} elseif ( 0 === strpos( $condition[1], 'archive/' ) ) {
						$post_type = str_replace( 'archive/', '', $condition[1] );

						if ( 0 === strpos( $post_type, 'all' ) ) {
							$post_type = str_replace( 'all', '', $post_type );

							if ( isset( $post_types[ $post_type ] ) ) {
								printf( esc_html__( 'All %s Archives', 'porto-functionaltiy' ), esc_html( $post_types[ $post_type ] ) );
							}
						} else {
							if ( isset( $post_types[ $post_type ] ) ) {
								if ( 'product' == $post_type ) {
									esc_html_e( 'Shop Page', 'porto-functionaltiy' );
								} else if ( 'post' == $post_type ) {
									esc_html_e( 'Blog Page', 'porto-functionaltiy' );
								} else {
									printf( esc_html__( '%s Page', 'porto-functionaltiy' ), esc_html( $post_types[ $post_type ] ) );
								}
							}
						}
					} elseif ( 0 === strpos( $condition[1], 'single/' ) ) {
						$post_type = str_replace( 'single/', '', $condition[1] );

						if ( isset( $post_types[ $post_type ] ) ) {
							
							if ( empty( $condition[2] ) ) {
								printf( esc_html__( 'All %s pages', 'porto-functionaltiy' ), esc_html( $post_types[ $post_type ] ) );
							} else {
								$post_title = get_the_title( $condition[2] );

								printf( esc_html__( '%s page - "%s"', 'porto-functionaltiy' ), esc_html( $post_types[ $post_type ] ), $post_title );
							}
						}
					} elseif ( 0 === strpos( $condition[1], 'taxonomy/' ) ) {
						$tax_name = str_replace( 'taxonomy/', '', $condition[1] );
						$tax      = get_taxonomy( $tax_name );
						if ( $tax && ! empty( $tax->object_type ) && isset( $tax->label ) ) {
							if ( isset( $condition[0] ) && 'single' === $condition[0] ) {
								if ( ! empty( $condition[2] ) && ! empty( $condition[3] ) ) {
									printf( esc_html__( 'All %1$s pages of "%2$s"', 'porto-functionaltiy' ), ucfirst( $tax->object_type[0] ), esc_html( $condition[3] ) );
								} else {
									printf( esc_html__( 'All %1$s pages which have any %2$s', 'porto-functionaltiy' ), ucfirst( $tax->object_type[0] ), $tax->labels->singular_name );
								}
							} elseif ( isset( $condition[0] ) && 'archive' === $condition[0] ) {
								if ( ! empty( $condition[2] ) && ! empty( $condition[3] ) ) {
									printf( esc_html__( '%1$s - "%2$s"', 'porto-functionaltiy' ), esc_html( $tax->label ), esc_html( $condition[3] ) );
								} else {
									printf( esc_html__( 'All %s', 'porto-functionaltiy' ), esc_html( $tax->label ) );
								}
							}
						}
					}
				}

				/* if ( ! empty( $condition[2] ) && ! empty( $condition[3] ) ) {
					echo ' -> ';
					echo $condition[3];
				} */

				echo '</span>';
			}
		}
	}

	/**
	 * Template Builder Admin Page Table
	 * 
	 * @since 3.1.0 - Added - display condition edits in templates list page.
	 * 
	 * @access public
	 */
	public function admin_column_content( $column_name, $post_id ) {
		if ( 'condition' === $column_name ) {
			$conditions = get_post_meta( $post_id, '_porto_builder_conditions', true );

			PortoBuilders::print_condition_status( $conditions );
		} elseif ( 'edit_condition' == $column_name ) {

			$builder_type = get_post_meta( $post_id, self::BUILDER_TAXONOMY_SLUG, true );
			
			if ( 'type' != $builder_type && 'block' != $builder_type ) {
				printf( '<a href="#" data-post-id="%2$s" class="button button-primary button-large porto-template-edit-condition" title="%1$s"><i class="fas fa-network-wired" style="%3$s"></i><span class="text">%1$s</span></a><span class="spinner"></span>', esc_html__( 'Edit Display Conditions', 'porto-functionality' ), esc_attr( $post_id ), esc_attr( is_rtl() ? "margin-left: 5px;" : "margin-right: 5px;" ) );
			}

			if ( 'block' == $builder_type ) {
				printf( '<a href="%1$s" class="button button-primary button-large porto-go-page-layout" title="%2$s" target="_blank"><i class="fas fa-window-restore" style="%3$s"></i><span class="text">%2$s</span></a>', esc_url( admin_url( 'admin.php?page=porto-page-layouts' ) ), esc_html__( 'Go to Page Layout Builder', 'porto-functionality' ), esc_attr( is_rtl() ? "margin-left: 5px;" : "margin-right: 5px;" ) );
			}

		} elseif ( 'shortcode' === $column_name ) {
			$shortcode = sprintf( '[porto_block id="%d"]', $post_id );
			printf( '<input class="porto-input-shortcode" type="text" readonly="readonly" onfocus="this.select()" value="%s" />', esc_attr( $shortcode ) );
		}
	}

	public function add_builder_post() {
		if ( current_user_can( self::BUILDER_CAP ) && ! empty( $_POST['builder_type'] ) && ! empty( $_POST['builder_name'] ) ) {
			check_admin_referer( 'porto-builder' );
			$builder_type = sanitize_text_field( $_POST['builder_type'] );
			$builder_name = sanitize_text_field( $_POST['builder_name'] );

			$post_meta = apply_filters( 'porto_create_new_builder_meta', array() );

			$post_data = array(
				'post_title' => $builder_name,
				'post_type'  => self::BUILDER_SLUG,
				'meta_input' => $post_meta,
			);
			$post_id   = wp_insert_post( $post_data );
			if ( $post_id && ! is_wp_error( $post_id ) ) {
				add_post_meta( $post_id, self::BUILDER_TAXONOMY_SLUG, $builder_type );
				/* Side Header Type Width */
				if ( ! empty( $_POST['header_type'] ) ) {
					add_post_meta( $post_id, 'header_type', $_POST['header_type'] );
					if ( 'side' ==  $_POST['header_type'] ) {
						if ( ! empty( $_POST['header_side_width'] ) ) {
							add_post_meta( $post_id, 'header_side_width', $_POST['header_side_width'] );
						}
						add_post_meta( $post_id, 'header_side_pos', $_POST['header_side_pos'] );
					}
				}

				wp_set_post_terms( $post_id, $builder_type, self::BUILDER_TAXONOMY_SLUG );

				$arg = array(
					'post'   => $post_id,
					'action' => 'edit',
				);
				if ( 'type' !== $builder_type ) {
					if ( defined( 'ELEMENTOR_VERSION' ) ) {
						$arg['action'] = 'elementor';
					} elseif ( defined( 'WPB_VC_VERSION' ) ) {
						$arg['classic-editor'] = '';
					}
				}
				wp_redirect(
					add_query_arg(
						$arg,
						esc_url( admin_url( 'post.php' ) )
					)
				);
				exit;
			}
		}
	}

	public static function check_load_wpb_elements( $type ) {
		if ( ! defined( 'WPB_VC_VERSION' ) ) {
			return false;
		}
		global $porto_is_compile_infobox;
		if ( empty( $porto_is_compile_infobox ) ) {
			return true;
		}

		if ( 'post-new.php' == $GLOBALS['pagenow'] && isset( $_GET['post_type'] ) && PortoBuilders::BUILDER_SLUG == $_GET['post_type'] ) {
			return true;
		} elseif ( 'post.php' == $GLOBALS['pagenow'] && ( isset( $_GET['post'] ) || ! empty( $_REQUEST['post_ID'] ) ) ) {
			if ( isset( $_GET['post'] ) ) {
				$post = get_post( intval( $_GET['post'] ) );
				if ( ! $post ) {
					return false;
				}
				$post_type = $post->post_type;
			} else {
				$post_type = $_REQUEST['post_type'];
			}
			$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : (int) $_REQUEST['post_ID'];

			if ( PortoBuilders::BUILDER_SLUG == $post_type && $type == get_post_meta( $post_id, PortoBuilders::BUILDER_TAXONOMY_SLUG, true ) ) {
				return true;
			}
		} elseif ( function_exists( 'porto_is_ajax' ) && porto_is_ajax() && isset( $_REQUEST['post_id'] ) ) {
			$post = get_post( intval( $_REQUEST['post_id'] ) );
			if ( is_object( $post ) && ( PortoBuilders::BUILDER_SLUG == $post->post_type || $type == $post->post_type ) ) {
				return true;
			}
		} elseif ( wp_doing_ajax() && isset( $_REQUEST['action'] ) && 0 === strpos( $_REQUEST['action'], 'porto_import_dummy' ) ) { // in demo import
			return true;
		} elseif ( function_exists( 'vc_is_inline' ) && vc_is_inline() ) {
			if ( is_admin() && isset( $_GET['post_type'] ) && PortoBuilders::BUILDER_SLUG == $_GET['post_type'] && isset( $_GET['post_id'] ) ) {
				$terms = wp_get_post_terms( (int) $_GET['post_id'], PortoBuilders::BUILDER_TAXONOMY_SLUG, array( 'fields' => 'names' ) );
				if ( ! empty( $terms ) && $type == $terms[0] ) {
					return true;
				}
			} elseif ( ! is_admin() ) {
				$post_id = (int) vc_get_param( 'vc_post_id' );
				if ( $post_id ) {
					$post  = get_post( $post_id );
					$terms = wp_get_post_terms( $post_id, PortoBuilders::BUILDER_TAXONOMY_SLUG, array( 'fields' => 'names' ) );
					if ( is_object( $post ) && PortoBuilders::BUILDER_SLUG == $post->post_type && ! empty( $terms ) && $type == $terms[0] ) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * save_custom_panel_options
	 *
	 * saves custom panel options on ajax save event
	 * - edit area size
	 *
	 * @since 6.1.0
	 */
	public function save_custom_panel_options( $post_id ) {
		if ( isset( $post_id ) && is_numeric( $post_id ) ) { // post save
			// save edit area size
			if ( isset( $_POST['porto_edit_area_width'] ) ) {
				update_post_meta( $post_id, 'porto_edit_area_width', esc_attr( $_POST['porto_edit_area_width'] ) );
			}
		} else { // ajax save
			$post_id = intval( vc_post_param( 'post_id' ) );
			vc_user_access()->checkAdminNonce()->validateDie()->wpAny( 'edit_posts', 'edit_pages' )->validateDie()->canEdit( $post_id )->validateDie();
			// save edit area size
			$edit_area_width = vc_post_param( 'porto_edit_area_width' );
			if ( $post_id > 0 && isset( $edit_area_width ) ) {
				update_post_meta( $post_id, 'porto_edit_area_width', esc_attr( $edit_area_width ) );
			}
		}
	}

	/**
	 * Reset condition after template builder is trashed
	 * 
	 * @since 3.1.0
	*/
	public function template_builder_trash( $post_id, $previous_status = '' ) {
		if ( 'porto_builder' == get_post_type( $post_id ) && ! empty( get_post_meta( $post_id, '_porto_builder_conditions', true ) ) ) {
			$builder_type = get_post_meta( $post_id, self::BUILDER_TAXONOMY_SLUG, true );
			
			if ( false !== strpos( $builder_type, 'block' ) ) {
				delete_post_meta( $post_id, '_porto_block_pos' );
			}
			delete_post_meta( $post_id, '_porto_builder_conditions' );
			$admin_tools = new Porto_Admin_Tools();
			$admin_tools->reset_conditions();
		}
	}
}

new PortoBuilders;
