(function($) {
	"use strict";

	var PluginScrollProgress = function( $el ) {
		if ( $el.length && ! $el.hasClass( 'porto-free-shipping-bar' ) ) {
			this.$el = $el;
			this.entireHeight = document.body.clientHeight - window.innerHeight;
			this.setProgress = this.setProgress.bind( this );
			this.isUnderHeader = $el.hasClass( 'fixed-under-header' );
			this.$header = $( '#header' );
			this.scrollType = $el.hasClass( 'porto-scroll-progress-circle' ) ? 'circle' : '';
			if ( 'circle' == this.scrollType ) {
				this.$indicator = $el.find( '#progress-indicator' );
			}
			if ( $el.hasClass( 'fixed-top' ) && '0px' == $el.css( 'margin-top' ) ) {
				$( 'html' ).css( 'padding-top', $el.height() );
			}
			return this.initialize();
		}
	};

	PluginScrollProgress.prototype = {
		initialize: function() {
			var self = this;

			if ( self.isUnderHeader ) {
				self.$el.css( 'top', theme.StickyHeader.sticky_height + theme.adminBarHeight() + theme.sticky_nav_height );
			}

			window.addEventListener( 'scroll', self.setProgress, { passive: true } );

			$( window ).smartresize( function() {
				self.entireHeight = document.body.clientHeight - window.innerHeight;

				if ( self.isUnderHeader ) {
					self.$el.css( 'top', theme.StickyHeader.sticky_height + theme.adminBarHeight() + theme.sticky_nav_height );
				}
			} );

			if ( 'circle' == self.scrollType ) {
				self.$el.on( 'click', function( e ) {
					e.preventDefault();
					theme.scrolltoContainer( $( document.body ) );
				} );
			}

			self.setProgress();
		},

		setProgress: function() {
			var scrollTop = $( window ).scrollTop(),
				percent = Math.ceil( scrollTop / this.entireHeight * 100 );
			if ( percent > 100 ) {
				percent = 100;
			}
			if ( 'circle' == this.scrollType ) {
				if ( window.pageYOffset > 100 ) {
					this.$el.addClass( 'show' );
				} else {
					this.$el.removeClass( 'show' );
				}
				percent *= 2.14;
				if ( this.$indicator.length ) {
					this.$indicator.css( 'stroke-dasharray', percent + ', 400' );
				}
			} else {
				if ( this.isUnderHeader ) {
					var display = '';
					if ( this.$header.hasClass( 'sticky-header' ) ) {
						if ( percent > 0 ) {
							display = 'block';
						} else {
							display = 'none';
						}
					} else {
						display = 'none';
					}
					this.$el.css( 'display', display );
				}
				this.$el.attr( 'value', percent );
			}

			// For scroll-up header type
			if ( $( '.page-wrapper' ).hasClass( 'sticky-scroll-up' ) && ! $( 'html' ).hasClass( 'porto-search-opened' ) && this.$el.hasClass( 'fixed-under-header' ) ) {
				var prevScrollPos = this.$el.data('prev-pos') ? this.$el.data('prev-pos') : 0;
				if ( scrollTop >= prevScrollPos ) {
					this.$el.addClass( 'scroll-down' );
				} else {
					this.$el.removeClass( 'scroll-down' );
				}

				// Header is scroll-up Sticky Type
				if ( 'undefined' == typeof ( theme.StickyHeader.sticky_height ) ) {
					this.$el.data( 'prev-pos', 0 );
				} else {
					this.$el.data( 'prev-pos', scrollTop );
				}
			}
		}
	};

	$( window ).on( 'load', function() {
		$( '.porto-scroll-progress' ).each( function() {
			new PluginScrollProgress( $( this ) );
		} );
	} );

	$( document.body ).on( 'porto_init_scroll_progress', function( e, $obj ) {
		new PluginScrollProgress( $obj.find( '.porto-scroll-progress' ) );
	} );
}).apply(this, [jQuery]);