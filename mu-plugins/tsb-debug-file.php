<?php
/**
 * Tiny JSON-line file logger.
 * Usage anywhere: tsb_debug('label', ['key' => 'value'], 'group');
 */

if (!defined('TSB_DEBUG_ENABLED')) {
  define('TSB_DEBUG_ENABLED', true);            // flip to false to silence
}
if (!defined('TSB_DEBUG_MAX_BYTES')) {
  define('TSB_DEBUG_MAX_BYTES', 2 * 1024 * 1024); // 2MB rotation per daily file
}

function tsb_debug_dir() {
  $uploads = wp_upload_dir(null, false);
  $base    = trailingslashit($uploads['basedir']) . 'tsb-debug';
  if (!is_dir($base)) {
    wp_mkdir_p($base);
    @file_put_contents($base . '/index.php', "<?php // Silence is golden.\n");
    @file_put_contents($base . '/.htaccess', "Require all denied\n"); // Apache hardening
  }
  return $base;
}

function tsb_debug_path($group = 'general') {
  $slug = sanitize_key($group) ?: 'general';
  return tsb_debug_dir() . '/' . date('Y-m-d') . '-' . $slug . '.log';
}

/** Append a JSON line to a daily log file (safe & minimal). */
function tsb_debug($label, $payload = null, $group = 'general') {
  if (!TSB_DEBUG_ENABLED) return;

  // redact common secret keys
  if (is_array($payload)) {
    foreach (['password','pass','pwd','token','authorization','nonce'] as $k) {
      if (array_key_exists($k, $payload)) $payload[$k] = '[redacted]';
    }
  }

  $ctx = [
    'time'   => current_time('mysql'),
    'label'  => (string) $label,
    'url'    => isset($_SERVER['REQUEST_URI']) ? esc_url_raw($_SERVER['REQUEST_URI']) : '',
    'method' => $_SERVER['REQUEST_METHOD'] ?? '',
    'ip'     => $_SERVER['REMOTE_ADDR'] ?? '',
    'user'   => get_current_user_id() ?: null,
    'mem'    => memory_get_usage(true),
  ];

  $line = wp_json_encode(['ctx' => $ctx, 'data' => $payload], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

  $file = tsb_debug_path($group);
  if (file_exists($file) && filesize($file) > TSB_DEBUG_MAX_BYTES) {
    @rename($file, $file . '.1'); // simple rotate
  }
  @file_put_contents($file, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

// wp-content/mu-plugins/tsb-debug-file.php (add near the bottom)

// Log PHP warnings/notices (non-fatal)
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
  if (defined('TSB_DEBUG_ENABLED') && !TSB_DEBUG_ENABLED) return false;
  tsb_debug('php:error', [
    'type' => $errno, 'message' => $errstr, 'file' => $errfile, 'line' => $errline
  ], 'php');
  return false; // let WP handle its normal flow
});

// Log fatals on shutdown
register_shutdown_function(function () {
  if (defined('TSB_DEBUG_ENABLED') && !TSB_DEBUG_ENABLED) return;
  $e = error_get_last();
  if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
    tsb_debug('php:fatal', $e, 'php');
  }
});
