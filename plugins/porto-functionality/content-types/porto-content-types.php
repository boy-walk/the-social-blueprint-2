<?php

// don't load directly
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

class PortoContentTypesClass {

	function __construct() {

		// Load Functions
		include_once( PORTO_CONTENT_TYPES_LIB . 'general.php' );

		// Add Custom Post Type
		add_filter( 'available_posts_grid_post_types', array( $this, 'add_addon_post_types' ) );

		// Register content types
		add_action( 'init', array( $this, 'addFaqContentType' ) );
		add_action( 'init', array( $this, 'addMemberContentType' ) );
		add_action( 'init', array( $this, 'addPortfolioContentType' ) );
		add_action( 'init', array( $this, 'addEventContentType' ) );

		add_action(
			'admin_init',
			function() {
				if ( current_user_can( 'manage_options' ) && get_transient( 'porto_flush_rewrite_rules', false ) ) {
					flush_rewrite_rules();
					delete_transient( 'porto_flush_rewrite_rules' );
				}
			},
			99
		);

		register_activation_hook(
			PORTO_FUNC_FILE,
			function() {
				$this->addFaqContentType();
				$this->addMemberContentType();
				$this->addPortfolioContentType();
				$this->addEventContentType();
				flush_rewrite_rules();

				/**
				 * create meta tables to fix table not exising issue in get_metadata
				 *
				 * @since 3.1.6
				 */
				if ( ! function_exists( 'porto_create_tax_meta_table' ) ) {
					require_once( PORTO_META_BOXES_PATH . 'meta_boxes.php' );
				}
				$taxes = array( 'category', 'product_cat', 'portfolio_cat', 'member_cat' );
				foreach ( $taxes as $tax ) {
					update_option( 'porto_created_table_' . $tax, false );
					porto_create_tax_meta_table( $tax );
				}
			}
		);
	}

