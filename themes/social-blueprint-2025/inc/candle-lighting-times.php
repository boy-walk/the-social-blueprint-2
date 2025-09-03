<?php
function sb_shabbat_times_hebcal($args = []) {
  $args = wp_parse_args($args, [
      'geonameid' => 3448439, // Melbourne
      'b'         => 18,      // candle-lighting minutes before sunset
      'M'         => 'on',    // havdalah at nightfall (tzeit)
      'm'         => null,    // or set fixed minutes (e.g. 50) and omit M
      'ttl'       => 900,     // cache seconds
  ]);

  $cache_key = 'sb_hebcal_' . md5(serialize([$args['geonameid'],$args['b'],$args['M'],$args['m']]));
  if ($cached = get_transient($cache_key)) return $cached;

  $q = [
      'cfg'       => 'json',
      'geonameid' => (int)$args['geonameid'],
      'b'         => (int)$args['b'],
  ];
  if (!empty($args['M'])) $q['M'] = 'on';
  if (is_numeric($args['m'])) { unset($q['M']); $q['m'] = (int)$args['m']; }

  $url = add_query_arg($q, 'https://www.hebcal.com/shabbat');

  $resp = wp_remote_get($url, [
      'timeout'    => 12,
      'redirection'=> 3,
      'headers'    => ['User-Agent' => 'TSB/1 (+thesocialblueprint.org.au)'],
  ]);
  if (is_wp_error($resp)) return false;
  if ((int)wp_remote_retrieve_response_code($resp) !== 200) return false;

  $json = json_decode(wp_remote_retrieve_body($resp), true);
  if (!is_array($json) || empty($json['items'])) return false;

  $now = current_time('timestamp');
  $out = [
      'source' => $url,
      'tz'     => wp_timezone_string(),
      'generated' => wp_date('c', $now),
  ];

  foreach ($json['items'] as $it) {
      if (empty($it['category']) || empty($it['date'])) continue;
      $ts = strtotime($it['date']);
      if (!$ts || $ts < $now) continue;

      if ($it['category'] === 'candles' && empty($out['candle_lighting'])) {
          $out['candle_lighting'] = [
              'timestamp' => $ts,
              'iso'       => wp_date('c', $ts),
              'title'     => isset($it['title']) ? $it['title'] : 'Candle lighting',
          ];
      } elseif ($it['category'] === 'havdalah' && empty($out['havdalah'])) {
          $out['havdalah'] = [
              'timestamp' => $ts,
              'iso'       => wp_date('c', $ts),
              'title'     => isset($it['title']) ? $it['title'] : 'Havdalah',
          ];
      }
      if (!empty($out['candle_lighting']) && !empty($out['havdalah'])) break;
  }

  set_transient($cache_key, $out, max(60, (int)$args['ttl']));
  return $out;
}
