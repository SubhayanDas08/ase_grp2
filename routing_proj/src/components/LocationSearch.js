import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationSearch = ({
  onSelect,
  label,
  defaultLocation,
  mode = 'search' // Add mode prop with default value
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions from Transport for Ireland API
  const fetchSuggestions = async (input) => {
    if (!input) {
      console.log("No input");
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api-lts.transportforireland.ie/lts/lts/v1/public/locationLookup?query=${input}&language=en&resultOrder=POST_CODE,LOCALITY,TRAIN_STATION,TRAM_STOP_AREA,BUS_STOP,STREET,ADDRESS`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': '630688984d38409689932a37a8641bb9'
          }
        }
      );

      // Filter out locations without coordinates or without id and transform the data
      const validLocations = response.data.filter(location =>
        location.status.success &&
        location.coordinate &&
        location.coordinate.latitude &&
        location.coordinate.longitude &&
        location.id &&
        location.eastingnorthing
      );


      const mappedSuggestions = validLocations.map((place) => {
        const suggestion = {
          label: `${place.name}`,
          name: place.name,
          coordinates: [
            parseFloat(place.coordinate.latitude),
            parseFloat(place.coordinate.longitude)
          ],
          type: place.type,
          id: place.id,
          eastingnorthing: place.eastingnorthing,
        };
        return suggestion;
      });

      console.log("Final mapped suggestions:", mappedSuggestions);

      setSuggestions(mappedSuggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    }
  };

  // Reverse geocode to get the address for defaultLocation
  const fetchDefaultLocation = async () => {
    if (defaultLocation) {
      try {
        setQuery("Current Location");
      } catch (error) {
        console.error("Error setting default location:", error);
        setQuery("");
      }
    }
  };

  useEffect(() => {
    fetchDefaultLocation();
  }, [defaultLocation]);

  const handleSelect = (selectedLocation) => {
    onSelect(selectedLocation);
    setQuery(selectedLocation.name);
    setSuggestions([]);
  };

  // Debounce function to limit API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  return (
    <div className="location-search">
      <label>{label}</label>
      <input
        type="text"
        placeholder="Enter location in Ireland"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedFetchSuggestions(e.target.value);
        }}
        style={{
          width: '100%',
          padding: '8px',
          marginTop: '4px',
          marginBottom: '4px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      {suggestions.length > 0 && (
        <ul style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              style={{
                cursor: "pointer",
                padding: "8px 12px",
                borderBottom: '1px solid #eee',
                backgroundColor: 'white'
              }}
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