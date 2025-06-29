!function ( a ) { "use strict"; "function" == typeof define && define.amd ? define( [ "jquery" ], a ) : a( "object" == typeof exports && "function" == typeof require ? require( "jquery" ) : jQuery ) }( function ( a ) { "use strict"; function b( c, d ) { var e = this; e.element = c, e.el = a( c ), e.suggestions = [], e.badQueries = [], e.selectedIndex = -1, e.currentValue = e.element.value, e.timeoutId = null, e.cachedResponse = {}, e.onChangeTimeout = null, e.onChange = null, e.isLocal = !1, e.suggestionsContainer = null, e.noSuggestionsContainer = null, e.options = a.extend( !0, {}, b.defaults, d ), e.classes = { selected: "autocomplete-selected", suggestion: "autocomplete-suggestion" }, e.hint = null, e.hintValue = "", e.selection = null, e.initialize(), e.setOptions( d ) } function c( a, b, c ) { return a.value.toLowerCase().indexOf( c ) !== -1 } function d( b ) { return "string" == typeof b ? JSON.parse( b ) : b } function e( a, b ) { if ( !b ) return a.value; var c = "(" + g.escapeRegExChars( b ) + ")"; return a.value.replace( new RegExp( c, "gi" ), "<strong>$1</strong>" ).replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" ).replace( /"/g, "&quot;" ).replace( /&lt;(\/?strong)&gt;/g, "<$1>" ) } function f( a, b ) { return '<div class="autocomplete-group">' + b + "</div>" } var g = function () { return { escapeRegExChars: function ( a ) { return a.replace( /[|\\{}()[\]^$+*?.]/g, "\\$&" ) }, createNode: function ( a ) { var b = document.createElement( "div" ); return b.className = a, b.style.position = "absolute", b.style.display = "none", b } } }(), h = { ESC: 27, TAB: 9, RETURN: 13, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }, i = a.noop; b.utils = g, a.Autocomplete = b, b.defaults = { ajaxSettings: {}, autoSelectFirst: !1, appendTo: "body", serviceUrl: null, lookup: null, onSelect: null, width: "auto", minChars: 1, maxHeight: 300, deferRequestBy: 0, params: {}, formatResult: e, formatGroup: f, delimiter: null, zIndex: 9999, type: "GET", noCache: !1, onSearchStart: i, onSearchComplete: i, onSearchError: i, preserveInput: !1, containerClass: "autocomplete-suggestions", tabDisabled: !1, dataType: "text", currentRequest: null, triggerSelectOnValidInput: !0, preventBadQueries: !0, lookupFilter: c, paramName: "query", transformResult: d, showNoSuggestionNotice: !1, noSuggestionNotice: "No results", orientation: "bottom", forceFixPosition: !1 }, b.prototype = { initialize: function () { var c, d = this, e = "." + d.classes.suggestion, f = d.classes.selected, g = d.options; d.element.setAttribute( "autocomplete", "off" ), d.noSuggestionsContainer = a( '<div class="autocomplete-no-suggestion"></div>' ).html( this.options.noSuggestionNotice ).get( 0 ), d.suggestionsContainer = b.utils.createNode( g.containerClass ), c = a( d.suggestionsContainer ), c.appendTo( g.appendTo || "body" ), "auto" !== g.width && c.css( "width", g.width ), c.on( "mouseover.autocomplete", e, function () { d.activate( a( this ).data( "index" ) ) } ), c.on( "mouseout.autocomplete", function () { d.selectedIndex = -1, c.children( "." + f ).removeClass( f ) } ), c.on( "click.autocomplete", e, function () { d.select( a( this ).data( "index" ) ) } ), c.on( "click.autocomplete", function () { clearTimeout( d.blurTimeoutId ) } ), d.fixPositionCapture = function () { d.visible && d.fixPosition() }, a( window ).on( "resize.autocomplete", d.fixPositionCapture ), d.el.on( "keydown.autocomplete", function ( a ) { d.onKeyPress( a ) } ), d.el.on( "keyup.autocomplete", function ( a ) { d.onKeyUp( a ) } ), d.el.on( "blur.autocomplete", function () { d.onBlur() } ), d.el.on( "focus.autocomplete", function () { d.onFocus() } ), d.el.on( "change.autocomplete", function ( a ) { d.onKeyUp( a ) } ), d.el.on( "input.autocomplete", function ( a ) { d.onKeyUp( a ) } ) }, onFocus: function () { var a = this; a.fixPosition(), a.el.val().length >= a.options.minChars && a.onValueChange() }, onBlur: function () { var a = this; a.blurTimeoutId = setTimeout( function () { a.hide() }, 200 ) }, abortAjax: function () { var a = this; a.currentRequest && ( a.currentRequest.abort(), a.currentRequest = null ) }, setOptions: function ( b ) { var c = this, d = a.extend( {}, c.options, b ); c.isLocal = Array.isArray( d.lookup ), c.isLocal && ( d.lookup = c.verifySuggestionsFormat( d.lookup ) ), d.orientation = c.validateOrientation( d.orientation, "bottom" ), a( c.suggestionsContainer ).css( { "max-height": d.maxHeight + "px", width: d.width + "px", "z-index": d.zIndex } ), this.options = d }, clearCache: function () { this.cachedResponse = {}, this.badQueries = [] }, clear: function () { this.clearCache(), this.currentValue = "", this.suggestions = [] }, disable: function () { var a = this; a.disabled = !0, clearTimeout( a.onChangeTimeout ), a.abortAjax() }, enable: function () { this.disabled = !1 }, fixPosition: function () { var b = this, c = a( b.suggestionsContainer ), d = c.parent().get( 0 ); if ( d === document.body || b.options.forceFixPosition ) { var e = b.options.orientation, f = c.outerHeight(), g = b.el.outerHeight(), h = b.el.offset(), i = { top: h.top, left: h.left }; if ( "auto" === e ) { var j = a( window ).height(), k = a( window ).scrollTop(), l = -k + h.top - f, m = k + j - ( h.top + g + f ); e = Math.max( l, m ) === l ? "top" : "bottom" } if ( "top" === e ? i.top += -f : i.top += g, d !== document.body ) { var n, o = c.css( "opacity" ); b.visible || c.css( "opacity", 0 ).show(), n = c.offsetParent().offset(), i.top -= n.top, i.top += d.scrollTop, i.left -= n.left, b.visible || c.css( "opacity", o ).hide() } "auto" === b.options.width && ( i.width = b.el.outerWidth() + "px" ), c.css( i ) } }, isCursorAtEnd: function () { var a, b = this, c = b.el.val().length, d = b.element.selectionStart; return "number" == typeof d ? d === c : !document.selection || ( a = document.selection.createRange(), a.moveStart( "character", -c ), c === a.text.length ) }, onKeyPress: function ( a ) { var b = this; if ( !b.disabled && !b.visible && a.which === h.DOWN && b.currentValue ) return void b.suggest(); if ( !b.disabled && b.visible ) { switch ( a.which ) { case h.ESC: b.el.val( b.currentValue ), b.hide(); break; case h.RIGHT: if ( b.hint && b.options.onHint && b.isCursorAtEnd() ) { b.selectHint(); break } return; case h.TAB: if ( b.hint && b.options.onHint ) return void b.selectHint(); if ( b.selectedIndex === -1 ) return void b.hide(); if ( b.select( b.selectedIndex ), b.options.tabDisabled === !1 ) return; break; case h.RETURN: if ( b.selectedIndex === -1 ) return void b.hide(); b.select( b.selectedIndex ); break; case h.UP: b.moveUp(); break; case h.DOWN: b.moveDown(); break; default: return }a.stopImmediatePropagation(), a.preventDefault() } }, onKeyUp: function ( a ) { var b = this; if ( !b.disabled ) { switch ( a.which ) { case h.UP: case h.DOWN: return }clearTimeout( b.onChangeTimeout ), b.currentValue !== b.el.val() && ( b.findBestHint(), b.options.deferRequestBy > 0 ? b.onChangeTimeout = setTimeout( function () { b.onValueChange() }, b.options.deferRequestBy ) : b.onValueChange() ) } }, onValueChange: function () { if ( this.ignoreValueChange ) return void ( this.ignoreValueChange = !1 ); var b = this, c = b.options, d = b.el.val(), e = b.getQuery( d ); return b.selection && b.currentValue !== e && ( b.selection = null, ( c.onInvalidateSelection || a.noop ).call( b.element ) ), clearTimeout( b.onChangeTimeout ), b.currentValue = d, b.selectedIndex = -1, c.triggerSelectOnValidInput && b.isExactMatch( e ) ? void b.select( 0 ) : void ( e.length < c.minChars ? b.hide() : b.getSuggestions( e ) ) }, isExactMatch: function ( a ) { var b = this.suggestions; return 1 === b.length && b[ 0 ].value.toLowerCase() === a.toLowerCase() }, getQuery: function ( b ) { var c, d = this.options.delimiter; return d ? ( c = b.split( d ), a.trim( c[ c.length - 1 ] ) ) : b }, getSuggestionsLocal: function ( b ) { var c, d = this, e = d.options, f = b.toLowerCase(), g = e.lookupFilter, h = parseInt( e.lookupLimit, 10 ); return c = { suggestions: a.grep( e.lookup, function ( a ) { return g( a, b, f ) } ) }, h && c.suggestions.length > h && ( c.suggestions = c.suggestions.slice( 0, h ) ), c }, getSuggestions: function ( b ) { var c, d, e, f, g = this, h = g.options, i = h.serviceUrl; if ( h.params[ h.paramName ] = b, h.onSearchStart.call( g.element, h.params ) !== !1 ) { if ( d = h.ignoreParams ? null : h.params, ( typeof h.lookup === 'function' ) ) return void h.lookup( b, function ( a ) { g.suggestions = a.suggestions, g.suggest(), h.onSearchComplete.call( g.element, b, a.suggestions ) } ); g.isLocal ? c = g.getSuggestionsLocal( b ) : ( ( typeof i === 'function' ) && ( i = i.call( g.element, b ) ), e = i + "?" + a.param( d || {} ), c = g.cachedResponse[ e ] ), c && Array.isArray( c.suggestions ) ? ( g.suggestions = c.suggestions, g.suggest(), h.onSearchComplete.call( g.element, b, c.suggestions ) ) : g.isBadQuery( b ) ? h.onSearchComplete.call( g.element, b, [] ) : ( g.abortAjax(), f = { url: i, data: d, type: h.type, dataType: h.dataType }, a.extend( f, h.ajaxSettings ), g.currentRequest = a.ajax( f ).done( function ( a ) { var c; g.currentRequest = null, c = h.transformResult( a, b ), g.processResponse( c, b, e ), h.onSearchComplete.call( g.element, b, c.suggestions ) } ).fail( function ( a, c, d ) { h.onSearchError.call( g.element, b, a, c, d ) } ) ) } }, isBadQuery: function ( a ) { if ( !this.options.preventBadQueries ) return !1; for ( var b = this.badQueries, c = b.length; c--; )if ( 0 === a.indexOf( b[ c ] ) ) return !0; return !1 }, hide: function () { var b = this, c = a( b.suggestionsContainer ); ( typeof b.options.onHide === 'function' ) && b.visible && b.options.onHide.call( b.element, c ), b.visible = !1, b.selectedIndex = -1, clearTimeout( b.onChangeTimeout ), a( b.suggestionsContainer ).hide(), b.signalHint( null ) }, suggest: function () { if ( !this.suggestions.length ) return void ( this.options.showNoSuggestionNotice ? this.noSuggestions() : this.hide() ); var b, c = this, d = c.options, e = d.groupBy, f = d.formatResult, g = c.getQuery( c.currentValue ), h = c.classes.suggestion, i = c.classes.selected, j = a( c.suggestionsContainer ), k = a( c.noSuggestionsContainer ), l = d.beforeRender, m = "", n = function ( a, c ) { var f = a.data[ e ]; return b === f ? "" : ( b = f, d.formatGroup( a, b ) ) }; return d.triggerSelectOnValidInput && c.isExactMatch( g ) ? void c.select( 0 ) : ( a.each( c.suggestions, function ( a, b ) { e && ( m += n( b, g, a ) ), m += '<div class="' + h + '" data-index="' + a + '">' + f( b, g, a ) + "</div>" } ), this.adjustContainerWidth(), k.detach(), j.html( m ), ( typeof l === 'function' ) && l.call( c.element, j, c.suggestions ), c.fixPosition(), j.show(), d.autoSelectFirst && ( c.selectedIndex = 0, j.scrollTop( 0 ), j.children( "." + h ).first().addClass( i ) ), c.visible = !0, void c.findBestHint() ) }, noSuggestions: function () { var b = this, c = b.options.beforeRender, d = a( b.suggestionsContainer ), e = a( b.noSuggestionsContainer ); this.adjustContainerWidth(), e.detach(), d.empty(), d.append( e ), ( typeof c === 'function' ) && c.call( b.element, d, b.suggestions ), b.fixPosition(), d.show(), b.visible = !0 }, adjustContainerWidth: function () { var b, c = this, d = c.options, e = a( c.suggestionsContainer ); "auto" === d.width ? ( b = c.el.outerWidth(), e.css( "width", b > 0 ? b : 300 ) ) : "flex" === d.width && e.css( "width", "" ) }, findBestHint: function () { var b = this, c = b.el.val().toLowerCase(), d = null; c && ( a.each( b.suggestions, function ( a, b ) { var e = 0 === b.value.toLowerCase().indexOf( c ); return e && ( d = b ), !e } ), b.signalHint( d ) ) }, signalHint: function ( b ) { var c = "", d = this; b && ( c = d.currentValue + b.value.substr( d.currentValue.length ) ), d.hintValue !== c && ( d.hintValue = c, d.hint = b, ( this.options.onHint || a.noop )( c ) ) }, verifySuggestionsFormat: function ( b ) { return b.length && "string" == typeof b[ 0 ] ? a.map( b, function ( a ) { return { value: a, data: null } } ) : b }, validateOrientation: function ( b, c ) { return b = a.trim( b || "" ).toLowerCase(), a.inArray( b, [ "auto", "bottom", "top" ] ) === -1 && ( b = c ), b }, processResponse: function ( a, b, c ) { var d = this, e = d.options; a.suggestions = d.verifySuggestionsFormat( a.suggestions ), e.noCache || ( d.cachedResponse[ c ] = a, e.preventBadQueries && !a.suggestions.length && d.badQueries.push( b ) ), b === d.getQuery( d.currentValue ) && ( d.suggestions = a.suggestions, d.suggest() ) }, activate: function ( b ) { var c, d = this, e = d.classes.selected, f = a( d.suggestionsContainer ), g = f.find( "." + d.classes.suggestion ); return f.find( "." + e ).removeClass( e ), d.selectedIndex = b, d.selectedIndex !== -1 && g.length > d.selectedIndex ? ( c = g.get( d.selectedIndex ), a( c ).addClass( e ), c ) : null }, selectHint: function () { var b = this, c = a.inArray( b.hint, b.suggestions ); b.select( c ) }, select: function ( a ) { var b = this; b.hide(), b.onSelect( a ) }, moveUp: function () { var b = this; if ( b.selectedIndex !== -1 ) return 0 === b.selectedIndex ? ( a( b.suggestionsContainer ).children( "." + b.classes.suggestion ).first().removeClass( b.classes.selected ), b.selectedIndex = -1, b.ignoreValueChange = !1, b.el.val( b.currentValue ), void b.findBestHint() ) : void b.adjustScroll( b.selectedIndex - 1 ) }, moveDown: function () { var a = this; a.selectedIndex !== a.suggestions.length - 1 && a.adjustScroll( a.selectedIndex + 1 ) }, adjustScroll: function ( b ) { var c = this, d = c.activate( b ); if ( d ) { var e, f, g, h = a( d ).outerHeight(); e = d.offsetTop, f = a( c.suggestionsContainer ).scrollTop(), g = f + c.options.maxHeight - h, e < f ? a( c.suggestionsContainer ).scrollTop( e ) : e > g && a( c.suggestionsContainer ).scrollTop( e - c.options.maxHeight + h ), c.options.preserveInput || ( c.ignoreValueChange = !0, c.el.val( c.getValue( c.suggestions[ b ].value ) ) ), c.signalHint( null ) } }, onSelect: function ( b ) { var c = this, d = c.options.onSelect, e = c.suggestions[ b ]; c.currentValue = c.getValue( e.value ), c.currentValue === c.el.val() || c.options.preserveInput || c.el.val( c.currentValue ), c.signalHint( null ), c.suggestions = [], c.selection = e, ( typeof d === 'function' ) && d.call( c.element, e ) }, getValue: function ( a ) { var b, c, d = this, e = d.options.delimiter; return e ? ( b = d.currentValue, c = b.split( e ), 1 === c.length ? a : b.substr( 0, b.length - c[ c.length - 1 ].length ) + a ) : a }, dispose: function () { var b = this; b.el.off( ".autocomplete" ).removeData( "autocomplete" ), a( window ).off( "resize.autocomplete", b.fixPositionCapture ), a( b.suggestionsContainer ).remove() } }, a.fn.devbridgeAutocomplete = function ( c, d ) { var e = "autocomplete"; return arguments.length ? this.each( function () { var f = a( this ), g = f.data( e ); "string" == typeof c ? g && "function" == typeof g[ c ] && g[ c ]( d ) : ( g && g.dispose && g.dispose(), g = new b( this, c ), f.data( e, g ) ) } ) : this.first().data( e ) }, a.fn.autocomplete || ( a.fn.autocomplete = a.fn.devbridgeAutocomplete ) } );

