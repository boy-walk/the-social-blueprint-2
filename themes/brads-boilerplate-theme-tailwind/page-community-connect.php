<?php
/**
 * Template Name: Community Connection Hub
 */

get_header(); ?>

<div id="community-hub-root" class="min-h-screen bg-white text-schemesOnSurface">
  <!-- React will mount here -->
</div>

<script type="text/javascript">
  window.__COMMUNITY_HUB_PROPS__ = <?php echo json_encode([]); ?>;
</script>

<?php get_footer(); ?>
