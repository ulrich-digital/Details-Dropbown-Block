document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.details-dropdown-frontend').forEach((dropdown) => {
        const toggle = dropdown.querySelector('[data-toggle]');
        const content = dropdown.querySelector('[data-content]');

        if (!toggle || !content) return;

        // Start: collapsed
        content.style.maxHeight = '0px';
        content.style.overflow = 'hidden';

        toggle.addEventListener('click', () => {
            const isExpanded = content.classList.contains('is-open');

            content.classList.toggle('is-open', !isExpanded);
            toggle.classList.toggle('open', !isExpanded);

            // Animate
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0px';
            }
			// Event feuern
			dropdown.dispatchEvent(new CustomEvent('dropdownToggled', { bubbles: true }));
			//console.log("plugin feuert");
        });
    });
});
