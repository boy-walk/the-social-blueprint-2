<?php
$content = get_field('content');
if ($content): ?>
  <div class="prose prose-lg max-w-none">
    <?php echo wp_kses_post($content); ?>
  </div>
<?php endif; ?>
