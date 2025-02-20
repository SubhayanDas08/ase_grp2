import { Request, Response } from 'express';
import { saveLocationToDatabase, getLocationData } from '../services/databaseService';
import { sendToFlask, fetchFromFlask } from '../services/flaskService';
import { aesEncrypt, aesDecrypt } from '../interceptors/aesEncryption'; // Check correct import path

// Receive encrypted location data from frontend
export const receiveLocationData = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validate encrypted data existence
    if (!req.body.encryptedData) {
      return res.status(400).json({ encryptedData: aesEncrypt(JSON.stringify({ error: 'Invalid request. Missing encrypted data.' })) });
    }

    // Decrypt the incoming request body
    const decryptedString = aesDecrypt(req.body.encryptedData);
    if (typeof decryptedString !== 'string') {
      throw new Error('Decryption failed');
    }

    const decryptedData = JSON.parse(decryptedString);
    const { label, latitude, longitude } = decryptedData;

    // Validate request body
    if (!label || !latitude || !longitude) {
      return res.status(400).json({ encryptedData: aesEncrypt(JSON.stringify({ error: 'All fields are required.' })) });
    }

    // Save data to the database
    await saveLocationToDatabase(label, latitude, longitude);

    // Encrypt and send response
    res.status(201).json({ encryptedData: aesEncrypt(JSON.stringify({ message: 'Location data received successfully.' })) });
  } catch (error) {
    console.error('Error saving location data:', error);
    res.status(500).json({ encryptedData: aesEncrypt(JSON.stringify({ error: 'Internal server error.' })) });
  }
};

// Send encrypted location data to Flask backend
export const sendDataToFlask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch location data
    const locationData = await getLocationData();

    // Send data to Flask backend
    const response = await sendToFlask(locationData);

    // Encrypt and send response
    res.status(200).json({ encryptedData: aesEncrypt(JSON.stringify({ message: 'Data sent to Flask successfully.', response })) });
  } catch (error) {
    console.error('Error sending data to Flask:', error);
    res.status(500).json({ encryptedData: aesEncrypt(JSON.stringify({ error: 'Internal server error.' })) });
  }
};

// Fetch encrypted data from Flask backend
export const fetchDataFromFlask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch data from Flask service
    const data = await fetchFromFlask();

    // Encrypt and send response
    res.status(200).json({ encryptedData: aesEncrypt(JSON.stringify(data)) });
  } catch (error) {
    console.error('Error fetching data from Flask:', error);
    res.status(500).json({ encryptedData: aesEncrypt(JSON.stringify({ error: 'Internal server error.' })) });
  }
};

// Return encrypted weather data to frontend
export const getWeatherData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Mocked weather data
    const weatherData = {
      temperature: 25,
      humidity: 60,
      windSpeed: 15,
      condition: 'Sunny',
      recommendation: 'Wear light clothing',
    };

    // Encrypt and send response
    res.status(200).json({ encryptedData: aesEncrypt(JSON.stringify(weatherData)) });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ encryptedData: aesEncrypt(JSON.stringify({ error: 'Internal server error.' })) });
  }
};