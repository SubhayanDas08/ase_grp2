"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT || '5432', 10),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});
// Test the connection and log the result
pool
    .connect()
    .then((client) => {
    console.log('Connected to PostgreSQL');
    client.release(); // Release the client back to the pool
})
    .catch((err) => {
    console.error('PostgreSQL connection error:', err);
    process.exit(1); // Exit the process on connection error
});
exports.default = pool;
