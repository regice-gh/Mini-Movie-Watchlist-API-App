// 1. IMPORT THE LIBRARIES
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 2. CREATE AN EXPRESS APPLICATION
const app = express();
const port = 3000; 

// 3. APPLY MIDDLEWARE
app.use(cors());
app.use(express.json());

// 4. CREATE A DATABASE CONNECTION POOL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'apieindopdracht'
}).promise();

// 5. DEFINE YOUR API ENDPOINT

app.get('/api/movies', async (req, res) => {
  try {
    // 6. TALK TO THE DATABASE
    const [rows, fields] = await db.execute('SELECT * FROM movies');

    // 7. SEND THE DATA BACK TO THE FRONTEND AS JSON
    res.json(rows);

  } catch (error) {
    // 8. HANDLE ANY ERRORS
    console.error("Error fetching movies from database:", error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// 9. START THE SERVER
app.listen(port, () => {
  console.log(`Movie API server listening on http://localhost:${port}`);
});