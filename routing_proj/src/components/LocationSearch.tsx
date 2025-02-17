import React, { useState, useEffect } from "react";
import axios from "axios";

interface LocationSearchProps {
  onSelect: (location: [number, number]) => void;
  label: string;
  defaultLocation?: [number, number] | null;
}

interface Suggestion {
  label: string;
  value: [number, number];
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelect, label, defaultLocation }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const fetchSuggestions = async (input: string) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${input}`);
      setSuggestions(response.data.map((place: any) => ({
        label: place.display_name,
        value: [parseFloat(place.lat), parseFloat(place.lon)],
      })));
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const fetchDefaultLocation = async () => {
    if (defaultLocation) {
      try {
        const [lat, lon] = defaultLocation;
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        setQuery(response.data.display_name);
      } catch (error) {
        console.error("Error reverse geocoding default location:", error);
      }
    }
  };

  useEffect(() => {
    fetchDefaultLocation();
  }, [defaultLocation]);

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
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => { onSelect(suggestion.value); setQuery(suggestion.label); setSuggestions([]); }}>
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;