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
    })
    .then(genres => {
      genreSelect.innerHTML = '<option value="">Select a genre...</option>';
      
      genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.name;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Error fetching genres:', err);
      alert('Could not load genres. Please try again later.');
    });

  async function handleSubmit(event) {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const yearInput = document.getElementById('year');
    const genreSelect = document.getElementById('genre');
    const ratingInput = document.getElementById('rating');

    const title = (titleInput?.value || '').trim();
    const year = yearInput?.value ? Number(yearInput.value) : null;
    const genre = genreSelect?.value || null;
    const rating = ratingInput?.value !== '' ? Number(ratingInput.value) : null;
    
    // Validation
    if (!title) {
      alert('Please enter a title.');
      titleInput?.focus();
      return;
    }

    if (year && (year < 1888 || year > new Date().getFullYear() + 5)) {
      alert('Please enter a valid year.');
      yearInput?.focus();
      return;
    }

    if (rating && (rating < 1 || rating > 5)) {
      alert('Rating must be between 1 and 5.');
      ratingInput?.focus();
      return;
    }

    const payload = { 
      title, 
      year, 
      genre: genre || null, 
      rating, 
      watched: false, 
      watchlist: false 
    };

    try {
      submitButton && (submitButton.disabled = true);
      submitButton && (submitButton.textContent = 'Adding...');

      console.log("Payload being sent:", payload);

      const res = await fetch(apiMovies, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to add movie (status ${res.status})`);
      }
      
      const created = await res.json();
      console.log("Server returned:", created);

      alert(`Successfully added: ${created.title} (${created.year || 'Unknown year'})`);
      
      // Clear form
      form.reset();
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = 'index.html#movie-list';
      }, 500);
      
    } catch (err) {
      console.error('Add movie error:', err);
      alert(`Could not add movie: ${err.message}`);
    } finally {
      submitButton && (submitButton.disabled = false);
      submitButton && (submitButton.textContent = 'Add Movie');
    }
  }

  form.addEventListener('submit', handleSubmit);
});