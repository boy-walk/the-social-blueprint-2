<?php
function sb_shabbat_times_hebcal($args = []) {
  $args = wp_parse_args($args, [
    'geonameid' => 2158177,                 // Melbourne
    'tzid'      => 'Australia/Melbourne',
    'b'         => 18,
    'M'         => 'on',
    'm'         => null,
    'ttl'       => 900,
  ]);

  $cache_key = 'sb_hebcal_v3_' . md5(serialize([
    $args['geonameid'],$args['b'],$args['M'],$args['m'],$args['tzid']
  ]));
  if ($cached = get_transient($cache_key)) return $cached;

  $q = [
    'cfg'       => 'json',
    'geo'       => 'geoname',
    'geonameid' => (int)$args['geonameid'],
    'b'         => (int)$args['b'],
    'tzid'      => (string)$args['tzid'],
  ];
  if (!empty($args['M'])) $q['M'] = 'on';
  if (is_numeric($args['m'])) { unset($q['M']); $q['m'] = (int)$args['m']; }

  $url  = 'https://www.hebcal.com/shabbat?' . http_build_query($q);
  $resp = wp_remote_get($url, ['timeout'=>12,'headers'=>['User-Agent'=>'TSB/1 (+thesocialblueprint.org.au)']]);
  if (is_wp_error($resp) || (int)wp_remote_retrieve_response_code($resp) !== 200) return false;

  $json = json_decode(wp_remote_retrieve_body($resp), true);
  if (!is_array($json) || empty($json['items'])) return false;

  // sanity check the tz Hebcal says it used
  if (empty($json['location']['tzid']) || $json['location']['tzid'] !== $args['tzid']) {
    // proceed anyway but you can log if desired
  }

  $tz  = wp_timezone();
  $now = (new DateTimeImmutable('now', $tz))->getTimestamp();

  $out = ['source'=>$url,'tz'=>wp_timezone_string(),'generated'=>wp_date('c', $now)];
  $haveC = $haveH = false;

  foreach ($json['items'] as $it) {
    if (empty($it['category']) || empty($it['date'])) continue;
    if ($it['category'] !== 'candles' && $it['category'] !== 'havdalah') continue;

    try {
      $d     = new DateTimeImmutable($it['date']); // respects embedded offset
      $local = $d->setTimezone($tz);
      $ts    = $local->getTimestamp();
    } catch (Exception $e) { continue; }

    if ($ts < $now) continue;

    if ($it['category'] === 'candles' && !$haveC) {
      $out['candle_lighting'] = [
        'timestamp'=>$ts,
        'iso'=>wp_date('c',$ts),
        'title'=>$it['title'] ?? 'Candle lighting',
        'date'=>wp_date(get_option('date_format'),$ts),
        'time'=>wp_date(get_option('time_format'),$ts),
      ];
      $haveC = true;
    } elseif ($it['category'] === 'havdalah' && !$haveH) {
      $out['havdalah'] = [
        'timestamp'=>$ts,
        'iso'=>wp_date('c',$ts),
        'title'=>$it['title'] ?? 'Havdalah',
        'date'=>wp_date(get_option('date_format'),$ts),
        'time'=>wp_date(get_option('time_format'),$ts),
      ];
      $haveH = true;
    }
    if ($haveC && $haveH) break;
  }

  set_transient($cache_key, $out, max(60, (int)$args['ttl']));
  return $out ?: false;
}
