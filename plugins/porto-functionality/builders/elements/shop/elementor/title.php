<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Porto Shop Builder - Archive Title Widget
 *
 * @since 6.0
 */

use Elementor\Controls_Manager;

class Porto_Elementor_SB_Title_Widget extends \Elementor\Widget_Base {

	public function get_name() {
		return 'porto_sb_title';
	}

	public function get_title() {
		return __( 'Archive Title', 'porto-functionality' );
	}

	public function get_categories() {
		return array( 'porto-sb' );
	}

	public function get_keywords() {
		return array( 'title', 'shop', 'archive' );
	}

	public function get_icon() {
		return 'Simple-Line-Icons-social-tumblr porto-elementor-widget-icon';
	}

	public function get_script_depends() {
		return array();
	}

	public function get_custom_help_url() {
		return 'https://www.portotheme.com/wordpress/porto/documentation/shop-builder-elements/';
	}

	protected function register_controls() {
		$this->start_controls_section(
			'section_title_layout',
			array(
				'label' => __( 'Archive Title', 'porto-functionality' ),
			)
		);

		$this->add_control(
			'notice_skin',
			array(
				'type'            => Controls_Manager::RAW_HTML,
				'raw'             => sprintf( __( 'To change the Products Archive’s layout, go to %1$sPorto / Theme Options / WooCommerce / Product Archives%2$s.', 'porto-functionality' ), '<a href="' . porto_get_theme_option_url( 'product-archive-layout' ) . '" target="_blank" class="porto-text-underline">', '</a>' ),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
			)
		);

		$this->add_control(
			'notice_wrong_data',
			array(
				'type'            => Controls_Manager::RAW_HTML,
				'raw'             => __( 'The editor\'s preview might look different from the live site. Please check the frontend.', 'porto-functionality' ),
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-info',
			)
		);

		$this->add_control(
			'heading_tag',
			array(
				'type'    => Controls_Manager::SELECT,
				'label'   => __( 'Title Tag', 'porto-functionality' ),
				'options' => array(
					'h1' => __( 'H1', 'porto-functionality' ),
					'h2' => __( 'H2', 'porto-functionality' ),
					'h3' => __( 'H3', 'porto-functionality' ),
					'h4' => __( 'H4', 'porto-functionality' ),
					'h5' => __( 'H5', 'porto-functionality' ),
					'h6' => __( 'H6', 'porto-functionality' ),
				),
				'default' => 'h2',
			)
		);

		$this->add_group_control(
			Elementor\Group_Control_Typography::get_type(),
			array(
				'name'     => 'title_font',
				'scheme'   => Elementor\Core\Schemes\Typography::TYPOGRAPHY_1,
				'label'    => __( 'Typography', 'porto-functionality' ),
				'selector' => '{{WRAPPER}} .entry-title',
			)
		);

		$this->add_responsive_control(
			'align',
			array(
				'label'     => esc_html__( 'Alignment', 'porto-functionality' ),
				'type'      => Controls_Manager::CHOOSE,
				'options'   => array(
					'left'    => array(
						'title' => esc_html__( 'Left', 'porto-functionality' ),
						'icon'  => 'eicon-text-align-left',
					),
					'center'  => array(
						'title' => esc_html__( 'Center', 'porto-functionality' ),
						'icon'  => 'eicon-text-align-center',
					),
					'right'   => array(
						'title' => esc_html__( 'Right', 'porto-functionality' ),
						'icon'  => 'eicon-text-align-right',
					),
					'justify' => array(
						'title' => esc_html__( 'Justified', 'porto-functionality' ),
						'icon'  => 'eicon-text-align-justify',
					),
				),
				'default'   => '',
				'selectors' => array(
					'{{WRAPPER}}' => 'text-align: {{VALUE}};',
				),
			)
		);

		$this->add_control(
			'title_font_color1',
			array(
				'type'      => Controls_Manager::COLOR,
				'label'     => __( 'Color', 'porto-functionality' ),
				'selectors' => array(
					'{{WRAPPER}} .entry-title' => 'color: {{VALUE}};',
				),
			)
		);

		$this->end_controls_section();
	}

	protected function render() {
		$atts = $this->get_settings_for_display();
		echo '<' . esc_html( $atts['heading_tag'] ) . ' class="entry-title">';
		echo porto_page_title();
		echo '</' . esc_html( $atts['heading_tag'] ) . '>';
	}
}
