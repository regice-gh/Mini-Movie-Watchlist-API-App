async function fetchMovies() {
    try {
        console.log('Fetching movies...');
        const response = await fetch('http://localhost:3000/api/movies');


        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const movies = await response.json();

        const movieListElement = document.getElementById('movieList');
        const placeholder = document.getElementById('moviesPlaceholder');
        let moviesCount = 0;

        if (!movieListElement) return;

        movieListElement.innerHTML = '';

        movies.forEach(movie => {
            moviesCount++;
            const id = movie.id || movie._id || movie.ID;

            const card = document.createElement('article');
            card.className = 'card';

            const poster = document.createElement('img');
            poster.className = 'poster';
            poster.alt = movie.title + ' poster';
            poster.width = 72;
            poster.height = 100;
            poster.src = ('img/' + (movie.title ? movie.title.toLowerCase().replace(/\s+/g, '') : 'placeholder') + '.png') || movie.poster_url;
            poster.onerror = function () {
                this.src = 'img/placeholder.png';
            };

            const body = document.createElement('div');
            body.className = 'card-body';

            const h3 = document.createElement('h3');
            h3.className = 'card-title';
            h3.textContent = `${movie.title} (${movie.year || 'Unknown'})`;

            const p = document.createElement('p');
            p.className = 'card-text';
            p.textContent = `${movie.genre || 'Unknown genre'} 
            • Rating: ${movie.rating || 'Not rated'} 
            • Watched: ${movie.watched ? 'Yes' : 'No'}`;

            const openBtn = document.createElement('button');
            openBtn.type = 'button';
            openBtn.textContent = 'Watch';
            openBtn.setAttribute('aria-label', `Open details for ${movie.title}`);
            openBtn.addEventListener('click', () => {
                window.location.href = `movie.html?id=${encodeURIComponent(id)}`;
            });

            const watchlistBtn = document.createElement('button');
            watchlistBtn.type = 'button';
            watchlistBtn.textContent = movie.watchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
            watchlistBtn.className = movie.watchlist ? 'btn-secondary' : 'btn-primary';
            watchlistBtn.addEventListener('click', async () => {
                try {
                    watchlistBtn.disabled = true;
                    watchlistBtn.textContent = 'Updating...';

                    const url = `http://localhost:3000/api/movies/${encodeURIComponent(id)}/watchlist`;
                    console.log('Toggling watchlist for movie:', id);

                    const res = await fetch(url, { method: 'PATCH' });

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({}));
                        throw new Error(errorData.error || 'Failed to update movie');
                    }

                    const updatedMovie = await res.json();
                    console.log('Updated movie:', updatedMovie);

                    watchlistBtn.textContent = updatedMovie.watchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
                    watchlistBtn.className = updatedMovie.watchlist ? 'btn-secondary' : 'btn-primary';
                    watchlistBtn.setAttribute(
                        'aria-label',
                        `${updatedMovie.watchlist ? 'Remove from' : 'Add to'} watchlist for ${movie.title}`);

                    movie.watchlist = updatedMovie.watchlist;
                    
                    // Refresh movie lists
                    fetchMyMovies();
                    fetchWatchListMovies();

                } catch (err) {
                    console.error('Error updating movie watchlist:', err);
                    alert('Could not update movie. Please try again.');
                } finally {
                    watchlistBtn.disabled = false;
                }
            });

            body.appendChild(h3);
            body.appendChild(p);
            body.appendChild(openBtn);
            body.appendChild(watchlistBtn);

            card.appendChild(poster);
            card.appendChild(body);

            movieListElement.appendChild(card);
        });

        if (placeholder) {
            placeholder.style.display = moviesCount > 0 ? 'none' : '';
        }
    } catch (error) {
        console.error('Could not fetch movies:', error);
        const movieListElement = document.getElementById('movieList');
        if (movieListElement) {
            movieListElement.innerHTML = '<div class="error">Failed to load movies. Please check if the server is running.</div>';
        }
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
        movieListElement.innerHTML = '';

        let watchedCount = 0;
        movies.forEach(movie => {
            if (movie.watched) {
                watchedCount++;
                const card = document.createElement('article');
                card.className = 'card';

                const poster = document.createElement('img');
                poster.className = 'poster';
                poster.alt = movie.title + ' poster';
                poster.width = 72;
                poster.height = 100;
                poster.src = ('img/' + (movie.title ? movie.title.toLowerCase().replace(/\s+/g, '') : 'placeholder') + '.png') || movie.poster_url;
                poster.onerror = function () {
                    this.src = 'img/placeholder.png';
                };

                const body = document.createElement('div');
                body.className = 'card-body';

                const h3 = document.createElement('h3');
                h3.className = 'card-title';
                h3.textContent = `${movie.title} (${movie.year || 'Unknown'})`;

                const p = document.createElement('p');
                p.className = 'card-text';
                p.textContent = `${movie.genre || 'Unknown genre'} 
                • Rating: ${movie.rating || 'Not rated'} 
                • Watched: ${movie.watched ? 'Yes' : 'No'}`;

                const openBtn = document.createElement('button');
                openBtn.type = 'button';
                openBtn.textContent = 'Watch';
                openBtn.setAttribute('aria-label', `Open details for ${movie.title}`);
                openBtn.addEventListener('click', () => {
                    window.location.href = `movie.html?id=${encodeURIComponent(id)}`;
                });

                const watchlistBtn = document.createElement('button');
                watchlistBtn.type = 'button';
                watchlistBtn.textContent = movie.watchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
                watchlistBtn.className = movie.watchlist ? 'btn-secondary' : 'btn-primary';
                watchlistBtn.addEventListener('click', async () => {
                    try {
                        watchlistBtn.disabled = true;
                        watchlistBtn.textContent = 'Updating...';

                        const url = `http://localhost:3000/api/movies/${encodeURIComponent(id)}/watchlist`;
                        console.log('Toggling watchlist for movie:', id);

                        const res = await fetch(url, { method: 'PATCH' });

                        if (!res.ok) {
                            const errorData = await res.json().catch(() => ({}));
                            throw new Error(errorData.error || 'Failed to update movie');
                        }

                        const updatedMovie = await res.json();
                        console.log('Updated movie:', updatedMovie);

                        watchlistBtn.textContent = updatedMovie.watchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
                        watchlistBtn.className = updatedMovie.watchlist ? 'btn-secondary' : 'btn-primary';
                        watchlistBtn.setAttribute(
                            'aria-label',
                            `${updatedMovie.watchlist ? 'Remove from' : 'Add to'} watchlist for ${movie.title}`);

                        movie.watchlist = updatedMovie.watchlist;

                        fetchMyMovies();
                        fetchWatchListMovies();

                    } catch (err) {
                        console.error('Error updating movie watchlist:', err);
                        alert('Could not update movie. Please try again.');
                    } finally {
                        watchlistBtn.disabled = false;
                    }
                });

                body.appendChild(h3);
                body.appendChild(p);
                body.appendChild(openBtn);
                body.appendChild(watchlistBtn);

                card.appendChild(poster);
                card.appendChild(body);

                movieListElement.appendChild(card);
            }
        });

        if (placeholder) {
            placeholder.style.display = watchedCount > 0 ? 'none' : '';
        }

    } catch (error) {
        console.error('Could not fetch watched movies:', error);
    }
}

