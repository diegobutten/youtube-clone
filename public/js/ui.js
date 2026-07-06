// Additive UI behavior. Independent of script.js — the original #menu jQuery handler
// (toggling "hidden" on .toggle-sidenav) is untouched and still runs exactly as before.
// This file only adds: (1) category chip active-state, (2) a mobile backdrop for the
// off-canvas sidebar drawer.

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
    // Mirrors (never replaces) the existing #menu toggle: on small screens, when the
    // sidebar becomes visible we also show a backdrop; clicking the backdrop closes
    // the drawer by re-triggering the exact same #menu click the original code listens for.
    const menuBtn = document.getElementById('menu');
    const backdrop = document.getElementById('sidenav-backdrop');
    const sidenav = document.getElementById('sidenav');

    function isMobile() {
        return window.matchMedia('(max-width: 767px)').matches;
    }

    if (menuBtn && backdrop && sidenav) {
        menuBtn.addEventListener('click', function () {
            if (!isMobile()) return;
            const nowHidden = sidenav.classList.contains('hidden');
            backdrop.classList.toggle('hidden', nowHidden);
            menuBtn.setAttribute('aria-expanded', String(!nowHidden));
        });

        backdrop.addEventListener('click', function () {
            menuBtn.click();
        });
    }
});
