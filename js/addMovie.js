document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('add-movie-form');

  const submitButton = form.querySelector('button[type="submit"]');
  const apiMovies = 'http://localhost:3000/api/movies';

  async function handleSubmit(event) {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const yearInput = document.getElementById('year');
    const genreselect = document.getElementById('genre');
    const ratingInput = document.getElementById('rating');

    

    const title = (titleInput?.value || '').trim();
    const year = yearInput?.value ? Number(yearInput.value) : null;
    const genre = (genreselect?.value || '').trim();
    const rating = ratingInput?.value !== '' ? Number(ratingInput.value) : null;
    

    if (!title) {
      alert('Please enter a title.');
      titleInput?.focus();
      return;
    }

    const payload = { title, year, genre, rating, watched: false, watchlist: false };

    try {
      submitButton && (submitButton.disabled = true);

      const res = await fetch(apiMovies, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to add movie (status ${res.status})`);
      }

      const created = await res.json();

      // Simple success UX: notify and redirect back to home so lists refresh
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