	// Register portfolio content type
	function addPortfolioContentType() {
		global $porto_settings;

		$enable_content_type = ( isset( $porto_settings ) && isset( $porto_settings['enable-portfolio'] ) ) ? $porto_settings['enable-portfolio'] : true;
		if ( ! $enable_content_type ) {
			return;
		}

		$slug_name       = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-slug-name'] ) && $porto_settings['portfolio-slug-name'] ) ? esc_attr( $porto_settings['portfolio-slug-name'] ) : 'portfolio';
		$name            = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-name'] ) && $porto_settings['portfolio-name'] ) ? $porto_settings['portfolio-name'] : __( 'Portfolios', 'porto-functionality' );
		$singular_name   = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-singular-name'] ) && $porto_settings['portfolio-singular-name'] ) ? $porto_settings['portfolio-singular-name'] : __( 'Portfolio', 'porto-functionality' );
		$cat_name        = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-singular-name'] ) && $porto_settings['portfolio-singular-name'] ) ? $porto_settings['portfolio-singular-name'] . ' ' . __( 'Category', 'porto-functionality' ) : __( 'Portfolio Category', 'porto-functionality' );
		$cats_name       = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-singular-name'] ) && $porto_settings['portfolio-singular-name'] ) ? $porto_settings['portfolio-singular-name'] . ' ' . __( 'Categories', 'porto-functionality' ) : __( 'Portfolio Categories', 'porto-functionality' );
		$skill_name      = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-singular-name'] ) && $porto_settings['portfolio-singular-name'] ) ? $porto_settings['portfolio-singular-name'] . ' ' . __( 'Skill', 'porto-functionality' ) : __( 'Portfolio Skill', 'porto-functionality' );
		$skills_name     = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-singular-name'] ) && $porto_settings['portfolio-singular-name'] ) ? $porto_settings['portfolio-singular-name'] . ' ' . __( 'Skills', 'porto-functionality' ) : __( 'Portfolio Skills', 'porto-functionality' );
		$cat_slug_name   = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-cat-slug-name'] ) && $porto_settings['portfolio-cat-slug-name'] ) ? esc_attr( $porto_settings['portfolio-cat-slug-name'] ) : 'portfolio_cat';
		$skill_slug_name = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-skill-slug-name'] ) && $porto_settings['portfolio-skill-slug-name'] ) ? esc_attr( $porto_settings['portfolio-skill-slug-name'] ) : 'portfolio_skill';
		$archive_page_id = ( isset( $porto_settings ) && isset( $porto_settings['portfolio-archive-page'] ) && $porto_settings['portfolio-archive-page'] ) ? esc_attr( $porto_settings['portfolio-archive-page'] ) : 0;
		$has_archive     = true;
		if ( $archive_page_id && get_post( $archive_page_id ) ) {
			$has_archive = get_page_uri( $archive_page_id );
		}

		register_post_type(
			'portfolio',
			array(
				'labels'              => $this->getLabels( $singular_name, $name ),
				'exclude_from_search' => false,
				'has_archive'         => $has_archive,
				'public'              => true,
				'rewrite'             => array( 'slug' => $slug_name ),
				'can_export'          => true,
				'show_in_nav_menus'   => true,
				'supports'            => array( 'title', 'editor', 'thumbnail', 'comments', 'excerpt', 'revisions', 'custom-fields' ),
				'show_in_rest'        => true,
			)
		);

		register_taxonomy(
			'portfolio_cat',
			'portfolio',
			array(
				'hierarchical'      => true,
				'show_in_nav_menus' => true,
				'labels'            => $this->getTaxonomyLabels( $cat_name, $cats_name ),
				'query_var'         => true,
				'rewrite'           => array( 'slug' => $cat_slug_name ),
				'show_in_rest'      => true,
			)
		);

		register_taxonomy(
			'portfolio_skills',
			'portfolio',
			array(
				'hierarchical'      => false,
				'show_in_nav_menus' => true,
				'labels'            => $this->getTaxonomyLabels( $skill_name, $skills_name ),
				'query_var'         => true,
				'rewrite'           => array( 'slug' => $skill_slug_name ),
				'show_in_rest'      => true,
			)
		);

		include_once( PORTO_CONTENT_TYPES_LIB . 'portfolio.php' );
	}

	// Register faq content type
	function addFaqContentType() {
		global $porto_settings;

		$enable_content_type = ( isset( $porto_settings ) && isset( $porto_settings['enable-faq'] ) ) ? $porto_settings['enable-faq'] : true;
		if ( ! $enable_content_type ) {
			return;
		}

		$slug_name       = ( isset( $porto_settings ) && isset( $porto_settings['faq-slug-name'] ) && $porto_settings['faq-slug-name'] ) ? esc_attr( $porto_settings['faq-slug-name'] ) : 'faq';
		$name            = ( isset( $porto_settings ) && isset( $porto_settings['faq-name'] ) && $porto_settings['faq-name'] ) ? $porto_settings['faq-name'] : __( 'FAQs', 'porto-functionality' );
		$singular_name   = ( isset( $porto_settings ) && isset( $porto_settings['faq-singular-name'] ) && $porto_settings['faq-singular-name'] ) ? $porto_settings['faq-singular-name'] : __( 'FAQ', 'porto-functionality' );
		$cat_name        = ( isset( $porto_settings ) && isset( $porto_settings['faq-singular-name'] ) && $porto_settings['faq-singular-name'] ) ? $porto_settings['faq-singular-name'] . ' ' . __( 'Category', 'porto-functionality' ) : __( 'FAQ Category', 'porto-functionality' );
		$cats_name       = ( isset( $porto_settings ) && isset( $porto_settings['faq-singular-name'] ) && $porto_settings['faq-singular-name'] ) ? $porto_settings['faq-singular-name'] . ' ' . __( 'Categories', 'porto-functionality' ) : __( 'FAQ Categories', 'porto-functionality' );
		$cat_slug_name   = ( isset( $porto_settings ) && isset( $porto_settings['faq-cat-slug-name'] ) && $porto_settings['faq-cat-slug-name'] ) ? esc_attr( $porto_settings['faq-cat-slug-name'] ) : 'faq_cat';
		$archive_page_id = ( isset( $porto_settings ) && isset( $porto_settings['faq-archive-page'] ) && $porto_settings['faq-archive-page'] ) ? esc_attr( $porto_settings['faq-archive-page'] ) : 0;
		$has_archive     = true;
		if ( $archive_page_id && get_post( $archive_page_id ) ) {
			$has_archive = get_page_uri( $archive_page_id );
		}

		register_post_type(
			'faq',
			array(
				'labels'              => $this->getLabels( $singular_name, $name ),
				'exclude_from_search' => false,
				'has_archive'         => $has_archive,
				'public'              => true,
				'rewrite'             => array( 'slug' => $slug_name ),
				'supports'            => array( 'title', 'editor' ),
				'can_export'          => true,
				'show_in_nav_menus'   => true,
				'show_in_rest'        => true,
			)
		);

		register_taxonomy(
			'faq_cat',
			'faq',
			array(
				'hierarchical'      => true,
				'show_in_nav_menus' => true,
				'labels'            => $this->getTaxonomyLabels( $cat_name, $cats_name ),
				'query_var'         => true,
				'rewrite'           => array( 'slug' => $cat_slug_name ),
				'show_in_rest'      => true,
			)
		);

		include_once( PORTO_CONTENT_TYPES_LIB . 'faq.php' );
	}

