// Render movie details based on ?id=...

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

async function fetchMovie(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/movies/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Failed to fetch movie');
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

function renderMovie(movie) {
    const card = document.getElementById('detail-card');
    if (!card) return;
    card.innerHTML = '';

    if (!movie) {
        card.textContent = 'Movie not found.';
        return;
    }

    const poster = document.createElement('img');
    poster.className = 'poster';
    poster.alt = movie.title + ' poster';
    poster.src =  ('img/' + (movie.title ? movie.title.toLowerCase().replace(/\s+/g,'') : 'placeholder') + '.png')|| movie.img || movie.poster_url;

    poster.style.width = '200px';
    poster.style.height = '300px';

    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = `${movie.title} (${movie.year || ''})`;

    const genre = document.createElement('p');
    genre.className = 'card-text';
    genre.textContent = 'Genre: ' + (movie.genre || 'Unknown');

    const rating = document.createElement('p');
    rating.className = 'card-text';
    rating.textContent = 'Rating: ' + (movie.rating || '-');

    const watched = document.createElement('p');
    watched.className = 'card-text';
    watched.textContent = 'Watched: ' + (movie.watched ? 'Yes' : 'No');

    const back = document.createElement('a');
    back.href = 'index.html#my-movies';
    back.textContent = '← Back to list';
    back.className = 'button-link';

    body.appendChild(title);
    body.appendChild(genre);
    body.appendChild(rating);
    body.appendChild(watched);
    body.appendChild(back);

    card.appendChild(poster);
    card.appendChild(body);
}

(async function () {
    const id = getQueryParam('id');
    if (!id) {
        document.getElementById('detail-card').textContent = 'No movie id provided.';
        return;
    }
    const movie = await fetchMovie(id);
    renderMovie(movie);
})();
