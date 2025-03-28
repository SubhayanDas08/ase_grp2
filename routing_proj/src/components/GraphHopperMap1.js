import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import LocationSearch from "./LocationSearch";
import Select from "react-select";
import tollData from "./tollData.json";
import busStopsData from "./bus_stops.json";

// Custom Markers
const redMarker = new L.Icon({
  iconUrl: "red-marker.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const greenMarker = new L.Icon({
  iconUrl: "destination.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const tollMarker = new L.Icon({
  iconUrl: "toll-marker.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const userMarker = new L.Icon({
  iconUrl: "user-marker.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const stopMarker = new L.Icon({
  iconUrl: "bus_stop.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Route Colors
const routeColors = ["blue", "purple", "orange"];

const GraphHopperMap = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [distances, setDistances] = useState([]);
  const [times, setTimes] = useState([]);
  const [tollCosts, setTollCosts] = useState([]);
  const [transportMode, setTransportMode] = useState("car");
  const [userLocation, setUserLocation] = useState(null);

  const transportOptions = [
    { value: "car", label: "Car" },
    { value: "bike", label: "Bike" },
    { value: "foot", label: "Walking" },
    { value: "bus", label: "Public Transport" },

  ];

  // Convert degrees to radians
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  // Calculate haversine distance between two points
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon1 - lon2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch user's location
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoords = [position.coords.latitude, position.coords.longitude];
              setUserLocation(userCoords);
              setStartLocation({
                coordinates: userCoords,
                label: "Trinity College, Dublin City",
                name: "Trinity College, Dublin City",
                type: "LOCALITY",
                id: "E0822090",
                eastingnorthing: "31598207,23408364"
              });
            },
            async (error) => {
              console.error("Geolocation error:", error);
              try {
                const response = await axios.get("https://ipapi.co/json/");
                const userCoords = [response.data.latitude, response.data.longitude];
                setUserLocation(userCoords);
                setStartLocation({
                  coordinates: userCoords,
                  label: "Trinity College, Dublin City",
                  name: "Trinity College, Dublin City",
                  type: "LOCALITY",
                  id: "E0822090",
                  eastingnorthing: "31598207,23408364"
                });
              } catch (ipError) {
                console.error("Error fetching location from IP API:", ipError);
              }
            }
          );
        } else {
          const response = await axios.get("https://ipapi.co/json/");
          const userCoords = [response.data.latitude, response.data.longitude];
          setUserLocation(userCoords);
          setStartLocation({
            coordinates: userCoords,
            label: "Trinity College, Dublin City",
            name: "Trinity College, Dublin City",
            type: "LOCALITY",
            id: "E0822090",
            eastingnorthing: "31598207,23408364"
          });
        }
      } catch (err) {
        console.error("Unexpected error fetching location:", err);
      }
    };

    fetchUserLocation();
  }, []);

  const fetchPublicTransportRoutes = async (startLoc, endLoc) => {
    const apiUrl = 'https://api-lts.transportforireland.ie/lts/lts/v1/public/planJourney';
    const currentDate = new Date().toISOString();

    console.log('origin:', startLoc);
    console.log('destination:', endLoc);

    const requestBody = {
      "type": "LEAVE_AFTER",
      "modes": [
        "BUS",
        "RAIL"
      ],
      "date": currentDate,
      "time": currentDate,
      "clientTimeZoneOffsetInMs": 0,
      "routeType": "FASTEST",
      "cyclePlanType": "BALANCED",
      "cycleSpeed": 20,
      "walkingSpeed": 1,
      "maxWalkTime": 30,
      "minComfortWaitTime": 5,
      "includeRealTimeUpdates": true,
      "restrictToFreeTravelPassOnly": false,
      "showNoBikesAllowedOnTrains": false,
      "includeIntermediateStops": true,
      "operator": {
        "code": "",
        "name": "journeyPlanner.options.publicTransport.operator.anyOperator"
      },
      "origin": {
        "coordinate": {
          "latitude": startLoc.coordinates[0],
          "longitude": startLoc.coordinates[1]
        },
        "id": startLoc.id,
        "name": startLoc.name,
        "type": startLoc.type
      },
      "destination": {
        "status": {
          "success": true
        },
        "name": endLoc.name,
        "id": endLoc.id,
        "coordinate": {
          "latitude": endLoc.coordinates[0],
          "longitude": endLoc.coordinates[1]
        },
        "type": endLoc.type
      },
      "via": null
    };


    try {
      console.log('Fetching public transport routes:', requestBody);
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '630688984d38409689932a37a8641bb9'
        }
      });
      console.log('Public transport response:', response.data);
      return response.data;
    } catch (error) { 
      console.error('Error fetching public transport routes:', error);
      throw error;
    }
  };


  // Fetch routes from GraphHopper API
  const fetchRoutes = async (mode) => {
    console.log("fetchRoutes called with mode:", mode);
    if (!startLocation || !endLocation) {
      alert("Please select both start and destination locations.");
      return;
    }

    console.log("Start Location:", startLocation);
    console.log("End Location:", endLocation);

    try {
      if (mode === 'bus') {
        const response = await fetchPublicTransportRoutes(startLocation, endLocation);
        console.log("Public transport response:", response);
        if (response && response.length > 0) {
          const processedRoutes = response.slice(0, 3).map(journey => {
            const durationMatch = journey.duration.match(/PT(\d+)M/);
            const duration = durationMatch ? durationMatch[1] : "0";

            const coordinates = [];
            journey.legs.forEach(leg => {
              if (leg.path?.points) {
                const decodedPoints = leg.path.points
                  .split(' ')
                  .map(point => {
                    const [lat, lng] = point.split(',').map(Number);
                    return [lat, lng];
                  });
                coordinates.push(...decodedPoints);
              } else if (leg.origin?.coordinate && leg.destination?.coordinate) {
                coordinates.push(
                  [leg.origin.coordinate.latitude, leg.origin.coordinate.longitude],
                  [leg.destination.coordinate.latitude, leg.destination.coordinate.longitude]
                );
              }
            });

            // Remove duplicate consecutive coordinates
            const uniqueCoordinates = coordinates.filter((coord, index) => {
              if (index === 0) return true;
              return !(coord[0] === coordinates[index - 1][0] && coord[1] === coordinates[index - 1][1]);
            });

            let totalDistance = 0;
            for (let i = 1; i < uniqueCoordinates.length; i++) {
              totalDistance += haversineDistance(
                uniqueCoordinates[i - 1][0],
                uniqueCoordinates[i - 1][1],
                uniqueCoordinates[i][0],
                uniqueCoordinates[i][1]
              );
            }

            return {
              route: uniqueCoordinates,
              duration: duration,
              distance: totalDistance,
              legs: journey.legs.map(leg => ({
                mode: leg.mode,
                serviceNumber: leg.serviceNumber || '',
                operator: leg.operator?.name || ''
              }))
            };
          });

          const validRoutes = processedRoutes.filter(route => route.route.length > 1);

          if (validRoutes.length > 0) {
            setRoutes(validRoutes.map(r => r.route));
            setDistances(validRoutes.map(r => r.distance.toFixed(2)));
            setTimes(validRoutes.map(r => r.duration));
            setTollCosts([]);
          } else {
            throw new Error("No valid routes found with coordinates");
          }
        } else {
          throw new Error("No routes returned from the API");
        }
      } else {
        // Original GraphHopper API call for other transport modes
        const apiKey = 'afa8f81e-bb1b-4d1e-aec9-c6bd1664d322';
        const url = `https://graphhopper.com/api/1/route?point=${startLocation.coordinates[0]},${startLocation.coordinates[1]}&point=${endLocation.coordinates[0]},${endLocation.coordinates[1]}&profile=${mode}&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${apiKey}`;

        console.log("GraphHopper API URL:", url);
        const response = await axios.get(url);
        console.log("Raw response from GraphHopper API:", response.data);

        if (response.data.paths.length > 0) {
          const allRoutes = response.data.paths.map((path) =>
            path.points.coordinates.map(([lng, lat]) => [lat, lng])
          );

          const allDistances = response.data.paths.map((path) =>
            (path.distance / 1000).toFixed(2)
          );

          const allTimes = response.data.paths.map((path) =>
            (path.time / 60000).toFixed(2)
          );

          const calculatedTollCosts = allRoutes.map((route) => {
            let tollCost = 0;
            let tollsPassed = new Map();
            route.forEach(([lat, lng]) => {
              tollData.forEach((toll) => {
                if (haversineDistance(lat, lng, toll.Latitude, toll.Longitude) < 0.5) {
                  tollsPassed.set(toll["Toll Name"], toll);
                }
              });
            });
            tollsPassed.forEach((toll) => (tollCost += parseFloat(toll["Toll Price"])));
            return {
              cost: tollCost.toFixed(2),
              tolls: Array.from(tollsPassed.values()).map(t => t["Toll Name"])
            };
          });

          setRoutes(allRoutes);
          setDistances(allDistances);
          setTimes(allTimes);
          setTollCosts(calculatedTollCosts);
        } else {
          alert("No routes found.");
        }
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      alert(`Error fetching ${mode} routes. Please try again.`);
    }way Coach Stn, Galway",
  };
  // Check if two locations are the same
  const isSameLocation = (loc1, loc2) => {
    return loc1 && loc2 && loc1[0] === loc2[0] && loc1[1] === loc2[1];
  };

  return (
    <div>
      <Select
        options={transportOptions}
        defaultValue={transportOptions[0]}
        onChange={(selected) => {
          console.log("Selected transport mode:", selected.value);
          setTransportMode(selected.value)
        }
        }
      />
      <LocationSearch
        onSelect={setStartLocation}
        label="Starting Location"
        defaultLocation={userLocation}
      />
      <LocationSearch
        onSelect={setEndLocation}
        label="Destination Location"
      />
      <button
        onClick={() => fetchRoutes(transportMode)}
        disabled={!startLocation || !endLocation}
      >
        Get Routes
      </button>
      {routes.length > 0 && routes.map((_, index) => (
        <p key={index}>
          <span style={{ color: routeColors[index % routeColors.length], fontWeight: "bold" }}>
            {index === 0 ? "✅ Optimized Route" : `🔄 Alternative Route ${index}`}
          </span>: 📏 <strong>{distances[index]} km</strong> | ⏳ <strong>{times[index]} min</strong>
          {transportMode === "car" && <> | 💰 Toll: <strong>€{tollCosts[index].cost}</strong></>}
        </p>
      ))}
      <MapContainer
        center={(startLocation?.coordinates && startLocation.coordinates) || userLocation || [53.3498, -6.2603]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {startLocation?.coordinates && userLocation && !isSameLocation(startLocation.coordinates, userLocation) && (
          <Marker position={startLocation.coordinates} icon={redMarker} />
        )}
        {endLocation?.coordinates && (
          <Marker position={endLocation.coordinates} icon={greenMarker} />
        )}
        {tollData.map((toll, index) => (
          <Marker
            key={index}
            position={[toll.Latitude, toll.Longitude]}
            icon={tollMarker}
          >
            <Popup>{toll["Toll Name"]} - €{toll["Toll Price"]}</Popup>
          </Marker>
        ))}
        {/* {transportMode !== "car" && busStopsData.map((stop, index) => (
          <Marker 
            key={index} 
            position={[stop.stop_lat, stop.stop_lon]} 
            icon={stopMarker}
          >
            <Popup>{stop.stop_name}</Popup>
          </Marker>
        ))} */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route}
            color={routeColors[index % routeColors.length]}
          />
        ))}
        {userLocation && (
          <Marker position={userLocation} icon={userMarker}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default GraphHopperMap;