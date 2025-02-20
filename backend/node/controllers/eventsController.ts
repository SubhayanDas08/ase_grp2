import { Request, Response } from 'express'
import redisClient from '../utils/redis'
import {pool} from '../server'
import { error } from 'console';

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const { event_name, event_desc, start_date, start_time, event_location, end_date } = req.body;

  if(!event_name || !event_desc || !start_date || !event_location){
    res.status(400).json({error:"Event time or event description or start date or event location is missing"});
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const insertEventQuery = `
      INSERT INTO public.events (event_name, event_desc, start_date, start_time, event_location, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING * ;
    `
    const result = await client.query(insertEventQuery, [event_name, event_desc, start_date, start_time, event_location, end_date])
    const newEvent = result.rows[0]

    // Cache the new event in Redis
    const key = `event:${newEvent.id}`
    await redisClient.setEx(key, 3600, JSON.stringify(newEvent))

    await client.query('COMMIT')
    res.status(201).json(newEvent)
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error creating event:', error)
    res.status(500).json({ error: 'Internal server error.' })
  } finally {
    client.release()
  }
}

// Fetch an event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const eventId = req.params.id
  const key = `event:${eventId}`

  try {
    // Check if the event is cached in Redis
    const cachedEvent = await redisClient.get(key)
    if (cachedEvent) {
      res.json(JSON.parse(cachedEvent))
      return
    }

    const result = await pool.query(
      'SELECT id, name, start_date, end_date FROM public.events WHERE id = $1',
      [eventId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Event not found.' })
      return
    }

    const event = result.rows[0]

    // Cache the fetched event in Redis
    await redisClient.setEx(key, 3600, JSON.stringify(event))
    res.json(event)
  } catch (error) {
    console.error('Error fetching event by ID:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

// Fetch all events
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, name, start_date, end_date FROM public.events ORDER BY start_date'
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching all events:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
