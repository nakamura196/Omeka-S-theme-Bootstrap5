// Replaces the parts of Bootstrap's JavaScript this theme needs (the mobile menu toggle and
// the back-to-top button), plus the grid / list switch, sorting and page size on change on
// browse pages, and the copy / cite / share buttons of item and media pages.
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

    // Sort, or change the page size, as soon as an option is picked.
    document.querySelectorAll('.sort-selector select, .per-page select').forEach(function (select) {
        select.addEventListener('change', function () {
            select.form.submit();
        });
    });

    // A short notice at the bottom of the screen (read out by screen readers too).
    var toast = document.querySelector('.theme-toast');
    var toastTimer;
    var notify = function (message) {
        if (!toast) {
            return;
        }
        toast.textContent = message;
        toast.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.hidden = true;
        }, 2500);
    };

    // Copy buttons (page URL, citation). Messages come from the data attributes of .resource-actions.
    var messages = document.querySelector('.resource-actions');
    document.querySelectorAll('[data-copy]').forEach(function (button) {
        button.addEventListener('click', function () {
            var text = button.getAttribute('data-copy');
            var done = function () {
                notify(messages.getAttribute('data-copied'));
            };
            var failed = function () {
                notify(messages.getAttribute('data-copy-failed'));
            };
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(done, failed);
            } else {
                failed();
            }
        });
    });

    // Citation dialog.
    document.querySelectorAll('[data-dialog]').forEach(function (button) {
        var dialog = document.getElementById(button.getAttribute('data-dialog'));
        if (!dialog || typeof dialog.showModal !== 'function') {
            return;
        }
        button.addEventListener('click', function () {
            dialog.showModal();
        });
        // Close when the backdrop is clicked.
        dialog.addEventListener('click', function (event) {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    });

    // Share menu: close it on a click elsewhere or with Escape.
    document.querySelectorAll('.share-menu').forEach(function (menu) {
        document.addEventListener('click', function (event) {
            if (menu.open && !menu.contains(event.target)) {
                menu.open = false;
            }
        });
        menu.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && menu.open) {
                menu.open = false;
                menu.querySelector('summary').focus();
            }
        });
    });
});