jQuery( document ).ready( function ( $ ) {
	var porto_query_post_type = '';
	if ( typeof elementor != 'undefined' ) {
		elementor.on( 'panel:init', function () {
			$( '<div class="elementor-panel-footer-sub-menu-item" data-href="' + porto_builder_condition.list_url + '"><i class="elementor-icon fas fa-list-ul" aria-hidden="true"></i><div class="elementor-title">' + porto_builder_condition.i18n.back_to_list + '</div></div>' ).insertAfter( '#elementor-panel-footer-sub-menu-item-save-draft' ).on( 'click', function () {
				window.location.href = $( this ).data( 'href' );
			} );
			$( '<div id="porto-elementor-builder-condition" class="elementor-panel-footer-sub-menu-item"><i class="elementor-icon fas fa-network-wired" aria-hidden="true"></i><div class="elementor-title">' + porto_builder_condition.i18n.display_condition + '</div></div>' ).insertAfter( '#elementor-panel-footer-sub-menu-item-save-draft' );
		} );

		// Elementor Top Bar Type
		elementor.on( 'document:loaded', function () {
			var $euiWrapper = $( '#elementor-editor-wrapper-v2 .MuiGrid-root' ).eq(2);
			if ( $euiWrapper.length && ! $euiWrapper.hasClass( 'porto-top-bar-items' ) ) {
				$euiWrapper.addClass( 'porto-top-bar-items' );
				var $euiPreview = $euiWrapper.find('.eui-stack  .eui-box, .MuiBox-root').eq( 2 );
				$( '<div class="elementor-panel-footer-sub-menu-item" data-href="' + porto_builder_condition.list_url + '"><i class="elementor-icon fas fa-list-ul" aria-hidden="true"></i><div class="elementor-title">' + porto_builder_condition.i18n.back_to_list + '</div></div>' ).insertAfter( $euiPreview ).on( 'click', function () {
					window.location.href = $( this ).data( 'href' );
				} );
				$( '<div id="porto-elementor-builder-condition" class="elementor-panel-footer-sub-menu-item"><i class="elementor-icon fas fa-network-wired" aria-hidden="true"></i><div class="elementor-title">' + porto_builder_condition.i18n.display_condition + '</div></div>' ).insertAfter( $euiPreview );
			}
		} );
	}

	$( document.body ).on( 'click', '#porto-elementor-builder-condition, #porto-condition-button, .porto-meta-tab #condition', function ( e ) {
		e.preventDefault();
		$.magnificPopup.open( {
			items: {
				src: '.porto-builder-cond-wrap'
			},
			type: 'inline',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			//fixedContentPos: false,
			callbacks: {
				change: function () {

				}
			}
		} );

	} ).on( 'click', '.porto-template-edit-condition', function ( e ) {
		e.preventDefault();

		var $this  = $(e.currentTarget);
			postID = $this.data('post-id');

			$this.addClass( 'disabled' );
						
			$.ajax( {
				url: ajaxurl,
				type: 'POST',
				dataType: 'json',
				data: { 
					action: 'porto_builder_condition_template',
					post_id: postID,
					nonce: porto_builder_condition.nonce
				},
				success: function ( response ) {
					$this.removeClass( 'disabled' );
					if ( response.data ) {
						$.magnificPopup.open( {
							items: {
								src: $( response.data )
							},
							type: 'inline',
							mainClass: 'mfp-fade porto-templates-list-popup',
							removalDelay: 160,
							preloader: false,
							callbacks: {
								open: function() {
									init();
								}
							}
						} );
					}
				}
			} );

	} ).on( 'click', '.porto-builder-condition .condition-close', function ( e ) {
		e.preventDefault();
		var $this = $( this ),
			$cond = $this.closest( '.porto-builder-condition' );
		if ( 0 === $cond.index() && $cond.siblings( '.porto-builder-condition' ).length < 1 ) {
			$cond.hide();
		} else {
			$cond.remove();
		}
	} ).on( 'click', '.porto-builder-cond-wrap .btn-add-condition', function ( e ) {

		e.preventDefault();
		var $new = $( '.porto-builder-condition-template' ).clone().css( 'display', '' ).removeClass( 'porto-builder-condition-template' );
		$new.insertBefore( $( '.porto-builder-condition-template' ) );

		init_live_search( $new );

		check_duplicated_conditions( $new );
	} ).on( 'click', '#elementor-panel-saver-button-publish, .MuiButtonGroup-root > button, .vcv-ui-navbar-controls-group[data-vcv-guide-helper="save-control"], .vc_navbar-frontend .vc_btn-save, .vc_navbar-frontend .vc_btn-save-draft, #post #publish, #wpb-save-post', function ( e ) {
		let isPass = false;
		if ( this.attributes.id && typeof this.attributes.id.nodeValue == 'string' && ( this.attributes.id.nodeValue == 'wpb-save-post' || this.attributes.id.nodeValue == 'publish' ) ) {
			if ( typeof window.vc !== 'undefined' /*&& 'publish' == $( '#original_post_status' ).val()*/ && typeof js_porto_admin_vars.wpb_backend_ajax !== 'undefined' && js_porto_admin_vars.wpb_backend_ajax == '1' ) {
				isPass = true;
			}
		} else {
			isPass = true;
		}

		if ( isPass && $( '.porto-builder-cond-wrap.notsaved' ).length ) {
			$.magnificPopup.open( {
				items: {
					src: '.porto-builder-cond-wrap'
				},
				type: 'inline',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				callbacks: {
					change: function () {
					}
				}
			} );
		}
	} );

	var check_duplicated_conditions_timer = null,
		check_duplicated_conditions = function( $cond ) {
		if ( check_duplicated_conditions_timer ) {
			clearTimeout( check_duplicated_conditions_timer );
		}
		check_duplicated_conditions_timer = setTimeout( function() {
			$cond.children( '.duplicated-conditions' ).remove();
			var object_id = $cond.find( '.condition-object-id' ).val(),
				object_name = $cond.find( '.condition-object-name' ).val();
			if ( '0' === object_id ) {
				object_id = '';
			}
			if ( object_id && ! $cond.find( 'input[name="query"]' ).val() ) {
				object_id = '';
				object_name = '';
			}
			var new_condition = [$cond.find( '[name="type[]"]' ).val(), $cond.find( '.condition-object-type' ).val(), object_id, object_name];
			$.ajax( {
				url: ajaxurl,
				type: 'POST',
				dataType: 'json',
				data: { condition: new_condition, action: 'porto_builder_check_condition', nonce: porto_builder_condition.nonce, post_id: $cond.closest( 'form' ).find( '[name="post_id"]' ).val() },
				success: function ( response ) {
					if ( response && response.success && response.data ) {
						$cond.prepend( '<div class="duplicated-conditions">' + response.data + '</div>' );
					}
				}
			} );
		}, 300 );
	};

	$( document.body ).on( 'change', '.porto-builder-cond-wrap .condition-type', function ( e, is_first ) {
		var val = $( this ).val();
		$cond = $( this ).closest( '.porto-builder-condition' );
		if ( 'single' == val ) {
			$cond.find( '.condition-object-type' ).show();
			$cond.find( '.condition-object-type' ).find( 'option[value^="single/"]' ).show();
			$cond.find( '.condition-object-type' ).find( 'option[value^="archive/"]' ).hide();
		} else if ( 'archive' == val ) {
			$cond.find( '.condition-object-type' ).show();
			$cond.find( '.condition-object-type' ).find( 'option[value^="single/"]' ).hide();
			$cond.find( '.condition-object-type' ).find( 'option[value^="archive/"]' ).show();
		} else {
			$cond.find( '.condition-object-type' ).val( '' );
			$cond.find( '.condition-object-type' ).hide();
			$cond.find( '.condition' ).eq( 2 ).hide();
		}

		if ( typeof is_first == 'undefined' ) {
			check_duplicated_conditions( $cond );
		}
	} ).on( 'change', '.porto-builder-cond-wrap .condition-object-type', function ( e, is_first ) {
		var val = $( this ).val();
		$cond = $( this ).closest( '.porto-builder-condition' );
		if ( val && 'single/404' != val && -1 === val.indexOf( 'archive/' ) ) {
			var $obj = $cond.find( '.condition' ).eq( 2 );
			if ( typeof is_first == 'undefined' ) {
				$obj.show();
			}
			porto_query_post_type = val;
		} else {
			$cond.find( '.condition' ).eq( 2 ).hide();
			porto_query_post_type = '';
		}
		if ( typeof is_first == 'undefined' ) {
			$cond.find( '.condition' ).eq( 2 ).find( '.condition-object-id' ).val( '' );
			$cond.find( '.condition' ).eq( 2 ).find( 'input[name="query"]' ).val( '' );

			check_duplicated_conditions( $cond );
		}
	} ).on( 'input', '.porto-builder-cond-wrap input[name="query"]', function ( e ) {
		var $this = $( this );
		if ( $this.val() ) {
			$this.siblings( '.condition-cancel' ).show();
		} else {
			$this.siblings( '.condition-cancel' ).hide();
		}
	} ).on( 'click', '.porto-builder-cond-wrap .condition-cancel', function ( e ) {
		e.preventDefault();
		$( this ).hide().siblings( 'input[name="query"]' ).val( '' ).focus();

		check_duplicated_conditions( $( this ).closest( '.porto-builder-condition' ) );
	} ).on( 'click', '.porto-builder-cond-wrap .condition-clone', function ( e ) {
		e.preventDefault();
		var $this_condition = $( this ).closest( '.porto-builder-condition' ),
			$new = $this_condition.clone().insertAfter( $this_condition );
		$new.find( '.condition' ).eq( 0 ).val( $this_condition.find( '.condition' ).eq( 0 ).val() );
		$new.find( '.condition' ).eq( 1 ).val( $this_condition.find( '.condition' ).eq( 1 ).val() );
		init_live_search( $new );

		check_duplicated_conditions( $new );
	} );

	$( document.body ).on( 'click', '.porto-builder-cond-wrap .save-condition', function ( e ) {
		e.preventDefault();
		var $this = $( this ),
			postdata = '';
		$this.closest( '.porto-builder-cond-wrap' ).find( '.porto-builder-condition' ).each( function () {
			var $this = $( this );
			if ( $this.is( ':hidden' ) ) {
				var tmp_cloned = $this.clone(), $parent = $this.closest( 'form' );
				$this.remove();
				postdata = $parent.serialize();
				if ( $parent.find( '.porto-builder-condition' ).length ) {
					tmp_cloned.insertAfter( $( '.porto-builder-condition' ).last() );
				} else {
					tmp_cloned.prependTo( $parent );
				}
				init_live_search( tmp_cloned );
			}
			if ( ! $this.find( 'input[name="query"]' ).val() ) {
				$this.find( '.condition-object-id' ).val( '' );
				$this.find( '.condition-object-name' ).val( '' );
			}
		} );
		if ( !postdata ) {
			postdata = $this.closest( 'form' ).serialize();
		}
		$this.prop( 'disabled', true );
		$.magnificPopup.close();
		$.ajax( {
			url: ajaxurl,
			type: 'POST',
			dataType: 'json',
			data: postdata + '&action=porto_builder_save_condition' + ( porto_builder_condition.is_templates_list_page ? '&templates_list=true' : '' ),
			success: function ( response ) {
				$condWrap = $this.closest( '.porto-builder-cond-wrap' );
				if ( $condWrap.find( '.porto-builder-condition:not(.porto-builder-condition-template)' ).length ) {
					$condWrap.removeClass( 'notsaved' );
				} else {
					$condWrap.addClass( 'notsaved' );
				}

				/**
				 * Update applied conditions status on templates list page after display condition is updated.
				 * 
				 * @since 3.1.0
				 */
				if ( porto_builder_condition.is_templates_list_page && undefined != response.data.applied_conditions ) {
					$( '#post-' + response.data.post_id ).find( '.condition' ).html( response.data.applied_conditions );
				}
			},
			complete: function () {
				$this.prop( 'disabled', false );
			},
			failure: function () {
				alert( 'Save failed. Please refresh and try again.' );
			}
		} );
	} );

	var init_live_search = function ( $obj ) {
		if ( typeof $obj == 'undefined' ) {
			$obj = $( '.searchform' );
		}
		$obj.each( function () {
			var $this = $( this ),
				appendTo = $this.find( '.live-search-list' ),
				serviceUrl = ajaxurl + ( -1 === ajaxurl.indexOf( '?' ) ? '?' : '&' )  + 'action=porto_builder_search_posts&nonce=' + porto_builder_condition.nonce;

			$this.find( 'input[type="text"]' ).devbridgeAutocomplete( {
				minChars: 3,
				appendTo: appendTo,
				triggerSelectOnValidInput: false,
				serviceUrl: serviceUrl,
				onSearchStart: function ( params ) {
					if ( ! porto_query_post_type ) {
						porto_query_post_type = $this.hasClass( 'porto-builder-condition' ) ? $this.find( '.condition-object-type' ).val() : $this.closest( '.porto-builder-condition' ).find( '.condition-object-type' ).val();
						if ( 'single/404' == porto_query_post_type || -1 !== porto_query_post_type.indexOf( 'archive/' ) ) {
							porto_query_post_type = '';
						}
					}
					params.post_type = porto_query_post_type;
				},
				onSelect: function ( item ) {
					if ( item.id != -1 ) {
						$this.find( '.condition-object-id' ).val( item.id );
						$this.find( '.condition-object-name' ).val( item.value );

						check_duplicated_conditions( $this.hasClass( 'porto-builder-condition' ) ? $this : $this.closest( '.porto-builder-condition' ) );
					}
				},
				formatResult: function ( item, currentValue ) {
					var pattern = '(' + $.Autocomplete.utils.escapeRegExChars( currentValue ) + ')',
						html = '<div class="search-name">' + item.value.replace( new RegExp( pattern, 'gi' ), '<strong>$1<\/strong>' ) + '</div>';
					return html;
				}
			} );
		} );
	};

	// ajax select2 used in meta box
	var init_ajax_select2 = function ( $el ) {
		var option = $el.data( 'option' ),
			ids = $el.val(),
			is_multiple = ( typeof $el.attr( 'multiple' ) != 'undefined' ),
			path = porto_block_vars.site_url + '/wp-json/ajaxselect2/v1/' + option + '/';
		if ( ! ids ) {
			ids = $el.data( 'value' );
		}
		$el.select2( {
			ajax: {
				url: path,
				dataType: 'json',
				data: function ( params ) {
					var args = {
						s: params.term
					};
					if ( !is_multiple ) {
						args[ 'add_default' ] = '1';
					}
					return args;
				}
			},
			cache: true
		} );

		$.ajax( {
			url: path,
			dataType: 'json',
			data: {
				ids: ids ? ids : ''
			}
		} ).then( function ( res ) {

			if ( null !== res && res.results.length > 0 ) {
				res.results.map( ( v, i ) => {
					$el.append( new Option( v.text, v.id, true, true ) ).trigger( 'change' );
				} );
				$el.trigger( {
					type: 'select2:select',
					params: {
						data: res
					}
				} );
			}
		} );
	};

	var init = function () {
		$( '.porto-builder-cond-wrap .condition-type' ).trigger( 'change', true );
		$( '.porto-builder-cond-wrap .condition-object-type' ).trigger( 'change', true );
		
		init_live_search();

		$( '.porto-ajaxselect2' ).each( function () {
			init_ajax_select2( $( this ) );
		} );
	}

	init();
} );

