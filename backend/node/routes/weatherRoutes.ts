import express from "express";
import { getStationAqi, getStations, getWeatherDetails } from "../controllers/weatherController";

const router = express.Router();

// Route to get AQI for a specific station
router.get("/aqi/:stationId", getStationAqi);
router.get("/stations", getStations);
router.get("/weatherDetails", getWeatherDetails);


export default router;