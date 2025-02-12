import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationSearch = ({ onSelect, label, defaultLocation }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions from Nominatim API
  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
      );

      setSuggestions(
        response.data.map((place) => ({
          label: place.display_name,
          value: [parseFloat(place.lat), parseFloat(place.lon)],
        }))
      );
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Reverse geocode to get the address for defaultLocation (if available)
  const fetchDefaultLocation = async () => {
    if (defaultLocation) {
      try {
        const [lat, lon] = defaultLocation;
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        setQuery(response.data.display_name); // Set the address as query
      } catch (error) {
        console.error("Error reverse geocoding default location:", error);
      }
    }
  };

  useEffect(() => {
    // Fetch address if a default location is provided
    fetchDefaultLocation();
  }, [defaultLocation]);

  const handleSelect = (selectedLocation) => {
    onSelect(selectedLocation.value); // Pass latitude & longitude to parent
    setQuery(selectedLocation.label); // Set the input field to the selected place name
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        placeholder="Enter location"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchSuggestions(e.target.value);
        }}
      />
      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              style={{ cursor: "pointer", padding: "5px", border: "1px solid #ddd" }}
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
