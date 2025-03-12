require("dotenv").config();
const { Pool } = require("pg");

// Create a connection pool
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// Export query function
module.exports = {
  query: (text, params) => pool.query(text, params),
};
