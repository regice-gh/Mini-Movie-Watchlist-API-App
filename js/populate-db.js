//update database with `npm run populate-db` command

require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'apieindopdracht';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const schema = `
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`${DB_NAME}\`;

CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  year INT NULL,
  genre VARCHAR(100) NULL,
  rating TINYINT NULL,
  watched BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const dummyMovies = [
  { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', rating: 5, watched: true },
  { title: 'The Godfather', year: 1972, genre: 'Crime', rating: 5, watched: false },
  { title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 4, watched: false },
  { title: 'Spirited Away', year: 2001, genre: 'Animation', rating: 5, watched: true },
  { title: 'Parasite', year: 2019, genre: 'Thriller', rating: 5, watched: false }
];

async function run() {
  console.log(`Connecting to MySQL ${DB_HOST}:${DB_PORT} as ${DB_USER}`);
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, port: DB_PORT, multipleStatements: true });
  try {
    console.log('Creating database and table...');
    await conn.query(schema);

    console.log('Inserting dummy movies...');
    const insertSql = 'INSERT INTO `'+DB_NAME+'`.movies (title, year, genre, rating, watched) VALUES (?, ?, ?, ?, ?)';
    for (const m of dummyMovies) {
      await conn.execute(insertSql, [m.title, m.year, m.genre, m.rating, m.watched ? 1 : 0]);
    }

    console.log('Done.');
    console.log(`Database: ${DB_NAME}`);
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await conn.end();
  }
}

run().catch(err => { console.error(err); process.exit(1); });
