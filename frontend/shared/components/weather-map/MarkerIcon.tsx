import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getColorByAqi, getColorByTempC } from '../../utils/weather-map/colorPickers.ts';

interface MarkerIconProps {
  station: any;
  weatherDatatype: string;
}

export default function MarkerIcon({station, weatherDatatype}:MarkerIconProps){
  const weatherData = station.weatherData || null;
          
  if (!weatherData) {
      console.warn(`⚠️ No weather data found for station: ${station.id}`);
  }

  const value = weatherDatatype === "aqi" ? station.aqi : station.weatherData?.temp_c || "N/A";
  const color = weatherDatatype === "aqi" ? getColorByAqi(Number(value)) : getColorByTempC(Number(value));
  const textColor = color === "yellow" ? "black" : "white";

  return L.divIcon({
      className: "weather-map-custom-icon",
      html: `<div class="circle" style="background-color: ${color}; color: ${textColor};">${value}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
}