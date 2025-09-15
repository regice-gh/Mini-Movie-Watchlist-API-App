//update database with `npm run populate-db`

require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_NAME = process.env.DB_NAME || 'apieindopdracht';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

const schema = `
DROP DATABASE IF EXISTS \`${DB_NAME}\`; 
CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`${DB_NAME}\`;

DROP TABLE IF EXISTS movies; 
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  year INT NULL,
  genre VARCHAR(100) NULL,
  rating TINYINT NULL,
  watched BOOLEAN NOT NULL DEFAULT FALSE,
  watchlist TINYINT(1) NOT NULL DEFAULT 0,
  poster_url VARCHAR(512) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const dummyMovies = [
  { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', rating: 5, watched: true, watchlist:true, poster_url: 'https://via.placeholder.com/300x450?text=Shawshank+Redemption' },
  { title: 'The Godfather', year: 1972, genre: 'Crime', rating: 5, watched: false, watchlist:false, poster_url: 'https://via.placeholder.com/300x450?text=The+Godfather' },
  { title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 4, watched: false, watchlist:false, poster_url: 'https://via.placeholder.com/300x450?text=Inception' },
  { title: 'Spirited Away', year: 2001, genre: 'Animation', rating: 5, watched: true, watchlist:false, poster_url: 'https://via.placeholder.com/300x450?text=Spirited+Away' },
  { title: 'Parasite', year: 2019, genre: 'Thriller', rating: 5, watched: false, watchlist:false, poster_url: 'https://via.placeholder.com/300x450?text=Parasite' }
];

async function run() {
  console.log(`Connecting to MySQL ${DB_HOST}:${DB_PORT} as ${DB_USER}`);
  const conn = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASS, port: DB_PORT, multipleStatements: true });
  try {
    // Parse command-line flags
    const args = process.argv.slice(2);
    const recreateFlag = args.includes('--recreate-db') || args.includes('--recreate');
    const resetFlag = args.includes('--reset-data') || args.includes('--reset');

    // Helper: insert dummy movies (used by multiple flows)
    async function insertDummyMovies() {
      console.log('Inserting dummy movies...');
      const insertSql = 'INSERT INTO `'+DB_NAME+'`.movies (title, year, genre, rating, watched, watchlist, poster_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
      for (const m of dummyMovies) {
        await conn.execute(insertSql, [m.title, m.year, m.genre, m.rating, m.watched ? 1 : 0, m.watchlist ? 1 : 0, m.poster_url || null]);
      }
    }

    // Helper: ensure poster_url column exists
    async function ensurePosterColumn() {
      try {
        const [cols] = await conn.execute(
          'SELECT COUNT(*) AS cnt FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND column_name = ?',
          [DB_NAME, 'movies', 'poster_url']
        );
        if (cols && cols[0] && cols[0].cnt === 0) {
          console.log('Adding poster_url column to movies table...');
          const alterSql = 'ALTER TABLE `'+DB_NAME+'`.movies ADD COLUMN poster_url VARCHAR(512) NULL;';
          await conn.query(alterSql);
        }
      } catch (alterErr) {
        console.warn('Could not ensure poster_url column exists:', alterErr.message || alterErr);
      }
    }

    if (recreateFlag) {
      console.log('Dropping database if it exists...');
      await conn.query('DROP DATABASE IF EXISTS `'+DB_NAME+'`;');
      console.log('Creating database and table...');
      await conn.query(schema);
      // fresh DB already has poster_url column from schema
      await insertDummyMovies();
      console.log('Recreate complete.');
      console.log(`Database: ${DB_NAME}`);
      return;
    }

    if (resetFlag) {
      console.log('Resetting data: clearing movies table and re-inserting dummy data...');
      // Make sure DB exists and table exists; if not, create via schema
      await conn.query(schema);
      await conn.query('USE `'+DB_NAME+'`;');
      await conn.query('DELETE FROM movies;');
      await ensurePosterColumn();
      await insertDummyMovies();
      console.log('Reset complete.');
      console.log(`Database: ${DB_NAME}`);
      return;
    }

    // Default behaviour: create DB/table if missing, ensure column exists, then insert (may append duplicates)
    console.log('Creating database and table (if missing)...');
    await conn.query(schema);
    await ensurePosterColumn();
    await insertDummyMovies();
    console.log('Done.');
    console.log(`Database: ${DB_NAME}`);
  } catch (err) {
    console.error('Error:', err.message || err);
  } finally {
    await conn.end();
  }
}

run().catch(err => { console.error(err); process.exit(1); });
