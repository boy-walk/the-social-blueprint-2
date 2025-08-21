<?php
/**
 * Plugin Name: TSB Single Event Probe
 */
if ( ! function_exists('tsb_debug') ) {
  function tsb_debug($label, $data = null, $channel = 'probe') {
    $up = wp_upload_dir();
    $dir = trailingslashit($up['basedir']) . 'tsb-debug';
    if ( ! is_dir($dir) ) { wp_mkdir_p($dir); }
    @file_put_contents(
      $dir . "/{$channel}.log",
      json_encode(['time'=>current_time('mysql'),'label'=>$label,'data'=>$data]) . PHP_EOL,
      FILE_APPEND
    );
  }
}

function tsb_probe_here($label,$data=null){ if (is_singular('tribe_events')) tsb_debug($label,$data,'single-event'); }

add_action('template_redirect', function(){ tsb_probe_here('template_redirect'); });
add_action('get_header',        function(){ tsb_probe_here('get_header'); });
add_action('wp_head',           function(){ tsb_probe_here('wp_head'); });

add_action('tribe_events_single_event_before_the_content', function(){
  tsb_probe_here('before_event_content');
}, -999);

add_filter('the_content', function($c){
  if (is_singular('tribe_events')) tsb_probe_here('the_content_start', strlen($c));
  return $c;
}, 1);

add_action('tribe_events_single_event_after_the_content', function(){
  tsb_probe_here('after_event_content');
}, 999);

add_action('wp_footer', function(){ tsb_probe_here('wp_footer'); });
add_action('shutdown', function(){ tsb_probe_here('shutdown_last_error', error_get_last()); });
