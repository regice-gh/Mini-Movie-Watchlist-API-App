async function fetchMovies() {
  try {

    const response = await fetch('http://localhost:3000/api/movies');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Parse JSON response in object
    const movies = await response.json();

    const movieListElement = document.getElementById('movieList');
    if (!movieListElement) return; // nothing to render on this page

    movieListElement.innerHTML = '';

    movies.forEach(movie => {
        const id = movie.id || movie._id || movie.ID;

        const card = document.createElement('article');
        card.className = 'card';

        const poster = document.createElement('img');
        poster.className = 'poster';
        poster.alt = movie.title + ' poster';
        poster.width = 72;
        poster.height = 100;
        poster.src =  ('img/' + (movie.title ? movie.title.toLowerCase().replace(/\s+/g,'') : 'placeholder') + '.png')|| movie.img || movie.poster_url;

        const body = document.createElement('div');
        body.className = 'card-body';

        const h3 = document.createElement('h3');
        h3.className = 'card-title';
        h3.textContent = `${movie.title} (${movie.year || ''})`;

        const p = document.createElement('p');
        p.className = 'card-text';
        p.textContent = `${movie.genre || 'Unknown genre'} • Rating: ${movie.rating || '-'} • Watched: ${movie.watched ? 'Yes' : 'No'}`;

        const openBtn = document.createElement('button');
        openBtn.type = 'button';
        openBtn.textContent = 'Details';
        openBtn.setAttribute('aria-label', `Open details for ${movie.title}`);
        openBtn.addEventListener('click', () => {
            window.location.href = `movie.html?id=${encodeURIComponent(id)}`;
        });

        body.appendChild(h3);
        body.appendChild(p);
        body.appendChild(openBtn);

        card.appendChild(poster);
        card.appendChild(body);

        movieListElement.appendChild(card);
    });

  } catch (error) {
    console.error('Could not fetch movies:', error);
    const movieListElement = document.getElementById('movieList');
    movieListElement.innerHTML = '<li>Failed to load movies.</li>';
  }
}
async function fetchMyMovies() {
    try {
        const response = await fetch('http://localhost:3000/api/movies');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movies = await response.json();

        const movieListElement = document.getElementById('myMovieList');
        const placeholder = document.getElementById('myPlaceholder');
        if (!movieListElement) return;
        movieListElement.innerHTML = ''; // Clear existing list

        let watchedCount = 0;
        movies.forEach(movie => {
            if (movie.watched) {
                watchedCount++;
                const card = document.createElement('div');
                card.className = 'card';

                const poster = document.createElement('img');
                poster.className = 'poster';
                poster.alt = movie.title + ' poster';
                poster.src =  ('img/' + (movie.title ? movie.title.toLowerCase().replace(/\s+/g,'') : 'placeholder') + '.png')|| movie.img || movie.poster_url;


                const body = document.createElement('div');
                body.className = 'card-body';

                const h3 = document.createElement('h3');
                h3.className = 'card-title';
                h3.textContent = `${movie.title} (${movie.year || ''})`;

                const p = document.createElement('p');
                p.className = 'card-text';
                p.textContent = `${movie.genre || 'Unknown genre'} • Rating: ${movie.rating || '-'} `;

                card.appendChild(poster);
                body.appendChild(h3);
                body.appendChild(p);
                card.appendChild(body);

                movieListElement.appendChild(card);
            }
        });

        // hide placeholder if watched movies exist
        if (placeholder) {
            if (watchedCount > 0) placeholder.style.display = 'none';
            else placeholder.style.display = '';
        }


    } catch (error) {
        console.error('Could not fetch movies:', error);
    }
}

fetchMovies();
fetchMyMovies();


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
