import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { warn, debug, trace, info, error } from "@tauri-apps/plugin-log";
// Fix marker icon issue in Leaflet with React
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const waqiApiToken = import.meta.env.VITE_WAQI_API_TOKEN;
const weatherApiToken = import.meta.env.VITE_WEATHER_API_TOKEN;

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
});

const MapComponent = () => {
  const [position, setPosition] = useState<[number, number]>([
    53.3498, -6.2603,
  ]); // Default to Dublin
  const [stations, setStations] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const hasFetchedStations = useRef(false); // Ref to track if stations have been fetched
  const [weatherDatatype, setWeatherDatatype] = useState("humidity");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const bounds = "53.2000,-6.4000,53.4100,-6.0500";
        const response = await axios.get(
          `https://api.waqi.info/map/bounds?token=${waqiApiToken}&latlng=${bounds}`,
        );
        const stationData = response.data.data;
        const filteredStations = stationData.filter(
          (station: any) => station.aqi && station.aqi != "-",
        );

        const detailedStations = await Promise.all(
          filteredStations.map(async (station: any) => {
            const stationResponse = await axios.get(
              `https://api.waqi.info/feed/@${station.uid}/?token=${waqiApiToken}`,
            );
            return stationResponse.data.data;
          }),
        );

        setStations(detailedStations);

        // call the weather api for each station (https://api.weatherapi.com/v1/current.json?key=ae06a6ec11aa49f1a7905753250602&q=53.353297983914004,-6.264278548826408)
        // take the VITE_WEATHER_API_TOKEN and the lat and long from the station data
        // set the weather data to the state (setWeatherData)

        const fetchWeatherData = async (lat: number, lon: number) => {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=${weatherApiToken}&q=${lat},${lon}`,
          );
          return response.data;
        };

        const detailedWeatherData = await Promise.all(
          filteredStations.map(async (station: any) => {
            const weatherData = await fetchWeatherData(
              station.lat,
              station.lon,
            );
            return {
              ...station,
              weather: weatherData,
            };
          }),
        );

        setWeatherData(detailedWeatherData);
      } catch (error) {
        console.error("Error fetching station data:", error);
      }
    };

    if (!hasFetchedStations.current) {
      fetchStations();
      hasFetchedStations.current = true; // Set the flag to true after fetching
    }
  }, [waqiApiToken]);

  const getColorByAqi = (aqi: number) => {
    if (aqi <= 25) return "darkgreen";
    if (aqi <= 50) return "green";
    if (aqi <= 75) return "yellow";
    if (aqi <= 100) return "orange";
    return "red";
  };

  const createCustomIcon = (station: any) => {
    const value = weatherDatatype === "aqi" ? station.aqi : station.weather.current.heatindex_c; // Use AQI or humidity based on weatherDatatype
    const color =
      weatherDatatype === "aqi" ? getColorByAqi(Number(value)) : "blue"; // Use color based on AQI or default to blue for humidity
    const textColor = color === "yellow" ? "black" : "white";
    return L.divIcon({
      className: "custom-icon",
      html: `<div class="circle" style="background-color: ${color}; color: ${textColor};">${value}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={position}
        zoom={13}
        className="h-[500px] w-full"
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      >
        {/* Base Map Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Markers for each station */}
        {weatherDatatype === "aqi" ? (
          stations.map((station, index) => (
            <Marker
              key={index}
              position={[station.city.geo[0], station.city.geo[1]]}
              icon={createCustomIcon(station)}
            >
              <Popup>
                <div>
                  <h3>{station.city.name}</h3>
                  <p>AQI: {station.aqi}</p>
                  <p>Time: {station.time.s}</p>
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          weatherData.map((station, index) => (
            // info() station - striginfy first
            info(JSON.stringify(station)),
            <Marker
              key={index}
              position={[station.lat, station.lon]}
              icon={createCustomIcon(station)}
            >
              <Popup>
                <div>
                  <h3>{station.station.name}</h3>
                  {/* <p>Humidity: {station.weather.current.humidity}%</p> */}
                  {/* <p>Time: {station.weather.location.localtime}</p> */}
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
      <style jsx>{`
        .custom-icon .circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