	/**
	 * Register Custom Post Types
	 *
	 * @since 2.3.0
	 * @access public
	 */
	function add_addon_post_types( $available_post_types ) {
		$_post_types = get_post_types(
			array(
				'public'            => true,
				'show_in_nav_menus' => true,
			),
			'objects',
			'and'
		);

		$disabled_post_types = array( 'attachment', 'porto_builder', 'page', 'e-landing-page', 'product' );
		foreach ( $disabled_post_types as $disabled ) {
			unset( $_post_types[ $disabled ] );
		}

		$post_types = array();
		foreach ( $_post_types as $key => $p_type ) {
			$post_types[ $key ] = esc_html( $p_type->label );
		}
		$post_types = apply_filters( 'porto_posts_grid_post_types', $post_types );

		foreach ( $post_types as $key => $value ) {
			if ( ! in_array( $key, $available_post_types ) ) {
				$available_post_types[] = $key;
			}
		}
		return $available_post_types;
	}

	// Register member content type
	function addMemberContentType() {
		global $porto_settings;

		$enable_content_type = ( isset( $porto_settings ) && isset( $porto_settings['enable-member'] ) ) ? $porto_settings['enable-member'] : true;
		if ( ! $enable_content_type ) {
			return;
		}

		$slug_name       = ( isset( $porto_settings ) && isset( $porto_settings['member-slug-name'] ) && $porto_settings['member-slug-name'] ) ? esc_attr( $porto_settings['member-slug-name'] ) : 'member';
		$name            = ( isset( $porto_settings ) && isset( $porto_settings['member-name'] ) && $porto_settings['member-name'] ) ? $porto_settings['member-name'] : __( 'Members', 'porto-functionality' );
		$singular_name   = ( isset( $porto_settings ) && isset( $porto_settings['member-singular-name'] ) && $porto_settings['member-singular-name'] ) ? $porto_settings['member-singular-name'] : __( 'Member', 'porto-functionality' );
		$cat_name        = ( isset( $porto_settings ) && isset( $porto_settings['member-singular-name'] ) && $porto_settings['member-singular-name'] ) ? $porto_settings['member-singular-name'] . ' ' . __( 'Category', 'porto-functionality' ) : __( 'Member Category', 'porto-functionality' );
		$cats_name       = ( isset( $porto_settings ) && isset( $porto_settings['member-singular-name'] ) && $porto_settings['member-singular-name'] ) ? $porto_settings['member-singular-name'] . ' ' . __( 'Categories', 'porto-functionality' ) : __( 'Member Categories', 'porto-functionality' );
		$cat_slug_name   = ( isset( $porto_settings ) && isset( $porto_settings['member-cat-slug-name'] ) && $porto_settings['member-cat-slug-name'] ) ? esc_attr( $porto_settings['member-cat-slug-name'] ) : 'member_cat';
		$archive_page_id = ( isset( $porto_settings ) && isset( $porto_settings['member-archive-page'] ) && $porto_settings['member-archive-page'] ) ? esc_attr( $porto_settings['member-archive-page'] ) : 0;
		$has_archive     = true;
		if ( $archive_page_id && get_post( $archive_page_id ) ) {
			$has_archive = get_page_uri( $archive_page_id );
		}

		register_post_type(
			'member',
			array(
				'labels'              => $this->getLabels( $singular_name, $name ),
				'exclude_from_search' => false,
				'has_archive'         => $has_archive,
				'public'              => true,
				'rewrite'             => array( 'slug' => $slug_name ),
				'supports'            => array( 'title', 'editor', 'thumbnail', 'comments', 'page-attributes' ),
				'can_export'          => true,
				'show_in_nav_menus'   => true,
				'show_in_rest'        => true,
			)
		);

		register_taxonomy(
			'member_cat',
			'member',
			array(
				'hierarchical'      => true,
				'show_in_nav_menus' => true,
				'labels'            => $this->getTaxonomyLabels( $cat_name, $cats_name ),
				'query_var'         => true,
				'rewrite'           => array( 'slug' => $cat_slug_name ),
				'show_in_rest'      => true,
			)
		);

		include_once( PORTO_CONTENT_TYPES_LIB . 'member.php' );
	}

