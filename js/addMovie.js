document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('add-movie-form');

  const submitButton = form.querySelector('button[type="submit"]');
  const apiMovies = 'http://localhost:3000/api/movies';
  const apiGenres = 'http://localhost:3000/api/genres';
  const genreSelect = document.getElementById('genre');

  fetch(apiGenres)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch genres (status ${response.status})`);
      }
      return response.json();
    }
    )
    .then(genres => {
      genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.name;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
      });
    }).catch(err => {
      console.error('Error fetching genres:', err);
      alert('Could not load genres. Please try again later.');
    });

  async function handleSubmit(event) {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const yearInput = document.getElementById('year');
    const genreselect = document.getElementById('genre');
    const ratingInput = document.getElementById('rating');

    const title = (titleInput?.value || '').trim();
    const year = yearInput?.value ? Number(yearInput.value) : null;
    const genre = genreselect?.value || null;
    const rating = ratingInput?.value !== '' ? Number(ratingInput.value) : null;
    

    if (!title) {
      alert('Please enter a title.');
      titleInput?.focus();
      return;
    }

    const payload = { title, year, genre, rating, watched: false, watchlist: false };

    try {
      submitButton && (submitButton.disabled = true);

      console.log("Payload I sent:", payload);

      const res = await fetch(apiMovies, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log("Fetch Response object:", res);
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to add movie (status ${res.status})`);
      }
      
      const created = await res.json();
      console.log("Server returned:", created);


      alert(`Added: ${created.title}`);
      window.location.href = 'index.html#movie-list';
    } catch (err) {
      console.error('Add movie error:', err);
      alert('Could not add movie. Please try again.');
    } finally {
      submitButton && (submitButton.disabled = false);
    }
  }

  form.addEventListener('submit', handleSubmit);
});


