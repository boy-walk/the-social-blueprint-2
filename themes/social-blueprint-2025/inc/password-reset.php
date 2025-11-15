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
    $reset_url = add_query_arg([
        'action' => 'rp',
        'key' => $reset_key,
        'login' => rawurlencode($user->user_login),
    ], uwp_get_page_link('reset')); // UsersWP reset page

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
