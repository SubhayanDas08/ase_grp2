"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locationController_1 = require("../controllers/locationController");
const router = express_1.default.Router();
// Route to receive location data from the frontend
router.post('/location', locationController_1.receiveLocationData);
// Route to send location data to the Flask backend
router.post('/sendToFlask', locationController_1.sendDataToFlask);
// Route to fetch data from the Flask backend
router.get('/fetchFromFlask', locationController_1.fetchDataFromFlask);
// Route to return weather data to the frontend
router.get('/weather', locationController_1.getWeatherData);
exports.default = router;