	// Register event content type
	function addEventContentType() {
		global $porto_settings;

		$enable_content_type = ( isset( $porto_settings ) && isset( $porto_settings['enable-event'] ) ) ? $porto_settings['enable-event'] : true;
		if ( ! $enable_content_type ) {
			return;
		}

		$slug_name       = ( isset( $porto_settings ) && isset( $porto_settings['event-slug-name'] ) && $porto_settings['event-slug-name'] ) ? esc_attr( $porto_settings['event-slug-name'] ) : 'event';
		$name            = ( isset( $porto_settings ) && isset( $porto_settings['event-name'] ) && $porto_settings['event-name'] ) ? $porto_settings['event-name'] : __( 'Events', 'porto-functionality' );
		$singular_name   = ( isset( $porto_settings ) && isset( $porto_settings['event-singular-name'] ) && $porto_settings['event-singular-name'] ) ? $porto_settings['event-singular-name'] : __( 'Event', 'porto-functionality' );
		$cat_name        = ( isset( $porto_settings ) && isset( $porto_settings['event-singular-name'] ) && $porto_settings['event-singular-name'] ) ? $porto_settings['event-singular-name'] . ' ' . __( 'Category', 'porto-functionality' ) : __( 'Event Category', 'porto-functionality' );
		$cats_name       = ( isset( $porto_settings ) && isset( $porto_settings['event-singular-name'] ) && $porto_settings['event-singular-name'] ) ? $porto_settings['event-singular-name'] . ' ' . __( 'Categories', 'porto-functionality' ) : __( 'Event Categories', 'porto-functionality' );
		$skill_name      = ( isset( $porto_settings ) && isset( $porto_settings['event-singular-name'] ) && $porto_settings['event-singular-name'] ) ? $porto_settings['event-singular-name'] . ' ' . __( 'Skill', 'porto-functionality' ) : __( 'Event Skill', 'porto-functionality' );
		$skills_name     = ( isset( $porto_settings ) && isset( $porto_settings['event-singular-name'] ) && $porto_settings['event-singular-name'] ) ? $porto_settings['event-singular-name'] . ' ' . __( 'Skills', 'porto-functionality' ) : __( 'Event Skills', 'porto-functionality' );
		$cat_slug_name   = ( isset( $porto_settings ) && isset( $porto_settings['event-cat-slug-name'] ) && $porto_settings['event-cat-slug-name'] ) ? esc_attr( $porto_settings['event-cat-slug-name'] ) : 'event_cat';
		$skill_slug_name = ( isset( $porto_settings ) && isset( $porto_settings['event-skill-slug-name'] ) && $porto_settings['event-skill-slug-name'] ) ? esc_attr( $porto_settings['event-skill-slug-name'] ) : 'event_skill';
		$archive_page_id = ( isset( $porto_settings ) && isset( $porto_settings['event-archive-page'] ) && $porto_settings['event-archive-page'] ) ? esc_attr( $porto_settings['event-archive-page'] ) : 0;
		$has_archive     = true;
		if ( $archive_page_id && get_post( $archive_page_id ) ) {
			$has_archive = get_page_uri( $archive_page_id );
		}

		register_post_type(
			'event',
			array(
				'labels'              => $this->getLabels( $singular_name, $name ),
				'exclude_from_search' => false,
				'has_archive'         => $has_archive,
				'public'              => true,
				'rewrite'             => array( 'slug' => $slug_name ),
				'supports'            => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
				'can_export'          => true,
				'show_in_nav_menus'   => true,
				'show_in_rest'        => true,
			)
		);
		include_once( PORTO_CONTENT_TYPES_LIB . 'event.php' );
	}


