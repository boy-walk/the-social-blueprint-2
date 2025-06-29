<?php

add_action( 'widgets_init', 'porto_tweets_load_widgets' );

add_action( 'wp_ajax_porto_twitter_tweets', 'porto_twitter_tweets' );
add_action( 'wp_ajax_nopriv_porto_twitter_tweets', 'porto_twitter_tweets' );

function porto_tweets_load_widgets() {
	register_widget( 'Porto_Twitter_Tweets_Widget' );
}

function porto_twitter_tweets() {
	check_ajax_referer( 'porto-twitter-widget-nonce', 'nonce' );
	if ( ! isset( $_POST['id'] ) ) {
		die;
	}

	$widget_array = get_option( 'widget_tweets-widget' );

	$instance = $widget_array[ $_POST['id'] ];

	require_once( dirname( __FILE__ ) . '/tweet-php/TweetPHP.php' );

	$consumer_key        = $instance['consumer_key'];
	$consumer_secret     = $instance['consumer_secret'];
	$access_token        = $instance['access_token'];
	$access_secret       = $instance['access_token_secret'];
	$twitter_screen_name = $instance['screen_name'];
	$tweets_to_display   = $instance['count'];

	$tweet_php = new TweetPHP(
		array(
			'consumer_key'        => $consumer_key,
			'consumer_secret'     => $consumer_secret,
			'access_token'        => $access_token,
			'access_token_secret' => $access_secret,
			'api_endpoint'          => 'statuses/user_timeline',
			'api_params'            => array(),
			'enable_cache'          => true,
			'cache_dir'             => dirname(__FILE__) . '/tweet-php/cache/', // Where on the server to save cached tweets
			'cachetime'             => 60 * 60, // Seconds to cache feed (1 hour).
			'tweets_to_retrieve'    => 25, // Specifies the number of tweets to try and fetch, up to a maximum of 200
			'tweets_to_display'     => $tweets_to_display, // Number of tweets to display
			'twitter_style_dates' => true, // Use twitter style dates e.g. 2 hours ago
			'twitter_date_text'   => array( 'seconds', 'minutes', 'about', 'hour', 'ago' ),
			'date_format'         => '%I:%M %p %b %d%O', // The defult date format e.g. 12:08 PM Jun 12th. See: http://php.net/manual/en/function.strftime.php
			'date_lang'           => get_locale(), // Language for date e.g. 'fr_FR'. See: http://php.net/manual/en/function.setlocale.php
			'twitter_template'      => '<ul>{tweets}</ul>',
			'tweet_template'        => '<li><span class="status"><i class="fab fa-twitter"></i>{tweet}</span> <span class="meta"><a href="{link}">{date}</a></span></li>',
			'error_template'        => '<li><span class="status"><i class="fab fa-twitter"></i>' . esc_html__( 'Oops, our twitter feed is unavailable right now.', 'porto-functionality' ) . '</span> <span class="meta"><a href="{link}">' . esc_html__( 'Follow us on Twitter', 'porto-functionality' ) . '</a></span></li>',
			'nofollow_links'        => false, // Add rel="nofollow" attribute to links
			'debug'               => false,
			'twitter_screen_name'   => $twitter_screen_name,
			'ignore_replies'        => true, // Deprecated. Use api_params.
			'ignore_retweets'       => true // Deprecated. Use api_params.
		)
	);

	echo porto_filter_output( $tweet_php->get_tweet_list() );

	die();
}

class Porto_Twitter_Tweets_Widget extends WP_Widget {

	public function __construct() {
		$widget_ops = array(
			'classname'   => 'twitter-tweets',
			'description' => __( 'The most recent tweets from twitter.', 'porto-functionality' ),
		);

		$control_ops = array( 'id_base' => 'tweets-widget' );

		parent::__construct( 'tweets-widget', __( 'Porto: Twitter Tweets with premium X account', 'porto-functionality' ), $widget_ops, $control_ops );
	}