jQuery( window ).on( 'load', function () {
	setTimeout( function () {
		if ( jQuery( '.vcv-ui-navbar-sandwich' ).length ) {
			jQuery( '<span id="porto-condition-button" class="vcv-ui-navbar-control" title="' + porto_builder_condition.i18n.display_condition + '"><span class="vcv-ui-navbar-control-content">' + porto_builder_condition.i18n.display_condition + '</span></span>' ).insertBefore( jQuery( '.vcv-ui-navbar-sandwich .vcv-ui-navbar-control' ).last() );
			jQuery( '<span class="vcv-ui-navbar-control porto-builder-back-to-list" title="' + porto_builder_condition.i18n.back_to_list + '" data-href="' + porto_builder_condition.list_url + '"><span class="vcv-ui-navbar-control-content">' + porto_builder_condition.i18n.back_to_list + '</span></span>' ).insertBefore( jQuery( '.vcv-ui-navbar-sandwich .vcv-ui-navbar-control' ).last() ).on( 'click', function () {
				window.location.href = jQuery( this ).data( 'href' );
			} );
		}

		// init post type builder js
		var preview_width_trigger = null;
		if ( jQuery( '#preview_width' ).length ) {
			var $preview_width_obj = jQuery( '#preview_width' );

			$preview_width_obj.on( 'change', function ( e ) {
				if ( preview_width_trigger ) {
					clearTimeout( preview_width_trigger );
				}
				var val = this.value;
				preview_width_trigger = setTimeout( function () {
					jQuery( '.editor-styles-wrapper' ).css( 'width', val ? Number( val ) + 'px' : '360px' ).css( 'margin', '0 auto' );
				}, 300 );
			} );
		}
	}, 200 );
} );
