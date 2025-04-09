import { PoolClient } from "pg";
import { pool } from "../server";
import bcrypt from "bcrypt";

export const verifyUserCredentials = async (email: string): Promise<any> => {
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error verifying user credentials:", error);
    throw error;
  } finally {
    client?.release();
  }
};

export const getUserById = async (userId: string): Promise<any> => {
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();
    const query =
      "SELECT id, first_name, last_name, email, phone_number, domain, password FROM users WHERE id = $1";
    const result = await client.query(query, [userId]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  } finally {
    client?.release();
  }
};

// Save location data with encrypted request body
export const saveLocationToDatabase = async (
  label: string,
  latitude: string,
  longitude: string,
): Promise<void> => {
  let client: PoolClient | undefined;

  try {
    client = await pool.connect(); // Connect to the database
    await client.query("BEGIN"); // Begin transaction

    // Decrypt the incoming request body
    // const decryptedData = JSON.parse(aesDecrypt(encryptedData));
    // const { locationName, latitude, longitude } = decryptedData;

    const query = `INSERT INTO public.locations (name, latitude, longitude) VALUES ($1, $2, $3)`;
    await client.query(query, [label, latitude, longitude]);

    await client.query("COMMIT"); // Commit transaction
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK"); // Rollback on error
    }
    console.error("Error saving location data:", error);
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
    const query = "SELECT * FROM public.locations ORDER BY id DESC LIMIT 1";
    const result = await client.query(query);

    if (result.rows.length > 0) {
      // Encrypt the retrieved data before sending response
      return result.rows[0];
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error retrieving location data:", error);
    throw error;
  } finally {
    client?.release();
  }
};

export const saveRegistrationData = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumber: number,
): Promise<any> => {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();

    // Extract domain from email (e.g., "tcd.ie")
    const emailDomain = email.split("@")[1];

    // Hash password with bcrypt before storing in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, domain, created_at)
                       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *;`;
    const values = [
      firstName,
      lastName,
      email,
      hashedPassword,
      phoneNumber,
      emailDomain,
    ];

    const result = await client.query(query, values);
    const savedUser = result.rows[0];

    console.log("User registration data saved successfully:", savedUser);
    return savedUser;
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  } finally {
    client?.release();
  }
};

// Updating Password of a User
export const updateUserPasswordInDB = async (
  userId: string,
  hashedPassword: string,
): Promise<void> => {
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();

    const query = `UPDATE users SET password = $1 WHERE id = $2`;
    const values = [hashedPassword, userId];

    await client.query(query, values);

    console.log(`Password updated successfully for user ID: ${userId}`);
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  } finally {
    client?.release();
  }
};

export const fetchRouteDetails = async (
  county: string,
  pickup_day: string,
): Promise<any> => {
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();
    const query = `SELECT * FROM trash_pickup WHERE county = $1 AND pickup_day = $2`;
    const result = await client.query(query, [county, pickup_day]);

    if (result.rows.length > 0) {
      return result.rows;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching route details:", error);
    throw error;
  } finally {
    client?.release();
  }
};

export const updateUserFirstAndLastNameInDB = async (
  userId: string,
  firstName: string,
  lastName: string,
): Promise<void> => {
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();

    const query = `UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3`;
    const values = [firstName, lastName, userId];

    await client.query(query, values);

    console.log(`Name updated successfully for user ID: ${userId}`);
  } catch (error) {
    console.error("Error updating user name:", error);
    throw error;
  } finally {
    client?.release();
  }
};
