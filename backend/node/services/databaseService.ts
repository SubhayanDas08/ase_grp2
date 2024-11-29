import {PoolClient } from 'pg'
import {pool} from '../server'

// Save location data to PostgreSQL
export const saveLocationToDatabase = async (
  locationName: string,
  latitude: number,
  longitude: number
): Promise<void> => {
  let client: PoolClient | undefined

  try {
    client = await pool.connect() // Connect to the database
    await client.query('BEGIN') // Begin transaction

    const query = `
      INSERT INTO public.locations (name, latitude, longitude)
      VALUES ($1, $2, $3)
    `
    await client.query(query, [locationName, latitude, longitude])

    await client.query('COMMIT') // Commit transaction
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK') // Rollback on error
    }
    console.error('Error saving location data:', error)
    throw error
  } finally {
    client?.release() // Release the client back to the pool
  }
}

// Retrieve the latest location data
export const getLocationData = async (): Promise<{ name: string; latitude: number; longitude: number }> => {
  let client: PoolClient | undefined

  try {
    client = await pool.connect() // Connect to the database
    const query = 'SELECT * FROM public.locations ORDER BY id DESC LIMIT 1'
    const result = await client.query(query)

    return result.rows[0] || null // Return the latest location data or null if none exists
  } catch (error) {
    console.error('Error retrieving location data:', error)
    throw error
  } finally {
    client?.release() // Release the client back to the pool
  }
}
