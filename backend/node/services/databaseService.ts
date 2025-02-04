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


export const saveRegistrationData = async(firstName:string,lastName:string,email:string,password:any,phoneNumber:number): Promise<void> => {
  let client: PoolClient | undefined
  try {
    client = await pool.connect() 
    const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, created_at) VALUES ($1, $2, $3, $4, $5, NOW());`;
    const values = [firstName, lastName, email, password, phoneNumber];
    await client.query(query, values);
    await client.query('COMMIT') 
    console.log('User registration data saved successfully.');
    return 
} catch (e) {
  console.error('Error retrieving location data:', e)
  throw e
  }

}

export const verifyUserCredentials = async (email: string, password: string): Promise<any> => {
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();
    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const result = await client.query(query, [email, password]);

    if (result.rows.length > 0) {
      return result.rows[0]; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error('Error verifying user credentials:', error);
    throw error;
  } finally {
    client?.release();
  }
};