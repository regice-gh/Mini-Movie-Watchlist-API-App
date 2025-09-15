# Mini-Movie-Watchlist-API-App
heb deze Mini Movie Watchlist API &amp; App gemaakt als eindopdracht voor het vak API

Features (Eisen & Wensen)
Core Idea
•	Users can create their own watchlist of movies/series.
•	They can add, edit, delete, and mark movies as “watched.”
•	Extra spice: rate movies and search/filter by genre or “watched/unwatched.”

Eisen (must-haves):
1.	User can add a movie to their list (title, year, genre).✅
2.	User can edit a movie entry. ✅
3.	User can delete a movie.✅
4.	User can mark movies on watchlist/ off watchlist. ✅
5.	The app shows the full list. ✅
   
Wensen (nice-to-haves):
•	Rating system (1–5 stars). 
•	Search/filter by genre or by “watched.”
•	Show a “Top 5 movies” endpoint.
•	Integration with a public API (optional: fetch poster images from OMDB API).
•   show the movie with a public API

Endpoints
CRUD:
•	GET /movies → get all movies ✅
•	GET /movies/{id} → get single movie ✅
•	POST /movies → add movie ✅
•	PUT /movies/{id} → update movie ✅
•	DELETE /movies/{id} → delete movie ✅
Extra endpoints (API design style):
•	PATCH /movies/{id}/watchlist → toggle off watchlist/on watchlist ✅
•	GET /movies/top5 → return top 5 highest-rated movies

Database (MySQL)
Movies Table
•	id (PK) ✅
•	title (string)✅
•	year (int)✅
•	genre (string)✅
•	rating (int, optional)✅
•	watched (boolean, default false)✅
•   watchlist (boolean, default false) ✅
•   img (URL or PNG) ✅

Frontend
Keep it simple — plain JS with fetch:
•	A list that shows all movies. ✅
•	Buttons to add, edit, delete. ✅
•	A checkbox or toggle for “watched.” ✅
•	Maybe a little “Top 5” section. 

// Insert genres
const genreIdMap = {};
for (const g of dummyGenres) {
  const [result] = await conn.execute('INSERT INTO genres (name) VALUES (?)', [g]);
  genreIdMap[g] = result.insertId;
}

// Insert movies using genreIdMap
for (const m of dummyMovies) {
  await conn.execute(
    'INSERT INTO movies (title, year, genres_id, rating, watched, watchlist, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [m.title, m.year, genreIdMap[m.genre], m.rating, m.watched ? 1 : 0, m.watchlist ? 1 : 0, m.poster_url]
  );
}
5️⃣ Call your getMoviesWithGenres() after insertion

Now the INNER JOIN will work because:

genres exists and has data

movies exists and references the correct genres_id

No foreign key violations occur

🔹 TL;DR

Drop/create DB → separate statements.

Create genres table before movies.

Insert genres → get IDs → insert movies using IDs.

Call INNER JOIN query only after all inserts.