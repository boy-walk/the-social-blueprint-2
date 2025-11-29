<?php
/*
Template Name: Topic Directory
*/
get_header(); 

// Configure the groups you want to show: label => taxonomy slug
$groups = [
  [ 'label' => 'Topics',    'tax' => 'topic_tag' ],
  [ 'label' => 'Audiences', 'tax' => 'audience_tag' ],
  [ 'label' => 'Theme',     'tax' => 'theme' ],
];

// Build the data structure
$data = [];
foreach ($groups as $group) {
  $taxonomy = $group['tax'];
  $label    = $group['label'];
  
  $roots = get_terms([
    'taxonomy'   => $taxonomy,
    'parent'     => 0,
    'hide_empty' => false,
    'orderby'    => 'name',
    'order'      => 'ASC',
  ]);
  
  $roots_data = [];
  if (!empty($roots) && !is_wp_error($roots)) {
    foreach ($roots as $root) {
      $children = get_terms([
        'taxonomy'   => $taxonomy,
        'parent'     => $root->term_id,
        'hide_empty' => false,
        'orderby'    => 'name',
        'order'      => 'ASC',
      ]);
      
      $children_data = [];
      if (!empty($children) && !is_wp_error($children)) {
        foreach ($children as $child) {
          $children_data[] = [
            'id'   => $child->term_id,
            'name' => $child->name,
            'link' => get_term_link($child),
          ];
        }
      }
      
      $roots_data[] = [
        'id'       => $root->term_id,
        'name'     => $root->name,
        'link'     => get_term_link($root),
        'children' => $children_data,
      ];
    }
  }
  
  $data[] = [
    'label' => $label,
    'tax'   => $taxonomy,
    'roots' => $roots_data,
  ];
}
?>

<main class="bg-schemesSurface text-schemesOnSurface">
  <!-- Hero Section with Search -->
  <div class="bg-schemesPrimaryFixed">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-10 lg:py-12">
      <h1 class="Blueprint-headline-small sm:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface mb-4 sm:mb-6">
        Explore Topics
      </h1>
    </div>
  </div>

  <!-- Topics Grid -->
  <div class="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
    <?php foreach ($data as $group) : ?>
      <section class="mb-12 sm:mb-16 lg:mb-20">
        <h2 class="Blueprint-title-large-emphasized sm:Blueprint-headline-small-emphasized mb-6 sm:mb-8 text-schemesOnSurface">
          <?php echo esc_html($group['label']); ?>
        </h2>
        
        <?php if (!empty($group['roots'])) : ?>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
            <?php foreach ($group['roots'] as $root) : ?>
              <div class="flex flex-col">
                <h3 class="Blueprint-title-medium mb-3 text-schemesOnSurface">
                  <a href="<?php echo esc_url($root['link']); ?>" class="hover:underline hover:text-schemesPrimary transition-colors">
                    <?php echo esc_html($root['name']); ?>
                  </a>
                </h3>
                
                <?php if (!empty($root['children'])) : ?>
                  <ul class="space-y-2 Blueprint-body-medium text-schemesOnSurfaceVariant">
                    <?php foreach ($root['children'] as $child) : ?>
                      <li class="leading-relaxed">
                        <a href="<?php echo esc_url($child['link']); ?>" class="hover:underline hover:text-schemesPrimary transition-colors">
                          <?php echo esc_html($child['name']); ?>
                        </a>
                      </li>
                    <?php endforeach; ?>
                  </ul>
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
          </div>
        <?php else : ?>
          <p class="text-schemesOnSurfaceVariant Blueprint-body-medium">
            No terms found for <?php echo esc_html($group['label']); ?>.
          </p>
        <?php endif; ?>
      </section>
    <?php endforeach; ?>
  </div>
</main>

<?php get_footer(); ?>