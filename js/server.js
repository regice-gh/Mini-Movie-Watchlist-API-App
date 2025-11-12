const express = require('express');

const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname + '/../'));

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'apieindopdracht',
  waitForConnections: true,
}).promise();

app.get('/api/movies', async (req, res, next) => {
  try {
    // Join genres to return the genre name as `genre` while keeping movie fields
    const [rows] = await db.execute(
      `SELECT m.*, g.name as genre
       FROM movies m
       LEFT JOIN genres g ON m.genres_id = g.id`
    );
    // Map watched and watchlist to booleans
    const mapped = rows.map(row => ({ ...row, watched: Boolean(row.watched), watchlist: Boolean(row.watchlist) }));
    res.json(mapped);
  } catch (error) {
    console.error("Error fetching movies from database:", error);
    next(error);
  }
});

app.get('/api/genres', async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM genres');
    res.json(rows);
  }
  catch (err) {
    console.error("Error fetching genres from database:", err);
    next(err);
  }
});

app.get('/api/movies/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT m.*, g.name as genre
       FROM movies m
       LEFT JOIN genres g ON m.genres_id = g.id
       WHERE m.id = ? LIMIT 1`,
      [id]
    );
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const movie = rows[0];
    movie.watchlist = Boolean(movie.watchlist);
    movie.watched = Boolean(movie.watched);
    return res.json(movie);
  } catch (err) {
    console.error('Error fetching movie by id:', err);
    next(err);
  }
});

app.post('/api/movies', async (req, res, next) => {
  const { title, year, genre, rating, watched = false, watchlist = false } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid title' });
  }
  try {
    // Resolve or create genre, store as genres_id
    let genreId = null;
    if (genre) {
      const [rows] = await db.execute('SELECT id FROM genres WHERE name = ?', [genre]);
      if (rows.length > 0) {
        genreId = rows[0].id;
      } else {
        const [insertGenre] = await db.execute('INSERT INTO genres (name) VALUES (?)', [genre]);
        genreId = insertGenre.insertId;
      }
    }

    const [result] = await db.execute(
      `INSERT INTO movies (title, year, genres_id, rating, watched, watchlist)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, year || null, genreId, rating || null, watched ? 1 : 0, watchlist ? 1 : 0]
    );

    // Return the inserted movie joined with genre name
    const [newRows] = await db.execute(
      `SELECT m.*, g.name as genre
       FROM movies m
       LEFT JOIN genres g ON m.genres_id = g.id
       WHERE m.id = ?`,
      [result.insertId]
    );
    const movie = newRows[0];
    if (movie) {
      movie.watchlist = Boolean(movie.watchlist);
      movie.watched = Boolean(movie.watched);
    }
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error adding movie to database:', error);
    next(error);
  }
});

app.put('/api/movies/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const { title, year, genre, rating, watched, watchlist } = req.body;

  try {
    // If a genre name is provided, resolve/insert to get genres_id
    let genreId = null;
    if (genre) {
      const [grows] = await db.execute('SELECT id FROM genres WHERE name = ?', [genre]);
      if (grows.length > 0) genreId = grows[0].id;
      else {
        const [insertGenre] = await db.execute('INSERT INTO genres (name) VALUES (?)', [genre]);
        genreId = insertGenre.insertId;
      }
    }

    const [result] = await db.execute(
      'UPDATE movies SET title = ?, year = ?, genres_id = ?, rating = ?, watched = ?, watchlist = ? WHERE id = ?',
      [title, year || null, genreId, rating || null, watched ? 1 : 0, watchlist ? 1 : 0, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await db.execute(
      `SELECT m.*, g.name as genre
       FROM movies m
       LEFT JOIN genres g ON m.genres_id = g.id
       WHERE m.id = ?`,
      [id]
    );

    const movie = rows[0];
    if (movie) { movie.watchlist = Boolean(movie.watchlist); movie.watched = Boolean(movie.watched); }
    res.json(movie);
  } catch (error) {
    console.error('Error updating movie in database:', error);
    next(error);
  }
});

app.patch('/api/movies/:id/watchlist', async (req, res, next) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const [[movie]] = await db.execute(
      'SELECT watchlist FROM movies WHERE id = ? LIMIT 1',
      [id]
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    await db.execute(
      'UPDATE movies SET watchlist = NOT watchlist WHERE id = ?',
      [id]
    );
    
    const [[updated]] = await db.execute(
      'SELECT watchlist FROM movies WHERE id = ? LIMIT 1',
      [id]
    );
    res.json({ id, watchlist: Boolean(updated.watchlist) });
  } catch (err) {
    console.error('Error toggling watchlist for movie id', id, err);
    next(err);
  }
});

app.delete('/api/movies/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  try {
    const [result] = await db.execute('DELETE FROM movies WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting movie from database:', error);
    next(error);
  }
});
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Movie API server listening on http://localhost:${port}`);
  });
}
//for testing
module.exports = app;