const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MavsDB',
  password: 'Blamelame10!',
  port: 5433,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 