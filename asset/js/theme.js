// Replaces the parts of Bootstrap's JavaScript this theme needs (the mobile menu toggle and
// the back-to-top button), plus the grid / list switch and sorting on change on browse pages.
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.navbar-toggler[aria-controls]').forEach(function (toggler) {
        var target = document.getElementById(toggler.getAttribute('aria-controls'));
        if (!target) {
            return;
        }
        toggler.addEventListener('click', function () {
            var open = target.classList.toggle('show');
            toggler.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    });

    var backToTop = document.getElementById('btn-back-to-top');
    if (backToTop) {
        var update = function () {
            backToTop.hidden = window.scrollY <= 20;
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0 });
            document.getElementById('content').focus({ preventScroll: true });
        });
    }

    // Grid / list switch. The choice is remembered in this browser only; if storage is
    // unavailable (private windows etc.) the theme setting's default is used.
    var storageKey = 'omeka-s-theme-bs5:browse-layout';
    document.querySelectorAll('.view-toggle[data-target]').forEach(function (group) {
        var list = document.getElementById(group.getAttribute('data-target'));
        if (!list) {
            return;
        }
        var apply = function (layout) {
            list.classList.toggle('is-grid', layout === 'grid');
            list.classList.toggle('is-list', layout === 'list');
            group.querySelectorAll('[data-layout]').forEach(function (button) {
                button.setAttribute('aria-pressed', button.getAttribute('data-layout') === layout ? 'true' : 'false');
            });
        };
        try {
            var saved = window.localStorage.getItem(storageKey);
            if (saved === 'grid' || saved === 'list') {
                apply(saved);
            }
        } catch (e) {}
        group.addEventListener('click', function (event) {
            var button = event.target.closest('[data-layout]');
            if (!button) {
                return;
            }
            var layout = button.getAttribute('data-layout');
            apply(layout);
            try {
                window.localStorage.setItem(storageKey, layout);
            } catch (e) {}
        });
    });

    // Sort as soon as a sort option is picked.
    document.querySelectorAll('.sort-selector select').forEach(function (select) {
        select.addEventListener('change', function () {
            select.form.submit();
        });
    });
});
