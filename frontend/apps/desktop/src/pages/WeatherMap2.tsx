import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { getStations } from '../api_handler/getStations.tsx';
import { getStationAqi } from '../api_handler/getStationAqi.tsx';
import { getWeatherDetails } from '../api_handler/getWeatherDetails.tsx';

const getColorByAqi = (aqi: number) => {
    if (aqi <= 25) return "darkgreen";
    if (aqi <= 50) return "green";
    if (aqi <= 75) return "yellow";
    if (aqi <= 100) return "orange";
    return "red";
  };

  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const MapComponent = () =>{
    const [stations, setStations] = useState<any[]>([]);
    // const [bounds, setBounds] = useState<string>("53.2000,-6.4000,53.4100,-6.0500");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [weatherDatatype, setWeatherDatatype] = useState<string>("humidity");
    const hasFetched = useRef(false);
    const position:LatLngTuple = [53.338252, -6.280805]; 

    useEffect(()=>{
        //Fetching all the stations
        const fetchStations = async () => {
            try {
                setIsLoading(true);

                //Fetching all stations in a bound
                const bounds = "53.2000,-6.4000,53.4100,-6.0500";
                const stationsList = await getStations(bounds);
                console.log("Fetched stations:", stationsList);

                //Fetching AQI for each station
                const stationsAqi=await Promise.all(
                    stationsList.map(async(station)=>{
                        try {
                            const aqi=await getStationAqi(station.id.toString());
                            return { id: station.id, lat: station.lat, lon: station.lon, aqi };
                        } catch (error) {
                            console.error(`Error fetching AQI for station ${station.id}`);
                            return { id: station.id, lat: station.lat, lon: station.lon, aqi: "N/A" };
                        }
                    })
                );

                //Fetching weather data for each station
                const weatherData=await Promise.all(
                    stationsList.map(async (station) => {
                        try {
                            const weatherData = await getWeatherDetails(station.lat,station.lon);
                            return { id: station.id, lat: station.lat, lon: station.lon, weatherData };
                        } catch (error) {
                            console.error(`Error fetching weather data for station ${station.id}`);
                            return { id: station.id, lat: station.lat, lon: station.lon, weatherData: null };
                        }
                      })
                );

                const combinedStations = stationsList.map((station) => ({
                    id: station.id,
                    lat: station.lat,
                    lon: station.lon,
                    aqi: stationsAqi.find((aqiData) => aqiData.id === station.id)?.aqi || "N/A",
                    weatherData: weatherData.find((weather) => weather.id === station.id)?.weatherData || null,
                  }));
                setStations(combinedStations);
                hasFetched.current = true;

            } catch (error) {
                console.error("Error fetching stations:", error);
            }
            finally{
                setIsLoading(false);
            }
        };
        fetchStations();
    },[]);

      const createCustomIcon = (station: any) => {
        const weatherData = station.weatherData || null;
        
        if (!weatherData) {
            console.warn(`⚠️ No weather data found for station: ${station.id}`);
        }

        const value = weatherDatatype === "aqi" ? station.aqi : station.weatherData?.temp_c || "N/A";
        const color = weatherDatatype === "aqi" ? getColorByAqi(Number(value)) : "blue";
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
            {stations.map((station, index) => (
              <Marker
                key={index}
                position={[station.lat, station.lon]}
                icon={createCustomIcon(station)}
              >
                <Popup>
                  <div>
                    <h3>{station.id}</h3>
                    {weatherDatatype === "aqi" ? (
                      <>
                        <p>AQI: {station.aqi}</p>
                        <p>Lat: {station.lat}, Lon: {station.lon}</p>
                      </>
                    ) : (
                      <>
                        <p>Humidity: {station.weather?.current?.humidity || "N/A"}%</p>
                        <p>Temperature: {station.weather?.current?.temp_c || "N/A"}°C</p>
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Custom Marker Styling */}
          <style>
            {`
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
            `}
        </style>
        </div>
      );
}

export default MapComponent;