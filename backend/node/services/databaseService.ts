import { PoolClient } from 'pg';
import { pool } from '../server';
import { aesEncrypt, aesDecrypt } from '../Interceptors/aesEncryption';

// Save registration data with encrypted request body
export const saveRegistrationData = async(firstName: string, lastName: string, email: string, password: string, phoneNumber: number): Promise<void> => {
    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        
        // Encrypt password before storing in the database
        const encryptedPassword = aesEncrypt(password);
        
        const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, created_at) VALUES ($1, $2, $3, $4, $5, NOW())RETURNING *;`;
        const values = [firstName, lastName, email, encryptedPassword, phoneNumber];
        const result = await client.query(query, values);
        const savedUser = result.rows[0];
        
        // await client.query(query, values);
        // await client.query('COMMIT');
        console.log('User registration data saved successfully.');
        return savedUser
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    } finally {
        client?.release();
    }
};

export const verifyUserCredentials = async (email: string): Promise<any> => {
    let client: PoolClient | undefined;

    try {
        client = await pool.connect();
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await client.query(query, [email]);

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

// Save location data with encrypted request body
export const saveLocationToDatabase = async (label:string,latitude:string,longitude:string): Promise<void> => {
    let client: PoolClient | undefined;

    try {
        client = await pool.connect(); // Connect to the database
        await client.query('BEGIN'); // Begin transaction

        // Decrypt the incoming request body
        // const decryptedData = JSON.parse(aesDecrypt(encryptedData));
        // const { locationName, latitude, longitude } = decryptedData;

        const query = `INSERT INTO public.locations (name, latitude, longitude) VALUES ($1, $2, $3)`;
        await client.query(query, [label, latitude, longitude]);

        await client.query('COMMIT'); // Commit transaction
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK'); // Rollback on error
        }
        console.error('Error saving location data:', error);
        throw error;
    } finally {
        client?.release(); // Release the client back to the pool
    }
};

// Retrieve and decrypt location data
export const getLocationData = async (): Promise<any> => {
    let client: PoolClient | undefined;

    try {
        client = await pool.connect();
        const query = 'SELECT * FROM public.locations ORDER BY id DESC LIMIT 1';
        const result = await client.query(query);

        if (result.rows.length > 0) {
            // Encrypt the retrieved data before sending response
            return JSON.parse(aesDecrypt(result.rows[0]));
        } else {
            return result;
        }
    } catch (error) {
        console.error('Error retrieving location data:', error);
        throw error;
    } finally {
        client?.release();
    }
};