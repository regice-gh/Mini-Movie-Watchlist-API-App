function main() {
    initNavigation();
    AddMovie();
    UpdateMovie();
    DeleteMovie();
    ViewMovie();
}

function AddMovie() {
    // Function to add a movie to the watchlist
}
function UpdateMovie() {
    // Function to update a movie in the watchlist
}
function DeleteMovie() {
    // Function to delete a movie from the watchlist
}
function ViewMovie() {
    // Function to view a movie in the watchlist
}

function initNavigation() {
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
}