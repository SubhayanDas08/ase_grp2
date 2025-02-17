import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import { FunnelIcon } from "@heroicons/react/20/solid";

import { getStations } from "../../../../shared/utils/weather-map/getStations.ts";
import { getStationAqi } from "../../../../shared/utils/weather-map/getStationAqi.ts";
import { getWeatherDetails } from "../../../../shared/utils/weather-map/getWeatherDetails.ts";
import MarkerIcon from "../../../../shared/components/weather-map/MarkerIcon.tsx";
import Dropdown from "../../../../shared/components/Dropdown.tsx";

const MapComponent = () => {
  const [stations, setStations] = useState<any[]>([]);
  const [weatherDatatype, setWeatherDatatype] = useState<string>("aqi");
  const [menuTitle, setMenuTitle] = useState<string>("Air Quality Index");
  const hasFetched = useRef(false);
  const position: LatLngTuple = [53.338252, -6.280805];

  useEffect(() => {
    //Fetching all the stations
    const fetchStations = async () => {
      try {
        //Fetching all stations in a bound
        const bounds = "53.2000,-6.4000,53.4100,-6.0500";
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
    <div className="h-full w-full">
      <div className="text-right mb-2">
        <Dropdown
          menuTitle={menuTitle}
          menuIcon={
            <FunnelIcon
              aria-hidden="true"
              className="-mr-1 size-5 text-gray-400"
            />
          }
          menuItemTitles={["Air Quality Index", "Temperature"]}
          menuItemFunctions={[
            () => {
              setWeatherDatatype("aqi");
              setMenuTitle("Air Quality Index");
            },
            () => {
              setWeatherDatatype("temperature");
              setMenuTitle("Temperature");
            },
          ]}
        />
      </div>
      <MapContainer
        center={position}
        zoom={13}
        className="h-[500px] w-full .border-radius"
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
                <h3>{station.id}</h3>
                {weatherDatatype === "aqi" ? (
                  <>
                    <p>AQI: {station.aqi}</p>
                    <p>
                      Lat: {station.lat}, Lon: {station.lon}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      Humidity: {station.weather?.current?.humidity || "N/A"}%
                    </p>
                    <p>
                      Temperature: {station.weather?.current?.temp_c || "N/A"}°C
                    </p>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
