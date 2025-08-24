const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'marketplace',
  password: 'admin',
  port: 5434,
});

module.exports = pool;