	// Get content type labels
	function getLabels( $singular_name, $name, $title = false ) {
		if ( ! $title ) {
			$title = $name;
		}

		return array(
			'name'               => $title,
			'singular_name'      => $singular_name,
			'add_new'            => __( 'Add New', 'porto-functionality' ),
			/* translators: %s: content type singular name */
			'add_new_item'       => sprintf( __( 'Add New %s', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular name */
			'edit_item'          => sprintf( __( 'Edit %s', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular name */
			'new_item'           => sprintf( __( 'New %s', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular name */
			'view_item'          => sprintf( __( 'View %s', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular label */
			'search_items'       => sprintf( __( 'Search %s', 'porto-functionality' ), $name ),
			/* translators: %s: content type singular label */
			'not_found'          => sprintf( __( 'No %s found', 'porto-functionality' ), $name ),
			/* translators: %s: content type singular label */
			'not_found_in_trash' => sprintf( __( 'No %s found in Trash', 'porto-functionality' ), $name ),
			'parent_item_colon'  => '',
		);
	}

	// Get content type taxonomy labels
	function getTaxonomyLabels( $singular_name, $name ) {
		return array(
			'name'              => $name,
			'singular_name'     => $singular_name,
			/* translators: %s: content type singular label */
			'search_items'      => sprintf( __( 'Search %s', 'porto-functionality' ), $name ),
			/* translators: %s: content type singular label */
			'all_items'         => sprintf( __( 'All %s', 'porto-functionality' ), $name ),
			/* translators: %s: content type singular name */
			'parent_item'       => sprintf( __( 'Parent %s', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular name */
			'parent_item_colon' => sprintf( __( 'Parent %s:', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular name */
			'edit_item'         => sprintf( __( 'Edit %s', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular name */
			'update_item'       => sprintf( __( 'Update %s', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular name */
			'add_new_item'      => sprintf( __( 'Add New %s', 'porto-functionality' ), $singular_name ),
			/* translators: %s: content type singular name */
			'new_item_name'     => sprintf( __( 'New %s Name', 'porto-functionality' ), $singular_name ),
			'menu_name'         => $name,
		);
	}
}

// Finally initialize code
new PortoContentTypesClass();
