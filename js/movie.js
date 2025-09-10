
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
    poster.src =  ('img/' + (movie.title ? movie.title.toLowerCase().replace(/\s+/g,'') : 'placeholder') + '.png');

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

    const watchlistBtn = document.createElement('button');
    watchlistBtn.type = 'button';
    watchlistBtn.textContent = movie.watchlist ? 'On Watchlist' : 'Off Watchlist';
    watchlistBtn.addEventListener('click', async () => {
        try {
            const url = `http://localhost:3000/api/movies/${encodeURIComponent(id)}/watchlist`;
            const res = await fetch(url, { method: 'PATCH' });  
            if (!res.ok) throw new Error('Failed to update movie'); 
            const updatedMovie = await res.json();
            movie.watchlist = updatedMovie.watchlist;   
            watchlistBtn.textContent = movie.watchlist 
            ? 'On Watchlist' 
            : 'Off Watchlist';
            watchlistBtn.setAttribute(
                'aria-label', 
                `${movie.watchlist ? 'On Watchlist' : 'Off Watchlist'} for ${movie.title}`);
            window.location.reload();
        }
        catch (err) {
            console.error('Error updating movie:', err);
            alert('Could not update movie. See console for details.');
            return;
        }
    });
    

    const back = document.createElement('a');
    back.href = 'index.html#my-movies';
    back.textContent = '← Back to list';
    back.className = 'button-link';

    body.appendChild(title);
    body.appendChild(genre);
    body.appendChild(rating);
    body.appendChild(watched);
    body.appendChild(watchlistBtn);
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
