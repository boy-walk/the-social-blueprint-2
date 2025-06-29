<?php
extract(
	shortcode_atts(
		array(
			'breadcrumbs_type'         => '',
			'hide_page_title'          => '',
			'page_title'               => '',
			'page_sub_title'           => '',
			'hide_breadcrumb'          => '',
			'not_render_home'          => '',
			'bc_margin_top'            => '',
			'bc_margin_bottom'         => '',
			'breadcrumbs_text_color'   => '',
			'breadcrumbs_link_color'   => '',
			'page_title_font_size'     => '',
			'page_title_color'         => '',
			'page_title_margin_bottom' => '',
			'page_subtitle_color'      => '',
			'delimiter_font_size'      => '',
			'animation_type'           => '',
			'page_builder'             => 'bakery',
			'animation_duration'       => 1000,
			'animation_delay'          => 0,
			'animation_reveal_clr'     => '',
			'el_class'                 => '',
		),
		$atts
	)
);
if ( $not_render_home && is_front_page() ) {
	return;
}

if ( empty( $breadcrumbs_type ) ) {
	global $porto_settings;
	$breadcrumbs_type = $porto_settings['breadcrumbs-type'];
}

$el_class = porto_shortcode_extract_class( $el_class );
if ( ! empty( $shortcode_class ) ) {
	$el_class .= ' ' . $shortcode_class;
}
echo '<div class="page-top page-header-' . esc_attr( $breadcrumbs_type ) . ( $el_class ? ' ' . esc_attr( $el_class ) : '' ) . '"';
if ( $animation_type ) {
	echo ' data-appear-animation="' . esc_attr( $animation_type ) . '"';
	if ( $animation_delay ) {
		echo ' data-appear-animation-delay="' . esc_attr( $animation_delay ) . '"';
	}
	if ( $animation_duration && 1000 != $animation_duration ) {
		echo ' data-appear-animation-duration="' . esc_attr( $animation_duration ) . '"';
	}
	if ( false !== strpos( $animation_type, 'revealDir' ) ) {
		echo ' data-animation-reveal-clr="' . ( ! empty( $animation_reveal_clr ) ? esc_attr( $animation_reveal_clr ) : '' ) . '"';
	}
}
echo '>';
	ob_start();
	echo '<style>';
		echo '.page-top { background: none; border-bottom: none; } .page-top .page-title:not(.b-none):after { display: none; }';
if ( 'bakery' === $page_builder ) {
	if ( $breadcrumbs_text_color ) {
		echo '.page-top .breadcrumbs-wrap { color: ' . esc_html( $breadcrumbs_text_color ) . '}';
	}
	if ( $breadcrumbs_link_color ) {
		echo '.page-top .breadcrumbs-wrap a { color: ' . esc_html( $breadcrumbs_link_color ) . ' }';
	}
	if ( $page_title_color || $page_title_font_size || $page_title_margin_bottom ) {
		echo '.page-top .page-title {';
		if ( $page_title_color ) {
			echo 'color: ' . esc_html( $page_title_color ) . ';';
		}
		if ( $page_title_font_size && ! strpos( $page_title_font_size, 'family' ) ) {
			echo 'font-size: ' . esc_html( $page_title_font_size ) . ( is_numeric( $page_title_font_size ) ? 'px' : '' ) . ';';
		}
		if ( $page_title_margin_bottom ) {
			echo 'margin-bottom: ' . esc_html( $page_title_margin_bottom ) . ( is_numeric( $page_title_margin_bottom ) ? 'px' : '' ) . ';';
		}
		echo '}';
	}
	if ( $page_subtitle_color ) {
		echo '.page-top .page-sub-title { color: ' . esc_html( $page_subtitle_color ) . ' }';
	}
}
	echo '</style>';
	porto_filter_inline_css( ob_get_clean() );
	$args = array();
if ( $page_title ) {
	$args['porto_shortcode_title'] = $page_title;
}
if ( $page_sub_title ) {
	$args['porto_shortcode_sub_title'] = $page_sub_title;
}
if ( $hide_breadcrumb ) {
	$args['hide_breadcrumb'] = true;
}
	$args['is_shortcode'] = true;

if ( ! empty( $hide_page_title ) ) {
	$args['hide_page_title'] = true;
}

	porto_get_template_part( 'page_header/page_header_' . sanitize_file_name( $breadcrumbs_type ), null, $args );

echo '</div>';
