<?php
// 1️⃣ Add a custom column for the YouTube field
add_filter('manage_podcast_posts_columns', function ($columns) {
    $columns['podcast_video_url'] = __('YouTube Video URL', 'textdomain');
    return $columns;
});

// 2️⃣ Display the value in that column
add_action('manage_podcast_posts_custom_column', function ($column, $post_id) {
    if ($column === 'podcast_video_url') {
        $value = get_field('podcast_video_url', $post_id);
        echo '<span class="podcast-video-url" data-video-url="' . esc_attr($value) . '">' . esc_html($value) . '</span>';
    }
}, 10, 2);

// 3️⃣ Add Quick Edit field markup
add_action('quick_edit_custom_box', function ($column_name, $post_type) {
    if ($post_type !== 'podcast' || $column_name !== 'podcast_video_url') return;
    ?>
    <fieldset class="inline-edit-col-left">
        <div class="inline-edit-col">
            <label>
                <span class="title"><?php _e('YouTube Video URL', 'textdomain'); ?></span>
                <span class="input-text-wrap">
                    <input type="text" name="podcast_video_url" class="podcast_video_url_field" value="">
                </span>
            </label>
        </div>
    </fieldset>
    <?php
}, 10, 2);

// 4️⃣ Save the Quick Edit field value
add_action('save_post_podcast', function ($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;
    if (isset($_POST['podcast_video_url'])) {
        update_field('podcast_video_url', sanitize_text_field($_POST['podcast_video_url']), $post_id);
    }
});

// 5️⃣ JS to populate the field when Quick Edit opens
add_action('admin_footer-edit.php', function () {
    global $post_type;
    if ($post_type !== 'podcast') return;
    ?>
    <script>
    jQuery(function($) {
        const wpInlineEdit = inlineEditPost.edit;
        inlineEditPost.edit = function(id) {
            wpInlineEdit.apply(this, arguments);

            let postId = 0;
            if (typeof(id) === 'object') {
                postId = parseInt(this.getId(id));
            }

            if (postId > 0) {
                const row = $('#post-' + postId);
                const editRow = $('#edit-' + postId);
                const value = row.find('.podcast-video-url').data('video-url') || '';
                editRow.find('input[name="podcast_video_url"]').val(value);
            }
        };
    });
    </script>
    <?php
});
