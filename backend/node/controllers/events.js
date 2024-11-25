const { redisClient } = require("../utils/redis");
const { pool } = require("../utils/db");

// Create a new event
async function createEvent(req, res) {
  const { name, start_date, end_date } = req.body;

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
    await redisClient.setEx(key, 3600, JSON.stringify(newEvent));

    await client.query("COMMIT");
    res.status(201).json(newEvent);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating event:", error.message);
    res.status(500).send(error.message);
  } finally {
    client.release();
  }
}

// Fetch an event by ID
async function getEventById(req, res) {
  const eventId = req.params.id;
  const key = `event:${eventId}`;

  try {
    const cachedEvent = await redisClient.get(key);
    if (cachedEvent) {
      return res.json(JSON.parse(cachedEvent));
    }

    const result = await pool.query(
      "SELECT id, name, start_date, end_date FROM public.events WHERE id = $1",
      [eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Event not found");
    }

    const event = result.rows[0];

    await redisClient.setEx(key, 3600, JSON.stringify(event));
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error.message);
    res.status(500).send(error.message);
  }
}

// Fetch all events
async function getAllEvents(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, start_date, end_date FROM public.events ORDER BY start_date"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).send(error.message);
  }
}

module.exports = { createEvent, getEventById, getAllEvents };