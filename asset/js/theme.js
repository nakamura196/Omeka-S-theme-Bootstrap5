// Replaces the parts of Bootstrap's JavaScript this theme needs:
// the mobile menu toggle and the back-to-top button.
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
});
