// Additive UI behavior. Independent of script.js — the original #menu jQuery handler
// (toggling "hidden" on .toggle-sidenav) is untouched and still runs exactly as before.
// This file only adds: (1) category chip active-state, (2) a mobile backdrop for the
// off-canvas sidebar drawer, kept in sync via MutationObserver (see note below).

document.addEventListener('DOMContentLoaded', function () {
    // --- Category chip active state ---
    const chips = document.querySelectorAll('#chips .chip');
    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (c) {
                c.classList.remove('bg-white', 'text-black');
                c.classList.add('bg-chip');
                c.setAttribute('aria-selected', 'false');
            });
            chip.classList.remove('bg-chip');
            chip.classList.add('bg-white', 'text-black');
            chip.setAttribute('aria-selected', 'true');
        });
    });

    // --- Mobile off-canvas backdrop ---
    const menuBtn = document.getElementById('menu');
    const backdrop = document.getElementById('sidenav-backdrop');
    const sidenav = document.getElementById('sidenav');

    if (!menuBtn || !backdrop || !sidenav) return;

    function isMobile() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    // Single source of truth: the backdrop and aria-expanded are always derived
    // FROM the sidenav's actual current class list, never guessed ahead of it.
    //
    // Why not just read sidenav.classList inside a click handler on the menu button,
    // like before? script.js registers its toggle as a DELEGATED handler on `document`
    // ($(document).on('click', '#menu', ...)), while a handler attached directly to
    // the #menu button fires during the event's target phase — which always happens
    // BEFORE the event bubbles up to a delegated listener on document. So reading
    // sidenav's class list inside a direct click handler on #menu was reading the
    // state one step *before* script.js had toggled it — permanently one click behind.
    //
    // A MutationObserver sidesteps the ordering question entirely: it fires only
    // after the class attribute has actually changed, regardless of which handler
    // changed it or in what order handlers ran.
    function syncBackdropToSidenav() {
        const open = !sidenav.classList.contains('hidden');
        const shouldShowBackdrop = open && isMobile();

        backdrop.classList.toggle('hidden', !shouldShowBackdrop);
        menuBtn.setAttribute('aria-expanded', String(open));
    }

    const observer = new MutationObserver(syncBackdropToSidenav);
    observer.observe(sidenav, { attributes: true, attributeFilter: ['class'] });

    // Clicking the backdrop closes the drawer by re-triggering the exact same
    // #menu click script.js listens for — single toggle codepath, no duplicated logic.
    backdrop.addEventListener('click', function () {
        menuBtn.click();
    });

    // Escape key closes the drawer the same way, for keyboard users.
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isMobile() && !sidenav.classList.contains('hidden')) {
            menuBtn.click();
        }
    });

    // If the viewport is resized past the mobile breakpoint while the drawer is open
    // (e.g. rotating a tablet, or resizing a browser window), force the backdrop off —
    // the desktop layout has no backdrop concept, so nothing should linger.
    window.addEventListener('resize', syncBackdropToSidenav);

    // Set correct initial state on load (in case the sidenav ever starts open).
    syncBackdropToSidenav();
});