async function fetchWatchListMovies() {
    try {
        console.log('Fetching watchlist movies...');
        const response = await fetch('http://localhost:3000/api/movies');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const movies = await response.json();

        const movieListElement = document.getElementById('myWatchlist');
        const placeholder = document.getElementById('myPlaceholderWatchlist');

        if (!movieListElement) return;
        movieListElement.innerHTML = '';

        let watchlistCount = 0;
        movies.forEach(movie => {
            if (movie.watchlist) {
                const id = movie.id || movie._id || movie.ID;
                watchlistCount++;

                const card = document.createElement('article');
                card.className = 'card';

                const poster = document.createElement('img');
                poster.className = 'poster';
                poster.alt = movie.title + ' poster';
                poster.width = 72;
                poster.height = 100;
                poster.src = ('img/' + (movie.title ? movie.title.toLowerCase().replace(/\s+/g, '') : 'placeholder') + '.png' || movie.poster_url);
                poster.onerror = function () {
                    this.src = 'img/placeholder.png';
                };

                const body = document.createElement('div');
                body.className = 'card-body';

                const h3 = document.createElement('h3');
                h3.className = 'card-title';
                h3.textContent = `${movie.title} (${movie.year || 'Unknown'})`;

                const p = document.createElement('p');
                p.className = 'card-text';
                p.textContent = `${movie.genre || 'Unknown genre'} 
                • Rating: ${movie.rating || 'Not rated'}
                • Watched: ${movie.watched ? 'Yes' : 'No'}`;


                const openBtn = document.createElement('button');
                openBtn.type = 'button';
                openBtn.textContent = 'Watch';
                openBtn.setAttribute('aria-label', `Open details for ${movie.title}`);
                openBtn.addEventListener('click', () => {
                    window.location.href = `movie.html?id=${encodeURIComponent(id)}`;
                });

                const watchlistBtn = document.createElement('button');
                watchlistBtn.type = 'button';
                watchlistBtn.textContent = 'Remove from Watchlist';
                watchlistBtn.className = 'btn-secondary';
                watchlistBtn.addEventListener('click', async () => {
                    try {
                        watchlistBtn.disabled = true;
                        watchlistBtn.textContent = 'Removing...';

                        const url = `http://localhost:3000/api/movies/${encodeURIComponent(id)}/watchlist`;
                        const res = await fetch(url, { method: 'PATCH' });

                        if (!res.ok) {
                            const errorData = await res.json().catch(() => ({}));
                            throw new Error(errorData.error || 'Failed to update movie');
                        }

                        // Refresh the watchlist and main movie list
                        fetchWatchListMovies();
                        fetchMovies();

                    } catch (err) {
                        console.error('Error updating watchlist:', err);
                        alert('Could not update movie. Please try again.');
                        watchlistBtn.disabled = false;
                        watchlistBtn.textContent = 'Remove from Watchlist';
                    }
                });

                body.appendChild(h3);
                body.appendChild(p);
                body.appendChild(openBtn);
                body.appendChild(watchlistBtn);

                card.appendChild(poster);
                card.appendChild(body);

                movieListElement.appendChild(card);
            }
        });

        if (placeholder) {
            placeholder.style.display = watchlistCount > 0 ? 'none' : '';
        }

    } catch (error) {
        console.error('Could not fetch watchlist movies:', error);
    }
}

// Initialize all sections
fetchMovies();
fetchMyMovies();
fetchWatchListMovies();

//#region Navigation UI
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            const opened = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });

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