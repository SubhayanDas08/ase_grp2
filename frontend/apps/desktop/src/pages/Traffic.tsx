import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LoadScript } from "@react-google-maps/api";

// Replace with your own actual Google Maps API key or .env variable
const GOOGLE_MAPS_API_KEY = "AIzaSyBo-mXQolZZnHe2jxg1FDm8m-ViYP9_AaY";

// Point this to your FastAPI endpoint
// e.g., if your FastAPI server is on port 8000:
const API_URL = "http://127.0.0.1:8000/predict/trafficCongestion";

// Define a type for the data returned from the API
type TrafficPoint = {
  lat: number;
  lng: number;
  congestionIndex: number;
};

export default function Traffic() {
  // State to hold the returned traffic data (or null if not fetched)
  const [trafficPoint, setTrafficPoint] = useState<TrafficPoint | null>(null);

  // State for selected coordinates from the location search
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  // Default map center (Dublin, Ireland as an example)
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.3498, -6.2603]);

  // Date, Month, Year, Time states (customize as needed)
  const [selectedDate, setSelectedDate] = useState("1");
  const [selectedMonth, setSelectedMonth] = useState("January");
  // If you want a year selector, add it. For now, it's static or unused.
  const [selectedYear] = useState("2025");
  const [selectedTime, setSelectedTime] = useState("00:00");

  // For displaying any errors (e.g., if user tries to fetch without selecting a location)
  const [error, setError] = useState("");

  // Reference to the input field for Google Autocomplete
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Mapping month names to month numbers for the API payload
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

  // Fetch traffic data from the FastAPI backend
  const fetchTrafficDataFromAPI = async () => {
    if (!selectedCoords) {
      setError("Please select a location first.");
      return;
    }

    // Destructure the selected latitude/longitude
    const [lat, lng] = selectedCoords;

    // Build the payload according to what your API expects
    const payload = {
      latitude: lat,
      longitude: lng,
      hour: parseInt(selectedTime.split(":")[0]),
      month: monthNameToNumber[selectedMonth],
      day: parseInt(selectedDate),
      // year: parseInt(selectedYear) // If needed by your backend
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
      // Expecting something like { "congestion_index": [0 or 1 or 2, ...] }
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

  // Set up Google Maps Autocomplete once Google is available
  useEffect(() => {
    const timeout = setTimeout(() => {
      // If google is not loaded or input ref is null, return
      if (!inputRef.current || !window.google) return;

      // Create the Google Maps Autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
        componentRestrictions: { country: "IE" }, // Or remove if you want worldwide
        fields: ["geometry"],
      });

      // Listen for "place_changed" event
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          setMapCenter([lat, lng]);
          setSelectedCoords([lat, lng]);
          setTrafficPoint(null); // Clear any old traffic data
          setError("");
        }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  // Return a color for each congestion index
  // 0 => lightgreen, 1 => green, 2 => yellow, 3 => orange, 4 => red
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
        return "gray"; // fallback
    }
  }

  // NEW FUNCTION: Map index to descriptive text
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

  // Leaflet custom icon: small colored circle
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

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div>
        <h2 className="text-2xl font-bold mb-4">Traffic</h2>

        {/* Controls for searching location, date, time, etc. */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
          {/* Autocomplete input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Location"
            className="w-60 p-2 border border-gray-300 rounded-md bg-white text-black"
          />

          {/* Day selector (1-31) */}
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          {/* Month selector */}
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {Object.keys(monthNameToNumber).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Time selector (00:00 to 23:00) */}
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

          {/* "Go" button to trigger the fetch */}
          <button
            onClick={fetchTrafficDataFromAPI}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go
          </button>

          {/* Error display */}
          {error && <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>}
        </div>

        {/* Map Container */}
        <div style={{ width: "100%", height: "700px", marginTop: "1rem" }}>
          <MapContainer center={mapCenter} zoom={15} style={{ width: "100%", height: "100%", borderRadius: "25px" }}>
            {/* Basic openstreetmap tiles */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* If we have traffic data, show Circle + Marker */}
            {trafficPoint && (
              <>
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
                    {/* Display the date, time, and descriptive congestion */}
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
