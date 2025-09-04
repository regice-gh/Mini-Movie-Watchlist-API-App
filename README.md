# Mini-Movie-Watchlist-API-App
heb deze Mini Movie Watchlist API &amp; App gemaakt als eindopdracht voor het vak API

Features (Eisen & Wensen)
Core Idea
•	Users can create their own watchlist of movies/series.
•	They can add, edit, delete, and mark movies as “watched.”
•	Extra spice: rate movies and search/filter by genre or “watched/unwatched.”

Eisen (must-haves):
1.	User can add a movie to their list (title, year, genre).
2.	User can edit a movie entry.
3.	User can delete a movie.
4.	User can mark movies as watched/unwatched.
5.	The app shows the full list.
   
Wensen (nice-to-haves):
•	Rating system (1–5 stars).
•	Search/filter by genre or by “watched.”
•	Show a “Top 5 movies” endpoint.
•	Integration with a public API (optional: fetch poster images from OMDB API).

Endpoints
CRUD:
•	GET /movies → get all movies
•	GET /movies/{id} → get single movie
•	POST /movies → add movie
•	PUT /movies/{id} → update movie
•	DELETE /movies/{id} → delete movie
Extra endpoints (API design style):
•	PATCH /movies/{id}/watched → toggle watched/unwatched
•	GET /movies/top5 → return top 5 highest-rated movies

Database (MySQL)
Movies Table
•	id (PK) ✅
•	title (string)✅
•	year (int)✅
•	genre (string)✅
•	rating (int, optional)✅
•	watched (boolean, default false)✅
•   img (URL of PNG) ✅

Frontend
Keep it simple — plain JS with fetch:
•	A list that shows all movies. 
•	Buttons to add, edit, delete.
•	A checkbox or toggle for “watched.”
•	Maybe a little “Top 5” section.

