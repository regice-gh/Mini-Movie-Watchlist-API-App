# Mini-Movie-Watchlist-API-App
heb deze Mini Movie Watchlist API App gemaakt als eindopdracht voor het vak API

Features (Eisen & Wensen)
Core Idea
1.	Users can create their own watchlist of movies/series. ✅
2.	They can add, edit, delete, and mark movies as “watched.” ✅
3.	Extra: rate movies and search/filter by genre or “watched/unwatched.”

Eisen (must-haves):
•	User can add a movie to their list (title, year, genre).✅
•	User can edit a movie entry. ✅
•	User can delete a movie.✅
•	User can mark movies on watchlist/ off watchlist. ✅
•	The app shows the full list. ✅
   
Wensen (nice-to-haves):
1.	Rating system (1–5 stars). ✅
2.	Search/filter by genre or by “watched.”
3.	Show a “Top 5 movies” endpoint.
4.	Integration with a public API (optional: fetch poster images from OMDB API). ✅
5.  show the movie with a public API. ✅

Endpoints
CRUD:
1.	GET /movies → get all movies ✅
2.	GET /movies/{id} → get single movie ✅
3.	POST /movies → add movie ✅
4.	PUT /movies/{id} → update movie ✅
5.	DELETE /movies/{id} → delete movie ✅
Extra endpoints (API design style):
1.	PATCH /movies/{id}/watchlist → toggle off watchlist/on watchlist ✅
2.	GET /movies/top5 → return top 5 highest-rated movies

Database (MySQL)
Movies Table
1.	id (PK) ✅
2. genres_id (int, FK)
3.	title (string)✅
4.	year (int)✅
5.	rating (int, optional)✅
6.	watched (boolean, default false)✅
7. watchlist (boolean, default false) ✅
8. img (URL or PNG) ✅
9.	Foreign Key(genres_id)✅

Genre Table
1. Id (PK)
2. name (string)

Frontend
Keep it simple — plain JS with fetch:
1.	A list that shows all movies. ✅
2.  Buttons to add, edit, delete. ✅
3.	A checkbox or toggle for “watched.” ✅
4.	Maybe a little “Top 5” section. 
