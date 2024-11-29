"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherData = exports.fetchDataFromFlask = exports.sendDataToFlask = exports.receiveLocationData = void 0;
const databaseService_1 = require("../services/databaseService");
const flaskService_1 = require("../services/flaskService");
// Receive location data from frontend
const receiveLocationData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { label, latitude, longitude } = req.body;
    // Validate request body
    if (!label || !latitude || !longitude) {
        res.status(400).json({ error: 'All fields are required.' });
        return;
    }
    try {
        // Save data to the database
        yield (0, databaseService_1.saveLocationToDatabase)(label, latitude, longitude);
        res.status(201).json({ message: 'Location data received successfully.' });
    }
    catch (error) {
        console.error('Error saving location data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.receiveLocationData = receiveLocationData;
// Send data to Flask backend
const sendDataToFlask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch location data
        const locationData = yield (0, databaseService_1.getLocationData)();
        // Send data to Flask backend
        const response = yield (0, flaskService_1.sendToFlask)(locationData);
        res.status(200).json({ message: 'Data sent to Flask successfully.', response });
    }
    catch (error) {
        console.error('Error sending data to Flask:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.sendDataToFlask = sendDataToFlask;
// Fetch data from Flask backend
const fetchDataFromFlask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch data from Flask service
        const data = yield (0, flaskService_1.fetchFromFlask)();
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching data from Flask:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.fetchDataFromFlask = fetchDataFromFlask;
// Return weather data to frontend
const getWeatherData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mocked weather data
        const weatherData = {
            temperature: 25,
            humidity: 60,
            windSpeed: 15,
            condition: 'Sunny',
            recommendation: 'Wear light clothing',
        };
        res.status(200).json(weatherData);
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.getWeatherData = getWeatherData;
