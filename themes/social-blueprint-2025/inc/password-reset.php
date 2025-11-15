<?php
/**
 * Password Reset API Endpoint
 * Add this to your functions.php or a custom plugin
 */

add_action('rest_api_init', function () {
    register_rest_route('sb/v1', '/password-reset', [
        'methods' => 'POST',
        'callback' => 'sb_handle_password_reset',
        'permission_callback' => '__return_true', // Public endpoint
    ]);
});

function sb_handle_password_reset(WP_REST_Request $request) {
    $email = sanitize_email($request->get_param('email'));

    if (empty($email)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Email address is required',
        ], 400);
    }

    if (!is_email($email)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Please provide a valid email address',
        ], 400);
    }

    // Check if user exists
    $user = get_user_by('email', $email);
    
    if (!$user) {
        // For security, don't reveal if email exists or not
        // Return success anyway to prevent email enumeration
        return new WP_REST_Response([
            'success' => true,
            'message' => 'If an account exists with this email, you will receive password reset instructions.',
        ], 200);
    }

    // Generate reset key
    $reset_key = get_password_reset_key($user);
    
    if (is_wp_error($reset_key)) {
        error_log('Password reset key generation failed: ' . $reset_key->get_error_message());
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to generate reset link. Please try again.',
        ], 500);
    }

    // Build reset URL
    // Try to get UsersWP reset page first
    $reset_page_url = uwp_get_page_link('reset');
    
    // If UsersWP doesn't have a reset page configured, use the account page or wp-login
    if (empty($reset_page_url) || $reset_page_url === home_url('/')) {
        // Try UsersWP account page
        $reset_page_url = uwp_get_page_link('account');
        if (empty($reset_page_url) || $reset_page_url === home_url('/')) {
            // Fallback to WordPress default
            $reset_page_url = network_site_url('wp-login.php', 'login');
        }
    }
    
    $reset_url = add_query_arg([
        'action' => 'rp',
        'key' => $reset_key,
        'login' => rawurlencode($user->user_login),
    ], $reset_page_url);

    // Prepare email
    $subject = sprintf('[%s] Password Reset', get_bloginfo('name'));
    
    $message = sprintf(
        "Hi %s,\n\n" .
        "You requested a password reset for your account at %s.\n\n" .
        "To reset your password, click the following link:\n" .
        "%s\n\n" .
        "This link will expire in 24 hours.\n\n" .
        "If you didn't request this password reset, please ignore this email.\n\n" .
        "Thanks,\n%s",
        $user->display_name,
        get_bloginfo('name'),
        $reset_url,
        get_bloginfo('name')
    );

    // Send email using WP Mail SMTP
    $sent = wp_mail($email, $subject, $message, [
        'Content-Type: text/plain; charset=UTF-8',
    ]);

    if (!$sent) {
        error_log('Password reset email failed to send to: ' . $email);
        return new WP_REST_Response([
            'success' => false,
            'message' => 'Failed to send reset email. Please try again.',
        ], 500);
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Password reset email sent successfully',
    ], 200);
}

/**
 * Optional: Customize the reset page template
 * Create a template file called: page-reset-password.php
 */

/**
 * Optional: Add HTML email template
 * Uncomment and customize if you want a nicer email
 */
/*
add_filter('wp_mail_content_type', function($content_type) {
    return 'text/html';
});

// Then update the message in sb_handle_password_reset to use HTML:
$message = sprintf(
    '<html><body>' .
    '<p>Hi %s,</p>' .
    '<p>You requested a password reset for your account at %s.</p>' .
    '<p>To reset your password, click the button below:</p>' .
    '<p><a href="%s" style="background-color: #0073aa; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>' .
    '<p>Or copy and paste this link into your browser:<br>%s</p>' .
    '<p>This link will expire in 24 hours.</p>' .
    '<p>If you didn\'t request this password reset, please ignore this email.</p>' .
    '<p>Thanks,<br>%s</p>' .
    '</body></html>',
    esc_html($user->display_name),
    esc_html(get_bloginfo('name')),
    esc_url($reset_url),
    esc_url($reset_url),
    esc_html(get_bloginfo('name'))
);
*/