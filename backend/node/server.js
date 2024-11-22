const express = require("express");
const { Pool } = require("pg");
const cors = require('cors');
const redis = require("redis");
require("dotenv").config();

const app = express();
const port = 3000;
const host = "0.0.0.0";

// Middleware to parse JSON bodies
app.use(express.json());

// Redis client setup
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.connect();

// PostgreSQL pool setup
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("PostgreSQL connection error:", err));

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});

// Route to create a new event
app.post("/events", async (req, res) => {
  // console.log(req)
  const { name, start_date, end_date } = req.body;
  console.log(name, start_date, end_date);
  try {
    const newEvent = await createEvent(name, start_date, end_date);
    res.status(201).json(newEvent);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

async function createEvent(name, start_date, end_date) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertEventQuery = `
      INSERT INTO public.events (name, start_date, end_date)
      VALUES ($1, $2, $3)
      RETURNING id, name, start_date, end_date
    `;
    const result = await client.query(insertEventQuery, [
      name,
      start_date,
      end_date,
    ]);
    const newEvent = result.rows[0];

    // Cache the new event in Redis
    const key = `event:${newEvent.id}`;
    redisClient.setEx(key, 3600, JSON.stringify(newEvent));

    await client.query("COMMIT");
    return newEvent;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

app.get("/event/:id", async (req, res) => {
  const eventId = req.params.id;
  const key = `event:${eventId}`;

  try {
    // Check Redis cache
    const cachedEvent = await redisClient.get(key);
    if (cachedEvent) {
      return res.json(JSON.parse(cachedEvent));
    }

    // Query PostgreSQL if not in cache
    const result = await pool.query(
      "SELECT id, name, start_date, end_date FROM public.events WHERE id = $1",
      [eventId],
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Event not found");
    }

    const event = result.rows[0];

    // Cache the result in Redis
    await redisClient.setEx(key, 3600, JSON.stringify(event));

    return res.json(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/events", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, start_date, end_date FROM public.events ORDER BY start_date"
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send(error.message);
  }
});