import { Request, Response } from "express";
import axios from "axios";
import path from 'path';
import dotenv from 'dotenv';
import {Station,AQIStationsResponse,WeatherData} from './../interfaces/weatherInterfaces'

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const access_token = process.env.WAQI_ACCESS_TOKEN;
const access_token_weather = process.env.WAQI_ACCESS_TOKEN_WEATHER;
// const access_token = '554caaa45869a6f123fb8fa1e0dd48a854f0889a';

//fetch AQI from external API
export const getStationAqi = async (req: Request, res: Response): Promise<void> => {
    const stationId = req.params.stationId;

    if (!access_token) {
        res.status(500).json({ error: "Missing access token" });
        return;
    }

    try {
        const url = `https://api.waqi.info/feed/@${stationId}/?token=${access_token}`;
        const response = await axios.get(url);
        const resStr: any = (response.data)
        console.log(resStr.data, "data");
        const data = resStr.data


        if (resStr.status !== "ok") {
            res.status(500).json({ error: `Failed to fetch AQI for Station ID: ${stationId}` });
            return;
        }

        res.status(200).json({ aqi: data.aqi, city: data.city.name });
    } catch (error) {
        console.error("Error in fetching AQI of stations:", error);
        res.status(500).json({ error: "Error in fetching AQI of stations" });
    }
}

//get stations
export const getStations = async (req: Request, res: Response): Promise<void> => {
    const bounds: string = req.query.bounds as string;

    if (!access_token) {
        res.status(500).json({ error: "Missing access token" });
        return;
    }
    if (!bounds) {
        res.status(400).json({ error: "Bounds parameter is required" });
        return;
    }
    try {
        const url = `https://api.waqi.info/map/bounds?token=${access_token}&latlng=${bounds}`;
        const response = await axios.get<AQIStationsResponse>(url);
        console.log(response.data, "response");


        if (response.data.status !== "ok") {
            res.status(500).json({ error: `Failed to fetch stations for bounds: ${bounds}` });
            return;
        }

        // extract and map station data
        const stations = response.data.data
            .filter((station: Station) => station.uid && station.lat && station.lon)
            .map((station: Station) => ({
                id: station.uid,
                lat: station.lat,
                lon: station.lon,
                name: station.station.name,
            }));

        res.status(200).json({ stations });
    } catch (error) {
        console.error("Error in fetching stations:", error);
        res.status(500).json({ error: "Error in fetching stations of the bound coordinates" });
    }
}

//fetch weather details from external API
export const getWeatherDetails = async (req: Request, res: Response): Promise<void> => {
    const { latitude, longitude } = req.query;
    console.log(req.query,"req.query");
    
    if (!access_token_weather) {
        res.status(500).json({ error: "Missing access token" });
        return;
    }
    if (!latitude || !longitude) {
        res.status(400).json({ error: "Latitude and Longitude parameters are required" });
        return;
    }
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${access_token_weather}&q=${latitude},${longitude}`;
        const response = await axios.get<WeatherData>(url);
        console.log(response,"reponseee");
        

        if (!response.data || !response.data.current) {
            res.status(500).json({ error: `Invalid response structure for coordinates: ${latitude}, ${longitude}` });
            return;
        }

        res.status(200).json({
            location: response.data.location.name,
            country: response.data.location.country,
            temperature: response.data.current.temp_c,
            feels_like: response.data.current.feelslike_c,
            wind_speed: response.data.current.wind_kph,
            humidity: response.data.current.humidity,
            precipitation: response.data.current.precip_mm,
            uv_index: response.data.current.uv,
            weather_condition: response.data.current.condition.text,
            weather_icon: response.data.current.condition.icon,
        });
    } catch (error) {
        console.error("Error in fetching weather details:", error);
        // res.status(500).json({ error: "Error in fetching weather details" });
    }
};