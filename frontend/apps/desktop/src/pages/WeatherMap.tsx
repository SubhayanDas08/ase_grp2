import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";

import { getStations } from '../../../../shared/utils/weather-map/getStations.ts';
import { getStationAqi } from '../../../../shared/utils/weather-map/getStationAqi.ts';
import { getWeatherDetails } from '../../../../shared/utils/weather-map/getWeatherDetails.ts';
import MarkerIcon from '../../../../shared/components/weather-map/MarkerIcon.tsx';


const MapComponent = () =>{
    const [stations, setStations] = useState<any[]>([]);
    const [weatherDatatype, setWeatherDatatype] = useState<string>("aqi");
    const hasFetched = useRef(false);
    const position:LatLngTuple = [53.338252, -6.280805]; 

    useEffect(()=>{
        //Fetching all the stations
        const fetchStations = async () => {
            try {

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
        };
        fetchStations();
    },[]);

      return (
        <div className="h-full w-full">
          <div className="text-right">
            
            <div className="relative inline-block text-left">
              <div>
                <button type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                  Options
                  <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                <div className="py-1" role="none">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-0">Account settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-1">Support</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-2">License</a>
                  <form method="POST" action="#" role="none">
                    <button type="submit" className="block w-full px-4 py-2 text-left text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-3">Sign out</button>
                  </form>
                </div>
              </div>
            </div>
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
                icon={MarkerIcon({station, weatherDatatype})}
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
        </div>
      );
}

export default MapComponent;