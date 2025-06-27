<?php

/**
 * Porto Cache
 * 
 * @author   Porto Themes
 * @category Porto Cache
 * @since    3.2.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! class_exists( 'Porto_Cache' ) ) :
	class Porto_Cache {

		/**
		 * Initialize.
		 */
		public static function init() {
			add_action( 'set_object_terms', array( __CLASS__, 'delete_query_product_transients' ) );
			add_action( 'deleted_term_relationships', array( __CLASS__, 'delete_query_product_transients' ) );
			add_action( 'woocommerce_product_set_stock_status', array( __CLASS__, 'delete_query_product_transients' ) );
			add_action( 'woocommerce_product_set_visibility', array( __CLASS__, 'delete_query_product_transients' ) );
			add_action( 'woocommerce_after_product_ordering', array( __CLASS__, 'delete_query_product_transients' ) );
			add_action( 'woocommerce_delete_product_transients', array( __CLASS__, 'delete_query_product_transients' ) );

			add_action( 'transition_post_status', array( __CLASS__, 'transition_post_status' ), 10, 3 );
		}

		/**
		 * Get transient version.
		 */
		public static function get_transient_version( $group, $refresh = false ) {
			$transient_name  = 'porto-' . $group . '-transient-version';
			$transient_value = get_transient( $transient_name );

			if ( false === $transient_value || $refresh ) {
				$transient_value = (string) time();
				set_transient( $transient_name, $transient_value );
			}

			return $transient_value;
		}

		/**
		 * When post status changed
		 */
		public static function transition_post_status( $new_status, $old_status, $post ) {
			if ( ( 'publish' === $new_status || 'publish' === $old_status ) && in_array( $post->post_type, array( 'product', 'product_variation' ), true ) ) {
				self::delete_query_post_transients();
			} else {
				self::delete_query_post_transients( $post->post_type );
			}
		}

		/**
		 * Delete posts query transients
		 */
		public static function delete_query_product_transients( $object_id = false ) {
			$object_type = 'product';
			if ( $object_id ) {
				$object = get_post( $object_id );
				if ( $object && $object->post_type ) {
					return self::delete_query_post_transients( $object->post_type );
				}
			}
			self::delete_query_post_transients( $object_type );
		}

		/**
		 * Delete posts query transients
		 */
		public static function delete_query_post_transients( $post_type = 'product' ) {
			self::get_transient_version( 'query_' . sanitize_key( $post_type ), true );
		}
	}

	Porto_Cache::init();
endif;
