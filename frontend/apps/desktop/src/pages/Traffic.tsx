import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LoadScript } from "@react-google-maps/api";

// Replace with your own actual Google Maps API key or .env variable
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Point this to your FastAPI endpoint
const API_URL = "https://city-management.walter-wm.de/predict/trafficCongestion";

// Define a type for the data returned from the API
type TrafficPoint = {
  lat: number;
  lng: number;
  congestionIndex: number;
};

// Get current date and month
const currentDate = new Date();
const currentDay = String(currentDate.getDate());
const currentMonthName = currentDate.toLocaleString("default", { month: "long" });

export default function Traffic() {
  const [trafficPoint, setTrafficPoint] = useState<TrafficPoint | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.3498, -6.2603]);
  const [selectedDate, setSelectedDate] = useState(currentDay);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedYear] = useState("2025");
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const monthNameToNumber: { [key: string]: number } = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const fetchTrafficDataFromAPI = async () => {
    if (!selectedCoords) {
      setError("Please select a location first.");
      return;
    }

    const [lat, lng] = selectedCoords;

    const payload = {
      latitude: lat,
      longitude: lng,
      hour: parseInt(selectedTime.split(":")[0]),
      month: monthNameToNumber[selectedMonth],
      day: parseInt(selectedDate),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const index = data.congestion_index?.[0] ?? 0;

      setTrafficPoint({
        lat,
        lng,
        congestionIndex: index,
      });
      setError("");
    } catch (err) {
      console.error("API Error:", err);
      setTrafficPoint(null);
      setError("Failed to fetch traffic data. Please check console or server logs.");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!inputRef.current || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
        componentRestrictions: { country: "IE" },
        fields: ["geometry"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          setMapCenter([lat, lng]);
          setSelectedCoords([lat, lng]);
          setTrafficPoint(null);
          setError("");
        }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  function getColorForIndex(index: number): string {
    switch (index) {
      case 0:
        return "lightgreen";
      case 1:
        return "green";
      case 2:
        return "yellow";
      case 3:
        return "orange";
      case 4:
        return "red";
      default:
        return "gray";
    }
  }

  function getDescriptionForIndex(index: number): string {
    switch (index) {
      case 0:
        return "Very Light Congestion";
      case 1:
        return "Light Congestion";
      case 2:
        return "Moderate Traffic";
      case 3:
        return "Heavy Traffic";
      case 4:
        return "Very Heavy Traffic";
      default:
        return "Unknown Congestion";
    }
  }

  function getCircularIcon(color: string) {
    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid white;"></div>`,
      className: "",
      iconSize: [18, 18],
      popupAnchor: [0, -10],
    });
  }

  // Component to fly to the new location
  function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
      map.flyTo([lat, lng], 15, { duration: 1.5 });
    }, [lat, lng, map]);
    return null;
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div className="h-full w-full flex flex-col">
        {/* Header Section */}
        <div className="mainHeaderHeight w-full flex items-center justify-between">
            <div className="titleText primaryColor1">Traffic</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search Location"
                className="w-60 p-2 border border-gray-300 rounded-md bg-white text-black"
              />

              <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>

              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {Object.keys(monthNameToNumber).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                {[...Array(24)].map((_, h) => {
                  const time = `${String(h).padStart(2, "0")}:00`;
                  return (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  );
                })}
              </select>

              <button
                onClick={fetchTrafficDataFromAPI}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
              >
                Go
              </button>

              {error && <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>}
            </div>
        </div>

        <div className="flex flex-col h-full w-full overflow-y-auto">
          <MapContainer center={mapCenter} zoom={15} style={{ width: "100%", height: "100%", borderRadius: "25px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {trafficPoint && (
              <>
                <FlyToLocation lat={trafficPoint.lat} lng={trafficPoint.lng} />

                <Circle
                  center={[trafficPoint.lat, trafficPoint.lng]}
                  radius={300}
                  pathOptions={{
                    fillColor: getColorForIndex(trafficPoint.congestionIndex),
                    fillOpacity: 0.4,
                    color: getColorForIndex(trafficPoint.congestionIndex),
                    weight: 2,
                  }}
                />
                <Marker
                  position={[trafficPoint.lat, trafficPoint.lng]}
                  icon={getCircularIcon(getColorForIndex(trafficPoint.congestionIndex))}
                  zIndexOffset={1000}
                >
                  <Popup>
                    <div>
                      <p>
                        <strong>Date:</strong> {selectedDate} {selectedMonth}, {selectedYear}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedTime}
                      </p>
                      <p>
                        <strong>Congestion:</strong> {getDescriptionForIndex(trafficPoint.congestionIndex)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </LoadScript>
  );
}
