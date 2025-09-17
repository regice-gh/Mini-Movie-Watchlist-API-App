const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000; 

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'apieindopdracht',
  waitForConnections: true,
}).promise();


app.get('/api/movies', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM movies');

    res.json(rows);

  } catch (error) {
    console.error("Error fetching movies from database:", error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.get('/api/genres', async (req, res) => {
  try{
    const [rows] = await db.execute('SELECT * FROM genres');
    res.json(rows);
  }
  catch(err){
    console.error("Error fetching genres from database:", err);
    res.status(500).json({ error: ' Failed to fetch genres'});
  }
});


app.get('/api/movies/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM movies WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching movie by id:', err);
    return res.status(500).json({ error: 'Failed to fetch movie' });
  }
});


app.post('/api/movies', async (req, res) => {
  const { title, year, genre, rating, watched = false, watchlist = false } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid title' });
  }
  try {
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
    const [newRows] = await db.execute('SELECT * FROM movies WHERE id = ?', [result.insertId]);
    res.status(201).json(newRows[0]);
  } catch (error) {
    console.error('Error adding movie to database:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});



app.put('/api/movies/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const { title, year, genre, rating, watched, watchlist } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE movies SET title = ?, year = ?, genre = ?, rating = ?, watched = ?, watchlist = ? WHERE id = ?',
      [title, year || null, genre || null, rating || null, watched ? 1 : 0, watchlist ? 1 : 0, id]
    );
    

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });

    const [rows] = await db.execute('SELECT * FROM movies WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating movie in database:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

app.patch('/api/movies/:id/watchlist', async (req, res) => {
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
    const [[updatedMovie]] = await db.execute(
      'SELECT * FROM movies WHERE id = ?',
      [id]
    );
    updatedMovie.watchlist = Boolean(updatedMovie.watchlist);
    //updatedMovie.watched   = Boolean(updatedMovie.watched);   // optional, for consistency

    res.json(updatedMovie);
  } catch (err) {
    console.error('Error toggling watchlist for movie id', id, err);
    res.status(500).json({ error: 'Failed to toggle watchlist' });
  }
});



app.delete('/api/movies/:id', async (req, res) => {
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
    res.status(500).json({ error: 'Failed to delete movie' });
  } 
});



app.listen(port, () => {
  console.log(`Movie API server listening on http://localhost:${port}`);
});