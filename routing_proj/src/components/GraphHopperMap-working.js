import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import LocationSearch from "./LocationSearch";
import Select from "react-select";
import tollData from "./tollData.json";

// Configuration constants
const GRAPHHOPPER_API_KEY = 'afa8f81e-bb1b-4d1e-aec9-c6bd1664d322';
const PUBLIC_TRANSPORT_API_KEY = '630688984d38409689932a37a8641bb9';
const DEFAULT_CENTER = [53.3498, -6.2603];

// Marker Icons Configuration
const createMarkerIcon = (iconUrl, iconSize = [25, 41], anchorOffset = [12, 41]) => new L.Icon({
  iconUrl,
  iconSize,
  iconAnchor: anchorOffset,
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const MARKERS = {
  red: createMarkerIcon("red-marker.svg"),
  green: createMarkerIcon("destination.svg"),
  toll: createMarkerIcon("toll-marker.svg"),
  user: createMarkerIcon("user-marker.svg", [30, 30], [15, 30]),
  stop: createMarkerIcon("bus_stop.svg", [30, 30], [15, 30])
};

const ROUTE_COLORS = ["blue", "purple", "orange"];
const TRANSPORT_OPTIONS = [
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "foot", label: "Walking" },
  { value: "bus", label: "Public Transport" },
];

const GraphHopperMap = () => {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [times, setTimes] = useState([]);
  const [distances, setDistances] = useState([]);
  const [transportMode, setTransportMode] = useState("car");
  const [userLocation, setUserLocation] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [pathDescriptions, setPathDescriptions] = useState([]);

  // Fetch user's location on component mount
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          } else {
            reject(new Error("Geolocation not supported"));
          }
        });

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
      } catch (error) {
        console.error("Location error:", error);
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
          console.error("IP location fetch error:", ipError);
        }
      }
    };

    fetchUserLocation();
  }, []);

  // Fetch public transport routes
  const fetchPublicTransportRoutes = async (startLoc, endLoc) => {
    const apiUrl = 'https://api-lts.transportforireland.ie/lts/lts/v1/public/planJourney';
    const currentDate = new Date().toISOString();

    const requestBody = {
      type: "LEAVE_AFTER",
      modes: ["BUS", "RAIL"],
      date: currentDate,
      time: currentDate,
      clientTimeZoneOffsetInMs: 0,
      routeType: "FASTEST",
      includeIntermediateStops: true,
      origin: {
        coordinate: {
          latitude: startLoc.coordinates[0],
          longitude: startLoc.coordinates[1]
        },
        id: startLoc.id,
        name: startLoc.name,
        type: startLoc.type
      },
      destination: {
        name: endLoc.name,
        id: endLoc.id,
        coordinate: {
          latitude: endLoc.coordinates[0],
          longitude: endLoc.coordinates[1]
        },
        type: endLoc.type
      }
    };

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': PUBLIC_TRANSPORT_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching public transport routes:', error);
      throw error;
    }
  };

  // Process public transport journey details
  const processPublicTransportJourney = (journeys) => {
    const stops = [];
    const routes = [];
    const descriptions = [];
    const legDurations = [];

    journeys.slice(0, 2).forEach((journey) => {
      let description = '';
      const journeyStops = [];
      const journeyLegDurations = [];

      journey.legs.forEach((leg, index) => {
        // Duration calculation
        const durationMatch = leg.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(durationMatch?.[1] || 0);
        const minutes = parseInt(durationMatch?.[2] || 0);
        const seconds = parseInt(durationMatch?.[3] || 0);
        const totalMinutes = (hours * 60 + minutes + seconds / 60).toFixed(1);

        // Stop processing
        const processStop = (stopData, type) => ({
          position: [stopData.coordinate.latitude, stopData.coordinate.longitude],
          name: stopData.name || `${type} Point ${index + 1}`,
          time: stopData[type === 'origin' ? 'departureRealTime' : 'arrivalRealTime'] || stopData[type],
          serviceNumber: leg.serviceNumber || "N/A",
          mode: leg.mode
        });

        // Add origin, intermediate, and destination stops
        journeyStops.push(processStop(leg.origin, 'origin'));
        
        if (leg.intermediateStops) {
          leg.intermediateStops.forEach(stop => 
            journeyStops.push({
              position: [stop.coordinate.latitude, stop.coordinate.longitude],
              name: stop.name || "Intermediate Stop",
              time: stop.arrivalRealTime || stop.arrival,
              serviceNumber: leg.serviceNumber || "N/A",
              mode: leg.mode
            })
          );
        }

        journeyStops.push(processStop(leg.destination, 'destination'));

        // Build route description
        const legDescription = {
          'TRAM': `Tram ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'BUS': `Bus ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'WALK': `Walk: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'RAIL': `Train ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`
        };

        description += legDescription[leg.mode] || `${leg.mode}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`;
        journeyLegDurations.push(totalMinutes);
      });

      // Collect processed data
      stops.push(...journeyStops);
      routes.push({
        coordinates: journeyStops.map(stop => stop.position),
        mode: journey.modes[0] || 'BUS',
        serviceNumber: journey.legs.find(l => l.mode === 'BUS')?.serviceNumber || "N/A"
      });
      descriptions.push(description);
      legDurations.push(journeyLegDurations);
    });

    return { stops, routes, descriptions, legDurations };
  };

  // Fetch routes for different transport modes
  const fetchRoutes = async (mode) => {
    if (!startLocation || !endLocation) {
      alert("Please select both start and destination locations.");
      return;
    }

    try {
      if (mode === 'bus') {
        const response = await fetchPublicTransportRoutes(startLocation, endLocation);
        
        if (!response[0]?.legs?.length) {
          alert("No public transport routes found.");
          setPathDescriptions(["No routes available"]);
          return;
        }

        const { stops, routes, descriptions, legDurations } = processPublicTransportJourney(response);
        
        setBusStops(stops);
        setRoutes(routes);
        setTimes(legDurations);
        setPathDescriptions(descriptions);
      } else {
        // GraphHopper API for other transport modes
        const url = `https://graphhopper.com/api/1/route?point=${startLocation.coordinates[0]},${startLocation.coordinates[1]}&point=${endLocation.coordinates[0]},${endLocation.coordinates[1]}&profile=${mode}&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${GRAPHHOPPER_API_KEY}`;

        const response = await axios.get(url);

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

          setRoutes(allRoutes);
          setDistances(allDistances);
          setTimes(allTimes);
          setBusStops([]);
          setPathDescriptions([]);
        } else {
          alert("No routes found.");
          setPathDescriptions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      alert(`Error fetching ${mode} routes. Please try again.`);
      setPathDescriptions(["Error fetching routes"]);
    }
  };

  return (
    <div>
      <Select
        options={TRANSPORT_OPTIONS}
        defaultValue={TRANSPORT_OPTIONS[0]}
        onChange={(selected) => {
          setTransportMode(selected.value);
          // Reset states
          [setBusStops, setRoutes, setPathDescriptions, setTimes, setDistances].forEach(fn => fn([]));
        }}
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

      {/* Route information display */}
      {transportMode === 'bus' 
        ? pathDescriptions.map((description, index) => (
            <p key={index}>
              <span style={{ color: ROUTE_COLORS[index % ROUTE_COLORS.length], fontWeight: "bold" }}>
                🚌 {description}
              </span>
            </p>
          ))
        : routes.length > 0 && (
            routes.map((_, index) => (
              <p key={index}>
                <span style={{ color: ROUTE_COLORS[index % ROUTE_COLORS.length], fontWeight: "bold" }}>
                  {index === 0 ? "✅ Optimized Route" : `🔄 Alternative Route ${index}`}
                </span>
                <>: 📏 <strong>{distances[index]} km</strong> | ⏳ <strong>{times[index]} min</strong></>
              </p>
            ))
          )}

      <MapContainer
        center={startLocation?.coordinates || userLocation || DEFAULT_CENTER}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Start and end markers */}
        {startLocation?.coordinates && (
          <Marker position={startLocation.coordinates} icon={MARKERS.red}>
            <Popup>
              <strong>Start:</strong> {startLocation.name || 'Starting Point'}
            </Popup>
          </Marker>
        )}
        {endLocation?.coordinates && (
          <Marker position={endLocation.coordinates} icon={MARKERS.green}>
            <Popup>
              <strong>Destination:</strong> {endLocation.name || 'Destination Point'}
            </Popup>
          </Marker>
        )}

        {/* Bus stops markers */}
        {transportMode === 'bus' && busStops.map((stop, index) => (
          <Marker
            key={`bus-stop-${index}`}
            position={stop.position}
            icon={stop.mode === 'BUS' ? MARKERS.stop :
              (index === 0 ? MARKERS.red : (index === busStops.length - 1 ? MARKERS.green : MARKERS.stop))}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <strong>{stop.name}</strong><br />
                {stop.serviceNumber && stop.serviceNumber !== "N/A" && (
                  <><strong>Bus:</strong> {stop.serviceNumber}<br /></>
                )}
                {stop.mode === 'WALK' && <><strong>Mode:</strong> Walking segment<br /></>}
                {stop.time && (
                  <><strong>Time:</strong> {new Date(stop.time).toLocaleTimeString()}</>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route polylines */}
        {transportMode === 'bus' ? (
          routes.map((route, index) => (
            <Polyline
              key={`route-${index}`}
              positions={route.coordinates}
              color={ROUTE_COLORS[index % ROUTE_COLORS.length]}
              weight={4}
              dashArray={route.mode === 'WALK' ? "10, 10" : null}
              opacity={0.8}
            >
              <Popup>
                {route.mode === 'WALK' ? 'Walking segment' : `Bus route: ${route.serviceNumber}`}
              </Popup>
            </Polyline>
          ))
        ) : (
          routes.map((route, index) => (
            <Polyline
              key={index}
              positions={route}
              color={ROUTE_COLORS[index % ROUTE_COLORS.length]}
            />
          ))
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={MARKERS.user}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* Toll markers for car mode */}
        {transportMode === 'car' && tollData.map((toll, index) => (
          <Marker
            key={`toll-${index}`}
            position={[toll.Latitude, toll.Longitude]}
            icon={MARKERS.toll}
          >
            <Popup>
              <strong>{toll["Toll Name"]}</strong><br />
              Cost: €{toll["Toll Price"]}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default GraphHopperMap;