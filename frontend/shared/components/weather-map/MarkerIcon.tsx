import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  getColorByAqi,
  getColorByTempC,
  getColorByWind,
  getColorByHumidity,
  getColorByPrecip,
  getColorByUv
} from "../../utils/weather-map/colorPickers.ts";

interface MarkerIconProps {
  station: any;
  weatherDatatype: string;
}

function getValueAndColor(station: any, datatype: string): { value: string | number, color: string } {
  const wd = station.weatherData || {};

  switch (datatype) {
    case "aqi": {
      const value = station.aqi ?? "N/A";
      return { value, color: getColorByAqi(Number(value)) };
    }
    case "temp": {
      const value = wd.temp_c ?? "N/A";
      return { value, color: getColorByTempC(Number(value)) };
    }
    case "wind_kph": {
      const value = wd.wind_kph ?? "N/A";
      return { value, color: getColorByWind(Number(value)) };
    }
    case "humidity": {
      const value = wd.humidity ?? "N/A";
      return { value, color: getColorByHumidity(Number(value)) };
    }
    case "precip_mm": {
      const value = wd.precip_mm ?? "N/A";
      return { value, color: getColorByPrecip(Number(value)) };
    }
    case "uv": {
      const value = wd.uv ?? "N/A";
      return { value, color: getColorByUv(Number(value)) };
    }
    default:
      return { value: "?", color: "gray" };
  }
}

export default function MarkerIcon({ station, weatherDatatype }: MarkerIconProps) {
  const { value, color } = getValueAndColor(station, weatherDatatype);
  const textColor = color === "yellow" ? "black" : "white";
  return L.divIcon({
    className: "weather-map-custom-icon",
    html: `<div class="circle" style="background-color: ${color}; color: ${textColor}; font-size: 0.8rem;">${value}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}
