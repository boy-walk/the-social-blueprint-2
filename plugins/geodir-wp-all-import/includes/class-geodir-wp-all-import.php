<?php
/**
 * The main functionality of the plugin.
 *
 * @package    GeoDir_WP_All_Import
 * @subpackage GeoDir_WP_All_Import/includes
 * @author     GeoDirectory <info@wpgeodirectory.com>
 */

if ( ! class_exists( 'GeoDir_WP_All_Import' ) ) {

	class GeoDir_WP_All_Import {

		private static $instance;

		public static function get_instance() {
			if ( ! isset( self::$instance ) && ! ( self::$instance instanceof GeoDir_WP_All_Import ) ) {
				self::$instance = new GeoDir_WP_All_Import;
				self::$instance->setup_globals();
				self::$instance->define_public_hooks();

				do_action( 'GeoDir_WP_All_Import_loaded' );
			}

			return self::$instance;
		}

		private function __construct() {
			self::$instance = $this;
		}

		private function setup_globals() {
			if ( ! defined( 'GEODIR_WPAI_PLUGIN_DIR' ) ) {
				define( 'GEODIR_WPAI_PLUGIN_DIR', dirname( GEODIR_WPAI_PLUGIN_FILE ) );
			}

			if ( ! defined( 'GEODIR_WPAI_PLUGIN_URL' ) ) {
				define( 'GEODIR_WPAI_PLUGIN_URL', plugin_dir_url( GEODIR_WPAI_PLUGIN_FILE ) );
			}

			if ( ! defined( 'GEODIR_WPAI_PLUGINDIR_PATH' ) ) {
				define( 'GEODIR_WPAI_PLUGINDIR_PATH', plugin_dir_path( GEODIR_WPAI_PLUGIN_FILE ) );
			}
		}

		/**
		 * Register all of the hooks related to the public-facing functionality
		 * of the plugin.
		 *
		 * @since    2.0.0
		 * @access   private
		 */
		private function define_public_hooks() {
			add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
			add_action( 'init', array( $this, 'includes' ) );
			do_action( 'geodir_wpai_setup_actions' );
		}

		/**
		 * Load the text domain.
		 */
		public function load_textdomain() {
			$locale = determine_locale();

			$locale = apply_filters( 'plugin_locale', $locale, 'geodir-wpai' );

			unload_textdomain( 'geodir-wpai', true );
			load_textdomain( 'geodir-wpai', WP_LANG_DIR . '/geodir-wpai/geodir-wpai-' . $locale . '.mo' );
			load_plugin_textdomain( 'geodir-wpai', false, basename( dirname( GEODIR_WPAI_PLUGIN_FILE ) ) . '/languages/' );
		}

		/**
		 * Include the files.
		 */
		public function includes() {
			$page = ! empty( $_REQUEST['page'] ) ? sanitize_text_field( $_REQUEST['page'] ) : '';
			$post_type = ! empty( $_REQUEST['post_type'] ) ? sanitize_text_field( $_REQUEST['post_type'] ) : '';

			// Don't load on CPT CS settings page.
			if ( $page && $page == $post_type . '-settings' ) {
				return;
			}

			require_once( GEODIR_WPAI_PLUGINDIR_PATH . '/libraries/rapid-addon.php' );
			require_once( GEODIR_WPAI_PLUGINDIR_PATH . '/includes/class-geodir-wp-all-import-addon.php' );
		}
	}
}