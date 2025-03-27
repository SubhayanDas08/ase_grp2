import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple, map } from "leaflet";

import { getStations } from "../../../../shared/utils/weather-map/getStations.ts";
import { getStationAqi } from "../../../../shared/utils/weather-map/getStationAqi.ts";
import { getWeatherDetails } from "../../../../shared/utils/weather-map/getWeatherDetails.ts";
import MarkerIcon from "../../../../shared/components/weather-map/MarkerIcon.tsx";
import { FunnelIcon } from "@heroicons/react/24/outline";
import Dropdown from "../components/dropdown.tsx";

function markerDataDisplay(station: any, weatherDatatype: string) {
  switch (weatherDatatype) {
    case "aqi":
      return (
        <>
          <p>AQI: {station.aqi}</p>
          <p>Lat: {station.lat}, Lon: {station.lon}</p>
        </>
      );
      case "temp":
        return (
          <>
            <p>Temperature: {station.weatherData.temp_c || "N/A"}°C</p>
            <p>Feels Like: {station.weatherData.feelslike_c || "N/A"}°C</p>
            <p>Dewpoint: {station.weatherData.dewpoint_c || "N/A"}°C</p>
            <p>Lat: {station.lat}, Lon: {station.lon}</p>
          </>
      );
      case "wind_kph":
        return (
          <>
            <p>Wind Speed: {station.weatherData.wind_kph || "N/A"} km/h</p>
            <p>Lat: {station.lat}, Lon: {station.lon}</p>
          </>
      );
      case "humidity":
        return (
          <>
            <p>Humidity: {station.weatherData.humidity || "N/A"}%</p>
            <p>Lat: {station.lat}, Lon: {station.lon}</p>
          </>
      );
      case "precip_mm":
        return (
          <>
            <p>Precipitation: {station.weatherData.precip_mm || "N/A"} mm</p>
            <p>Lat: {station.lat}, Lon: {station.lon}</p>
          </>
      );
      case "uv":
        return (
          <>
            <p>UV Index: {station.weatherData.uv || "N/A"}</p>
            <p>Lat: {station.lat}, Lon: {station.lon}</p>
          </>
      );
    default:
      return <p>Invalid weather data type</p>;
  }
}

export default function Weather() {
    const [stations, setStations] = useState<any[]>([]);
    const [weatherDatatype, setWeatherDatatype] = useState<string>("aqi");
    const [menuTitle, setMenuTitle] = useState<string>("Air Quality Index (AQI)");
    const hasFetched = useRef(false);
    const position: LatLngTuple = [53.338252, -6.280805];

    useEffect(() => {
        //Fetching all the stations
        const fetchStations = async () => {
          try {
            //Fetching all stations in a bound
            const bounds = "53.2000,-6.4700,53.4500,-6.0500";
            const stationsList = await getStations(bounds);
            console.log("Fetched stations:", stationsList);
    
            //Fetching AQI for each station
            const stationsAqi = await Promise.all(
              stationsList.map(async (station) => {
                try {
                  const aqi = await getStationAqi(station.id.toString());
                  return {
                    id: station.id,
                    lat: station.lat,
                    lon: station.lon,
                    aqi,
                  };
                } catch (error) {
                  console.error(`Error fetching AQI for station ${station.id}`);
                  return {
                    id: station.id,
                    lat: station.lat,
                    lon: station.lon,
                    aqi: "N/A",
                  };
                }
              }),
            );
    
            //Fetching weather data for each station
            const weatherData = await Promise.all(
              stationsList.map(async (station) => {
                try {
                  const weatherData = await getWeatherDetails(
                    station.lat,
                    station.lon,
                  );
                  return {
                    id: station.id,
                    lat: station.lat,
                    lon: station.lon,
                    weatherData,
                  };
                } catch (error) {
                  console.error(
                    `Error fetching weather data for station ${station.id}`,
                  );
                  return {
                    id: station.id,
                    lat: station.lat,
                    lon: station.lon,
                    weatherData: null,
                  };
                }
              }),
            );
    
            const combinedStations = stationsList.map((station) => ({
              id: station.id,
              lat: station.lat,
              lon: station.lon,
              aqi:
                stationsAqi.find((aqiData) => aqiData.id === station.id)?.aqi ||
                "N/A",
              weatherData:
                weatherData.find((weather) => weather.id === station.id)
                  ?.weatherData || null,
            }));
            setStations(combinedStations);
            hasFetched.current = true;
          } catch (error) {
            console.error("Error fetching stations:", error);
          }
        };
        fetchStations();
    }, []);

    return (
        <div className="h-full w-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Weather</div>
                <div className="flex h-fit w-fit items-center justify-end">
                    <Dropdown
                        menuTitle={menuTitle}
                        menuIcon={
                            <FunnelIcon
                              aria-hidden="true"
                              className="size-5 textLight"
                            />
                        }
                        menuItemTitles={["Air Quality Index (AQI)", "Temperature", "Wind Speed", "Humidity", "Precipitation", "UV Index"]}
                        menuItemFunctions={[
                            () => {
                                setWeatherDatatype("aqi");
                                setMenuTitle("Air Quality Index (AQI)");
                            },
                            () => {
                                setWeatherDatatype("temp");
                                setMenuTitle("Temperature");
                            },
                            () => {
                                setWeatherDatatype("wind_kph");
                                setMenuTitle("Wind Speed");
                            },
                            () => {
                                setWeatherDatatype("humidity");
                                setMenuTitle("Humidity");
                            },
                            () => {
                                setWeatherDatatype("precip_mm");
                                setMenuTitle("Precipitation");
                            },
                            () => {
                                setWeatherDatatype("uv");
                                setMenuTitle("UV Index");
                            },
                        ]}
                        backgroundColor={"primaryColor1BG"}
                        textColor={"textLight"}
                    />
                </div>
            </div>
            <div className="h-full w-full">
                <MapContainer
                    center={position}
                    zoom={13}
                    className="h-full w-full rounded-xl z-10"
                >
                    {/* Base Map Layer */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
            
                    {/* Markers for each station */}
                    {stations.map((station, index) => (
                        <Marker
                            key={index}
                            position={[station.lat, station.lon]}
                            icon={MarkerIcon({ station, weatherDatatype })}
                        >
                            <Popup>
                                <div>
                                  <h3>Weather Station ID: {station.id}</h3>
                                  {markerDataDisplay(station, weatherDatatype)}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    )
}