	function widget( $args, $instance ) {
		extract( $args );
		$title               = apply_filters( 'widget_title', $instance['title'] );
		$consumer_key        = $instance['consumer_key'];
		$consumer_secret     = $instance['consumer_secret'];
		$access_token        = $instance['access_token'];
		$access_token_secret = $instance['access_token_secret'];
		$screen_name         = $instance['screen_name'];
		$count               = (int) $instance['count'];

		echo porto_filter_output( $before_widget );

		if ( $title ) {
			echo porto_filter_output( $before_title ) . porto_strip_script_tags( $title ) . $after_title;
		}

		if ( $screen_name && $consumer_key && $consumer_secret && $access_token && $access_token_secret && $count ) {
			?>
			<div class="tweets-box">
				<p><?php esc_html_e( 'Please wait...', 'porto-functionality' ); ?></p>
			</div>

			<script>
				( function() {
					var porto_load_tweets_feeds = function() {
						( function( $ ) {
							$.post('<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>', {
									id: '<?php echo str_replace( 'tweets-widget-', '', $widget_id ); ?>',
									action: 'porto_twitter_tweets',
									nonce: '<?php echo wp_create_nonce( 'porto-twitter-widget-nonce' ); ?>'
								},
								function(data) {
									if (data) {
										$('#<?php echo esc_js( $widget_id ); ?> .tweets-box').html(data);
										$("#<?php echo esc_js( $widget_id ); ?> .twitter-slider").owlCarousel({
											rtl: <?php echo is_rtl() ? 'true' : 'false'; ?>,
											dots : false,
											nav : true,
											navText: ["", ""],
											items: 1,
											autoplay : true,
											autoplayTimeout: 5000
										}).addClass('show-nav-title');
									}
								}
							);
						} )( window.jQuery );
					};

					if ( window.jQuery ) {
						porto_load_tweets_feeds();
					} else {
						document.addEventListener( 'DOMContentLoaded', porto_load_tweets_feeds );
					}
				} )();
			</script>
			<?php
		} else {
			echo '<p>' . esc_html__( 'Please configure widget options.', 'porto-functionality' ) . '</p>';
		}

		echo porto_filter_output( $after_widget );
	}

	function update( $new_instance, $old_instance ) {
		$instance = $old_instance;

		$instance['title']               = strip_tags( $new_instance['title'] );
		$instance['consumer_key']        = $new_instance['consumer_key'];
		$instance['consumer_secret']     = $new_instance['consumer_secret'];
		$instance['access_token']        = $new_instance['access_token'];
		$instance['access_token_secret'] = $new_instance['access_token_secret'];
		$instance['screen_name']         = $new_instance['screen_name'];
		$instance['count']               = $new_instance['count'];

		return $instance;
	}

	function form( $instance ) {
		$defaults = array(
			'title'               => __( 'Latest Tweets', 'porto-functionality' ),
			'screen_name'         => '',
			'count'               => 2,
			'consumer_key'        => '',
			'consumer_secret'     => '',
			'access_token'        => '',
			'access_token_secret' => '',
		);
		$instance = wp_parse_args( (array) $instance, $defaults );
		?>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
				<strong><?php esc_html_e( 'Title', 'porto-functionality' ); ?>:</strong>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" value="<?php echo isset( $instance['title'] ) ? porto_strip_script_tags( $instance['title'] ) : ''; ?>" />
			</label>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'consumer_key' ) ); ?>">
				<strong><?php esc_html_e( 'Consumer Key', 'porto-functionality' ); ?>:</strong>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'consumer_key' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'consumer_key' ) ); ?>" value="<?php echo isset( $instance['consumer_key'] ) ? esc_attr( $instance['consumer_key'] ) : ''; ?>" />
			</label>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'consumer_secret' ) ); ?>">
				<strong><?php esc_html_e( 'Consumer Secret', 'porto-functionality' ); ?>:</strong>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'consumer_secret' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'consumer_secret' ) ); ?>" value="<?php echo isset( $instance['consumer_secret'] ) ? esc_attr( $instance['consumer_secret'] ) : ''; ?>" />
			</label>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'access_token' ) ); ?>">
				<strong><?php esc_html_e( 'Access Token', 'porto-functionality' ); ?>:</strong>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'access_token' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'access_token' ) ); ?>" value="<?php echo isset( $instance['access_token'] ) ? esc_attr( $instance['access_token'] ) : ''; ?>" />
			</label>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'access_token_secret' ) ); ?>">
				<strong><?php esc_html_e( 'Access Token Secret', 'porto-functionality' ); ?>:</strong>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'access_token_secret' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'access_token_secret' ) ); ?>" value="<?php echo isset( $instance['access_token_secret'] ) ? esc_attr( $instance['access_token_secret'] ) : ''; ?>" />
			</label>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'screen_name' ) ); ?>">
				<strong><?php esc_html_e( 'Twitter Screen Name', 'porto-functionality' ); ?>:</strong>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'screen_name' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'screen_name' ) ); ?>" value="<?php echo isset( $instance['screen_name'] ) ? esc_attr( $instance['screen_name'] ) : ''; ?>" />
			</label>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'count' ) ); ?>">
				<strong><?php esc_html_e( 'Number of Tweets', 'porto-functionality' ); ?>:</strong>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'count' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'count' ) ); ?>" value="<?php echo isset( $instance['count'] ) ? esc_attr( $instance['count'] ) : ''; ?>" />
			</label>
		</p>

		<?php /* translators: $1: opening A tag which has link to the Twitter App $2: closing A tag */ ?>
		<p><strong><?php esc_html_e( 'Info', 'porto-functionality' ); ?>:</strong><br/><?php printf( esc_html__( 'You can find or create %1$sTwitter App here%2$s.', 'porto-functionality' ), '<a href="http://dev.twitter.com/apps" target="_blank">', '</a>' ); ?></p>

		<?php
	}
}
?>
