(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const root = document.querySelector('#tribe-community-events.form');
    if (!root) return;

    // Grab the title block (TEC usually prints .events-community-post-title)
    const titleBlock = root.querySelector('.events-community-post-title');
    // Grab the description block: look for the textarea and lift its closest container
    const descTextarea = root.querySelector('textarea#post_content');
    const descBlock = descTextarea ? descTextarea.closest('.events-community-post-content, .tribe-section, div') : null;

    // Featured image uploader lives in a tribe section
    const uploader = root.querySelector('.tribe-section-image-uploader');

    // Create a two-column wrapper above the first main section
    if (titleBlock && uploader) {
      const wrapper = document.createElement('section');
      wrapper.className = 'sbp-basic';
      const left = document.createElement('div');
      left.className = 'sbp-left';
      const right = document.createElement('div');
      right.className = 'sbp-right';

      // Insert wrapper before the first TEC section (keeps DOM order intact)
      const firstSection = root.querySelector('#tribe-events-pg-template .tribe-section') || root.querySelector('#tribe-events-pg-template > *');
      (firstSection ? firstSection.parentNode : root).insertBefore(wrapper, firstSection || null);
      wrapper.appendChild(left);
      wrapper.appendChild(right);

      left.appendChild(titleBlock);
      if (descBlock) left.appendChild(descBlock);
      right.appendChild(uploader);
    }

    // Optional: add small headings
    const addHeading = (el, text) => {
      if (!el) return;
      const h = document.createElement('div');
      h.className = 'sbp-section-title';
      h.textContent = text;
      el.prepend(h);
    };
    addHeading(root.querySelector('.sbp-left'), 'Basic Event Info');
    addHeading(root.querySelector('.sbp-right'), 'Event Image');
    const dt = root.querySelector('.tribe-events-community-details, .tribe-events-community-date, .tribe-section--date'); // varies by version
    addHeading(dt, 'Date & Time');
  });
})();
