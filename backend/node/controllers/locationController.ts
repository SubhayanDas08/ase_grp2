import { Request, Response } from 'express'
import { saveLocationToDatabase, getLocationData } from '../services/databaseService'
import { sendToFlask, fetchFromFlask } from '../services/flaskService'

// Receive location data from frontend
export const receiveLocationData = async (req: Request, res: Response): Promise<void> => {
  const { label, latitude, longitude } = req.body

  // Validate request body
  if (!label || !latitude || !longitude) {
    res.status(400).json({ error: 'All fields are required.' })
    return
  }

  try {
    // Save data to the database
    await saveLocationToDatabase(label, latitude, longitude)
    res.status(201).json({ message: 'Location data received successfully.' })
  } catch (error) {
    console.error('Error saving location data:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

// Send data to Flask backend
export const sendDataToFlask = async (req: Request, res: Response): Promise<any> => {
  try {
    // Fetch location data
    const locationData:{ name: string; latitude: number; longitude: number }  = await getLocationData()

    // Send data to Flask backend
    const response
    = await sendToFlask(locationData)

    res.status(200).json({ message: 'Data sent to Flask successfully.', response })
  } catch (error) {
    console.error('Error sending data to Flask:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

// Fetch data from Flask backend
export const fetchDataFromFlask = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch data from Flask service
    const data = await fetchFromFlask()

    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching data from Flask:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

// Return weather data to frontend
export const getWeatherData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Mocked weather data
    const weatherData = {
      temperature: 25,
      humidity: 60,
      windSpeed: 15,
      condition: 'Sunny',
      recommendation: 'Wear light clothing',
    }

    res.status(200).json(weatherData)
  } catch (error) {
    console.error('Error fetching weather data:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
