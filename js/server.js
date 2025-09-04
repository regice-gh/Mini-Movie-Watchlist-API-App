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
  database: 'apieindopdracht'
}).promise();


app.get('/api/movies', async (req, res) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM movies');

    res.json(rows);

  } catch (error) {
    console.error("Error fetching movies from database:", error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  const id = Number(req.params.id);
  console.log('GET /api/movies/:id called with id=', req.params.id);
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

app.listen(port, () => {
  console.log(`Movie API server listening on http://localhost:${port}`);
});