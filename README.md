# Mini-Movie-Watchlist-API-App
heb deze Mini Movie Watchlist API &amp; App gemaakt als eindopdracht voor het vak API

Features (Eisen & Wensen)
Core Idea
•	Users can create their own watchlist of movies/series. ✅
•	They can add, edit, delete, and mark movies as “watched.” ✅
•	Extra spice: rate movies and search/filter by genre or “watched/unwatched.”

Eisen (must-haves):
•	User can add a movie to their list (title, year, genre).✅
•	User can edit a movie entry. ✅
•	User can delete a movie.✅
•	User can mark movies on watchlist/ off watchlist. ✅
•	The app shows the full list. ✅
   
Wensen (nice-to-haves):
•	Rating system (1–5 stars). ✅
•	Search/filter by genre or by “watched.”
•	Show a “Top 5 movies” endpoint.
•	Integration with a public API (optional: fetch poster images from OMDB API). ✅
•   show the movie with a public API. ✅

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
• genres_id (int, FK)
•	title (string)✅
•	year (int)✅
•	rating (int, optional)✅
•	watched (boolean, default false)✅
• watchlist (boolean, default false) ✅
• img (URL or PNG) ✅
•	Foreign Key(genres_id)✅

Genre Table
• Id (PK)
• name (string)

Frontend
Keep it simple — plain JS with fetch:
•	A list that shows all movies. ✅
•	Buttons to add, edit, delete. ✅
•	A checkbox or toggle for “watched.” ✅
•	Maybe a little “Top 5” section. 
