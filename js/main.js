

//#region Navigation UI
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            const opened = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });

        // Close menu after clicking a link (mobile)
        menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                if (menu.classList.contains('open')) {
                    menu.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
});
//#endregion