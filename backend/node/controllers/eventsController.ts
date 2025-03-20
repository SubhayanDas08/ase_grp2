import { Request, Response } from "express";
import redisClient from "../utils/redis";
import { pool } from "../server";
import { error } from "console";
import { AuthenticatedRequest } from "../utils/types";

// Create a new event
export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const permission = "manage_events";

  if (!req.user?.permissions?.includes(permission)) {
    res
      .status(403)
      .json({ error: "You don't have permission to create an event" });
    return;
  }
  const { name, start_date, end_date } = req.body;

  if (!name || !start_date || !end_date) {
    res.status(400).json({
      error:
        "Event time or event description or start date or event location is missing",
    });
    return;
  }

  const created_by = 1;
  const created_at = new Date();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertEventQuery = `
      INSERT INTO public.events (name, start_date, end_date, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING * ;
    `;
    const result = await client.query(insertEventQuery, [
      name,
      start_date,
      end_date,
      created_by,
      created_at,
    ]);
    const newEvent = result.rows[0];

    // Cache the new event in Redis
    const key = `event:${newEvent.id}`;
    await redisClient.setEx(key, 3600, JSON.stringify(newEvent));

    await client.query("COMMIT");
    res.status(201).json(newEvent);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    client.release();
  }
};

// Fetch an event by ID
export const getEventById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const eventId = req.params.id;
  const key = `event:${eventId}`;

  try {
    // Check if the event is cached in Redis
    const cachedEvent = await redisClient.get(key);
    if (cachedEvent) {
      res.json(JSON.parse(cachedEvent));
      return;
    }

    const result = await pool.query(
      "SELECT * FROM public.events WHERE id = $1",
      [eventId],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event not found." });
      return;
    }

    const event = result.rows[0];

    // Cache the fetched event in Redis
    await redisClient.setEx(key, 3600, JSON.stringify(event));
    res.json(event);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Fetch all events
export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.events ORDER BY start_date",
    );
    if (result.rows.length == 0)
      res.status(404).json({ error: "No events found" });

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Update an event
export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const eventId = req.params.id;
  const {
    event_name,
    event_desc,
    start_date,
    start_time,
    event_location,
    end_date,
  } = req.body;

  try {
    const event = await pool.query(`SELECT * FROM public.events WHERE id= $1`, [
      eventId,
    ]);
    if (event.rows.length === 0) {
      res.status(404).json({ error: "Event not found." });
      return;
    }

    const values = [
      event_name,
      event_desc,
      start_date,
      start_time,
      event_location,
      end_date,
    ];
    const updatedEvent = await pool.query(
      `UPDATE public.events
    SET event_name = $1, event_desc = $2, start_date = $3, start_time = $4, event_location = $5, end_date = $6
    WHERE id = $7
    RETURNING *;
    `,
      values,
    );

    await pool.query("COMMIT");
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.log("Error updating the event");
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete an event
export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const eventId = req.params.id;
    const result = await pool.query(
      "SELECT * FROM public.events WHERE id = $1",
      [eventId],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Event not found." });
      return;
    }

    const deletedEvent = await pool.query(
      `DELETE FROM public.events WHERE id = $1 RETURNING *`,
      [eventId],
    );
    await pool.query("COMMIT");

    //Deleting event from Redis
    res.status(200).json(deletedEvent.rows[0]);
  } catch (error) {
    console.log("Error deleting the event");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
