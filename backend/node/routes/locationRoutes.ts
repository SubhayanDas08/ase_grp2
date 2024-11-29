import express, { Router } from 'express'
import {
  receiveLocationData,
  sendDataToFlask,
  fetchDataFromFlask,
  getWeatherData,
} from '../controllers/locationController'

const router: Router = express.Router()

// Route to receive location data from the frontend
router.post('/location', receiveLocationData)

// Route to send location data to the Flask backend
router.post('/sendToFlask', sendDataToFlask)

// Route to fetch data from the Flask backend
router.get('/fetchFromFlask', fetchDataFromFlask)

// Route to return weather data to the frontend
router.get('/weather', getWeatherData)

export default router
