require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'apieindopdracht';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const dummyGenres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

const dummyMovies = [
  { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', rating: 5, watched: true, watchlist: true, poster_url: 'https://via.placeholder.com/300x450?text=Shawshank+Redemption', imdbNumber: 'tt0111161' },
  { title: 'The Godfather', year: 1972, genre: 'Crime', rating: 5, watched: false, watchlist: false, poster_url: 'https://via.placeholder.com/300x450?text=The+Godfather', imdbNumber: 'tt0068646' },
  { title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 4, watched: false, watchlist: false, poster_url: 'https://via.placeholder.com/300x450?text=Inception', imdbNumber: 'tt1375666' },
  { title: 'Spirited Away', year: 2001, genre: 'Animation', rating: 5, watched: true, watchlist: false, poster_url: 'https://via.placeholder.com/300x450?text=Spirited+Away', imdbNumber: 'tt0245429' },
  { title: 'Parasite', year: 2019, genre: 'Thriller', rating: 5, watched: false, watchlist: false, poster_url: 'https://via.placeholder.com/300x450?text=Parasite', imdbNumber: 'tt6751668' },
  { title: 'The Dark Knight', year: 2008, genre: 'Action', rating: 5, watched: true, watchlist: true, poster_url: 'https://via.placeholder.com/300x450?text=The+Dark+Knight', imdbNumber: 'tt0468569' },
  { title: 'Forrest Gump', year: 1994, genre: 'Romance', rating: 4, watched: true, watchlist: false, poster_url: 'https://via.placeholder.com/300x450?text=Forrest+Gump', imdbNumber: 'tt0109830' },
  { title: 'The Matrix', year: 1999, genre: 'Sci-Fi', rating: 5, watched: false, watchlist: true, poster_url: 'https://via.placeholder.com/300x450?text=The+Matrix', imdbNumber: 'tt0133093' },
];

async function main() {
  console.log(`Connecting to MySQL ${DB_HOST}:${DB_PORT} as ${DB_USER}`);
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, port: DB_PORT });

  try {
    const args = process.argv.slice(2);
    const recreateFlag = args.includes('--recreate-db') || args.includes('--recreate');
    const resetFlag = args.includes('--reset-data') || args.includes('--reset');

    if (recreateFlag) {
      console.log('Dropping database if it exists...');
      await conn.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);
    }

    console.log('Creating database...');
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${DB_NAME}\``);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS genres (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        genres_id INT NULL,
        title VARCHAR(255) NOT NULL,
        year INT NULL,
        rating TINYINT NULL,
        watched BOOLEAN NOT NULL DEFAULT FALSE,
        watchlist TINYINT(1) NOT NULL DEFAULT 0,
        poster_url VARCHAR(512) NULL,
        imdbNumber VARCHAR(20) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (genres_id) REFERENCES genres(id)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Tables created successfully.');

    if (resetFlag) {
      console.log('Clearing existing data...');
      await conn.query('DELETE FROM movies');
      await conn.query('DELETE FROM genres');
    }

    const genreIdMap = {};
    for (const g of dummyGenres) {
      const [result] = await conn.execute('INSERT INTO genres (name) VALUES (?)', [g]);
      genreIdMap[g] = result.insertId;
    }
    console.log('Inserted dummy genres');

    for (const m of dummyMovies) {
      await conn.execute(
        'INSERT INTO movies (title, year, genres_id, rating, watched, watchlist, poster_url, imdbNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [m.title, m.year, genreIdMap[m.genre], m.rating, m.watched ? 1 : 0, m.watchlist ? 1 : 0, m.poster_url, m.imdbNumber]
      );
    }
    console.log('Inserted dummy movies');

    const [rows] = await conn.execute(`
      SELECT m.id, m.title, m.year, g.name AS genre, m.rating, m.watched, m.watchlist, m.poster_url, m.imdbNumber, m.created_at
      FROM movies m
      INNER JOIN genres g ON m.genres_id = g.id
    `);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await conn.end();
  }
}

main();
