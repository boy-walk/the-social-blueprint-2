<?php

function sbp_get_turnstile_site_key(): string {
    $site_key = '';

    // since the keys are already stored by CF7 plugin, we are using the same variables instead of defining new consts
    if (class_exists('WPCF7')) {
        $sitekeys = WPCF7::get_option('turnstile');
        $site_key = (!empty($sitekeys)) ? array_key_first($sitekeys) : '';
    }

    return $site_key;
}

function sbp_get_turnstile_site_secret(): string {
    $site_secret = '';

    // since the keys are already stored by CF7 plugin, we are using the same variables instead of defining new consts
    if (class_exists('WPCF7')) {
        $sitekeys = WPCF7::get_option('turnstile');
        $site_secret = !empty($sitekeys) ? reset($sitekeys) : '';
    }

    return $site_secret;
}

function sbp_verify_turnstile_response($response) {
    // Your secret key from Turnstile admin dashboard
    $site_secret = sbp_get_turnstile_site_secret();

    $body = [
        'secret'   => $site_secret,
        'response' => $response,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? null, // optional but recommended
    ];

    $result = wp_remote_post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        [
            'body'      => $body,
            'timeout'   => 10,
            'headers'   => [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ],
        ]
    );

    if (is_wp_error($result)) {
        return false; // Request failed (network error, timeout, etc.)
    }

    $body = wp_remote_retrieve_body($result);
    if (empty($body)) {
        return false;
    }

    $resultData = json_decode($body, true);

    return isset($resultData['success']) && $resultData['success'] === true;
}