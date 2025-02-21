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
const aesEncryption_1 = require("../Interceptors/aesEncryption"); // Check correct import path
// Receive encrypted location data from frontend
const receiveLocationData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate encrypted data existence
        if (!req.body.encryptedData) {
            return res.status(400).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: 'Invalid request. Missing encrypted data.' })) });
        }
        // Decrypt the incoming request body
        const decryptedString = (0, aesEncryption_1.aesDecrypt)(req.body.encryptedData);
        if (typeof decryptedString !== 'string') {
            throw new Error('Decryption failed');
        }
        const decryptedData = JSON.parse(decryptedString);
        const { label, latitude, longitude } = decryptedData;
        // Validate request body
        if (!label || !latitude || !longitude) {
            return res.status(400).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: 'All fields are required.' })) });
        }
        // Save data to the database
        yield (0, databaseService_1.saveLocationToDatabase)(label, latitude, longitude);
        // Encrypt and send response
        res.status(201).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ message: 'Location data received successfully.' })) });
    }
    catch (error) {
        console.error('Error saving location data:', error);
        res.status(500).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: 'Internal server error.' })) });
    }
});
exports.receiveLocationData = receiveLocationData;
// Send encrypted location data to Flask backend
const sendDataToFlask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch location data
        const locationData = yield (0, databaseService_1.getLocationData)();
        // Send data to Flask backend
        const response = yield (0, flaskService_1.sendToFlask)(locationData);
        // Encrypt and send response
        res.status(200).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ message: 'Data sent to Flask successfully.', response })) });
    }
    catch (error) {
        console.error('Error sending data to Flask:', error);
        res.status(500).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: 'Internal server error.' })) });
    }
});
exports.sendDataToFlask = sendDataToFlask;
// Fetch encrypted data from Flask backend
const fetchDataFromFlask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch data from Flask service
        const data = yield (0, flaskService_1.fetchFromFlask)();
        // Encrypt and send response
        res.status(200).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify(data)) });
    }
    catch (error) {
        console.error('Error fetching data from Flask:', error);
        res.status(500).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: 'Internal server error.' })) });
    }
});
exports.fetchDataFromFlask = fetchDataFromFlask;
// Return encrypted weather data to frontend
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
        // Encrypt and send response
        res.status(200).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify(weatherData)) });
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ encryptedData: (0, aesEncryption_1.aesEncrypt)(JSON.stringify({ error: 'Internal server error.' })) });
    }
});
exports.getWeatherData = getWeatherData;
