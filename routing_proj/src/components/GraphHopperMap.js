import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import LocationSearch from "./LocationSearch";
import Select from "react-select";
import tollData from "./tollData.json";
import { GRAPHHOPPER_API_KEY, PUBLIC_TRANSPORT_API_KEY } from '../config';


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
  { value: "BUS", label: "Public Transport" },
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

  // Function to fetch location details from coordinates
  const fetchLocationDetails = async (latitude, longitude) => {
    try {
      const apiUrl = 'https://api-lts.transportforireland.ie/lts/lts/v1/public/reverseLocationLookup';
      
      const requestBody = {
        "coord": {
          "longitude": longitude,
          "latitude": latitude,
          "pixel": [
            170.55027141873433,
            440.6569131791863
          ]
        },
        "type": [
          "AIR_PORT",
          "BUS_STOP",
          "COACH_STOP",
          "FERRY_PORT",
          "TRAIN_STATION",
          "TRAM_STOP",
          "TRAM_STOP_AREA",
          "UNDERGROUND_STOP",
          "ADDRESS",
          "COORDINATE",
          "LOCALITY",
          "POINT_OF_INTEREST",
          "STREET"
        ],
        "language": "en"
      };

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': PUBLIC_TRANSPORT_API_KEY
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching location details:', error);
      return null;
    }
  };

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
        
        // Fetch location details from the API
        const locationDetails = await fetchLocationDetails(userCoords[0], userCoords[1]);
        
        if (locationDetails && locationDetails.status.success) {
          setStartLocation({
            coordinates: userCoords,
            label: locationDetails.name,
            name: locationDetails.name,
            type: locationDetails.type,
            id: locationDetails.id || `coord:${userCoords[0]},${userCoords[1]}`, // Use coordinates as ID if not provided
            eastingnorthing: locationDetails.eastingnorthing || ""
          });
        } else {
          // Fallback if API doesn't return proper data
          setStartLocation({
            coordinates: userCoords,
            label: `Location at ${userCoords[0].toFixed(5)}, ${userCoords[1].toFixed(5)}`,
            name: `Location at ${userCoords[0].toFixed(5)}, ${userCoords[1].toFixed(5)}`,
            type: "COORDINATE",
            id: `coord:${userCoords[0]},${userCoords[1]}`,
            eastingnorthing: ""
          });
        }
      } catch (error) {
        console.error("Location error:", error);
        try {
          // Fallback to IP-based location
          const response = await axios.get("https://ipapi.co/json/");
          const userCoords = [response.data.latitude, response.data.longitude];
          setUserLocation(userCoords);
          
          // Fetch location details from the API for IP-based location
          const locationDetails = await fetchLocationDetails(userCoords[0], userCoords[1]);
          
          if (locationDetails && locationDetails.status.success) {
            setStartLocation({
              coordinates: userCoords,
              label: locationDetails.name,
              name: locationDetails.name,
              type: locationDetails.type,
              id: locationDetails.id || `coord:${userCoords[0]},${userCoords[1]}`,
              eastingnorthing: locationDetails.eastingnorthing || ""
            });
          } else {
            // Fallback if API doesn't return proper data
            setStartLocation({
              coordinates: userCoords,
              label: `Location at ${userCoords[0].toFixed(5)}, ${userCoords[1].toFixed(5)}`,
              name: `Location at ${userCoords[0].toFixed(5)}, ${userCoords[1].toFixed(5)}`,
              type: "COORDINATE",
              id: `coord:${userCoords[0]},${userCoords[1]}`,
              eastingnorthing: ""
            });
          }
        } catch (ipError) {
          console.error("IP location fetch error:", ipError);
          // Use default coordinates if all else fails
          setStartLocation({
            coordinates: DEFAULT_CENTER,
            label: "Dublin City Center",
            name: "Dublin City Center",
            type: "LOCALITY",
            id: `coord:${DEFAULT_CENTER[0]},${DEFAULT_CENTER[1]}`,
            eastingnorthing: ""
          });
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
        "type": "LEAVE_AFTER",
        "modes": ["BUS","TRAM","RAIL"],
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
          "status": { "success": true },
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
  
    journeys.slice(0, 3).forEach((journey) => {
      const journeyStops = [];
      const journeyLegDurations = [];
      let description = '';
      console.log(journey);
      journey.legs.forEach((leg, index) => {
        // Duration calculation 
        console.log(leg);
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
  
        // Build leg description
        const legDescription = {
          'TRAM': `Tram ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'BUS': `Bus ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'WALK': `Walk: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`,
          'RAIL': `Train ${leg.serviceNumber || ''}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`
        };
  
        // Append leg description with a space if not the first leg
        const legDesc = legDescription[leg.mode] || `${leg.mode}: ${leg.origin.name} → ${leg.destination.name} (${totalMinutes} mins)`;
        description += (index > 0 ? ' ' : '') + legDesc;
        journeyLegDurations.push(totalMinutes);
      });
    
      console.log("Start At",journey.legs[0].origin.departure);
      // Get departure time from first leg's origin
      
    
      const departureTime = journey.legs[0].origin.departure
  ? new Date(journey.legs[0].origin.departure).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Dublin'
    })
  : 'N/A';
        console.log("Departure Time",departureTime);
      // Calculate total time for this journey
      const totalTime = journeyLegDurations.reduce((acc, time) => acc + parseFloat(time), 0).toFixed(1);
      // Create description with departure time
      const journeyDescription = `Leave at: ${departureTime} | ${description} | (Total journey time: ${totalTime} mins)`;
      descriptions.push(journeyDescription);
  
      // Collect processed data
      stops.push(...journeyStops);
      routes.push({
        coordinates: journeyStops.reduce((acc, stop) => {
          // Fixed line with proper parenthesis
          if (stop.position && Array.isArray(stop.position)) {
            acc.push([stop.position[0], stop.position[1]]);
          }
          return acc;
        }, []),
        mode: journey.modes[0] || 'BUS',
        serviceNumber: journey.legs.find(l => l.mode === 'BUS')?.serviceNumber || "N/A"
      });
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
      if (mode === 'BUS') {
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
          // After setting routes in fetchRoutes
            console.log('Processed routes:', routes);
            console.log('Route coordinates sample:', routes[0]?.coordinates);
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

  // Custom function for LocationSearch to use Transport for Ireland API when needed
  const handleLocationSelect = async (location, isStartLocation) => {
    // If the location already has all required fields, use it directly
    if (location && location.coordinates) {
      // Check if we need to fetch additional data from reverseLocationLookup API
      if (!location.type || !location.eastingnorthing) {
        try {
          const locationDetails = await fetchLocationDetails(location.coordinates[0], location.coordinates[1]);
          
          if (locationDetails && locationDetails.status.success) {
            const enhancedLocation = {
              ...location,
              name: locationDetails.name || location.name || location.label,
              type: locationDetails.type,
              id: locationDetails.id || `coord:${location.coordinates[0]},${location.coordinates[1]}`,
              eastingnorthing: locationDetails.eastingnorthing || ""
            };
            
            if (isStartLocation) {
              setStartLocation(enhancedLocation);
            } else {
              setEndLocation(enhancedLocation);
            }
          } else {
            // Use the original location if API fails
            if (isStartLocation) {
              setStartLocation(location);
            } else {
              setEndLocation(location);
            }
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          // Use the original location if API fails
          if (isStartLocation) {
            setStartLocation(location);
          } else {
            setEndLocation(location);
          }
        }
      } else {
        // Location already has all needed fields
        if (isStartLocation) {
          setStartLocation(location);
        } else {
          setEndLocation(location);
        }
      }
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
        onSelect={(location) => handleLocationSelect(location, true)}
        label="Starting Location"
        defaultLocation={userLocation}
      />
      <LocationSearch
        onSelect={(location) => handleLocationSelect(location, false)}
        label="Destination Location"
      />
      <button
        onClick={() => fetchRoutes(transportMode)}
        disabled={!startLocation || !endLocation}
      >
        Get Routes
      </button>

      {/* Route information display */}
      {transportMode === 'BUS' 
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
        {transportMode === 'BUS' && busStops.map((stop, index) => (
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
        {transportMode === 'BUS' ? (
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