<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <script>
      (function(w, d, t, h, s, n) {
        w.FlodeskObject = n;
        var fn = function(){ (w[n].q = w[n].q || []).push(arguments); };
        w[n] = w[n] || fn;

        var f = d.getElementsByTagName(t)[0];
        var v = '?v=' + Math.floor(new Date().getTime() / (120 * 1000)) * 60;

        // Use ONE slash between host and path:
        h = 'https://assets.flodesk.com';   // no trailing slash
        s = '/universal';                   // leading slash OK now

        var sm = d.createElement(t);
        sm.async = true;
        sm.type = 'module';
        sm.src = h + s + '.mjs' + v;
        f.parentNode.insertBefore(sm, f);

        var sn = d.createElement(t);
        sn.async = true;
        sn.noModule = true;
        sn.src = h + s + '.js' + v;
        f.parentNode.insertBefore(sn, f);
      })(window, document, 'script', 'https://assets.flodesk.com', '/universal', 'fd');
    </script>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
  </head>
  <body <?php body_class(); ?>>
  <div
  id="header"
  class="sticky z-[1000]"
  style="top: var(--wp-admin--admin-bar--height, 0px);"
  isUserLoggedIn="<?php echo is_user_logged_in() ? 'true' : 'false'; ?>"
></div>
    