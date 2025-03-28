import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import LocationSearch from "./LocationSearch";
import Select from "react-select";
import tollData from "./tollData.json";

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
  const [times, setTimes] = useState([]);
  const [distances, setDistances] = useState([]); // For non-bus modes
  const [transportMode, setTransportMode] = useState("car");
  const [userLocation, setUserLocation] = useState(null);
  const [busStops, setBusStops] = useState([]);
  const [pathDescriptions, setPathDescriptions] = useState([]);

  const transportOptions = [
    { value: "car", label: "Car" },
    { value: "bike", label: "Bike" },
    { value: "foot", label: "Walking" },
    { value: "bus", label: "Public Transport" },
  ];

  // Fetch user's location
   // Fetch user's location (unchanged)
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
    console.log("Fetching public transport routes...");

    const apiUrl = 'https://api-lts.transportforireland.ie/lts/lts/v1/public/planJourney';
    const currentDate = new Date().toISOString();

    const requestBody = {
      "type": "LEAVE_AFTER",
      "modes": ["BUS", "RAIL"],
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
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '630688984d38409689932a37a8641bb9'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching public transport routes:', error);
      throw error;
    }
  };

  const fetchRoutes = async (mode) => {
    console.log("Fetching routes for mode:", mode);

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

        response.slice(0, 3).forEach((journey, journeyIndex) => {
          console.log("API Response:", journey);

        
          // Process first journey
          const processedRoutes = [];
          const stops = [];
          const descriptions = [];
          const legDurations = [];

          journey.legs.forEach((leg, index) => {
            // Parse duration
            const durationMatch = leg.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            const hours = parseInt(durationMatch?.[1] || 0);
            const minutes = parseInt(durationMatch?.[2] || 0);
            const seconds = parseInt(durationMatch?.[3] || 0);
            const totalMinutes = (hours * 60 + minutes + seconds / 60).toFixed(1);

            // Add origin stop
            stops.push({
              position: [leg.origin.coordinate.latitude, leg.origin.coordinate.longitude],
              name: leg.origin.name || `Start Point ${index + 1}`,
              time: leg.origin.departure,
              serviceNumber: leg.serviceNumber || "N/A",
              mode: leg.mode
            });

          // Add intermediate stops
          if (leg.intermediateStops) {
            leg.intermediateStops.forEach(stop => {
              stops.push({
                position: [stop.coordinate.latitude, stop.coordinate.longitude],
                name: stop.name || "Intermediate Stop",
                time: stop.arrival,
                serviceNumber: leg.serviceNumber || "N/A",
                mode: leg.mode
              });
            });
          }

          // Add destination stop
          stops.push({
            position: [leg.destination.coordinate.latitude, leg.destination.coordinate.longitude],
            name: leg.destination.name || `End Point ${index + 1}`,
            time: leg.destination.arrivalRealTime || leg.destination.arrival,
            serviceNumber: leg.serviceNumber || "N/A",
            mode: leg.mode
          });
          console.log("Stops:", stops);
          // Build description
          let description = '';
          switch (leg.mode) {
            case 'TRAM':
              description = `Tram ${leg.serviceNumber || ''}: ${leg.origin.name || `Start Point ${index + 1}`} → ${leg.destination.name || `End Point ${index + 1}`} (${totalMinutes} mins)`;
              break;
            case 'BUS':
              description = `Bus ${leg.serviceNumber || ''}: ${leg.origin.name || `Start Point ${index + 1}`} → ${leg.destination.name || `End Point ${index + 1}`} (${totalMinutes} mins)`;
              break;
            case 'WALK':
              description = `Walk: ${leg.origin.name || `Start Point ${index + 1}`} → ${leg.destination.name || `End Point ${index + 1}`} (${totalMinutes} mins)`;
              break;
            case 'RAIL':
              description = `Train ${leg.serviceNumber || ''}: ${leg.origin.name || `Start Point ${index + 1}`} → ${leg.destination.name || `End Point ${index + 1}`} (${totalMinutes} mins)`;
              break;
            default:
              description = `${leg.mode}: ${leg.origin.name || `Start Point ${index + 1}`} → ${leg.destination.name || `End Point ${index + 1}`} (${totalMinutes} mins)`;
          }

          descriptions.push(description);
          legDurations.push(totalMinutes);
        });

        // Parse KML coordinates for route drawing
        if (journey.kml) {
          const parser = new DOMParser();
          const kmlDoc = parser.parseFromString(journey.kml, "text/xml");
          const coordinates = [];

          kmlDoc.querySelectorAll('coordinates').forEach(coordNode => {
            const coordsText = coordNode.textContent.trim();
            if (coordsText) {
              coordsText.split(/\s+/).forEach(pair => {
                const [lng, lat] = pair.split(',').map(Number);
                if (!isNaN(lat) && !isNaN(lng)) {
                  coordinates.push([lat, lng]);
                }
              });
            }
          });
          console.log('hi')
          processedRoutes.push({
            coordinates,
            mode: journey.modes[0] || 'BUS',
            serviceNumber: journey.legs.find(l => l.mode === 'BUS')?.serviceNumber || "N/A"
          });
        } else {
          // Fallback: Use stop coordinates if KML is not available
          const coordinates = stops.map(stop => stop.position);
          processedRoutes.push({
            coordinates,
            mode: journey.modes[0] || 'BUS',
            serviceNumber: journey.legs.find(l => l.mode === 'BUS')?.serviceNumber || "N/A"
          });
        }

        // Update state
        setBusStops(stops);
        setRoutes(processedRoutes);
        setTimes(legDurations);
        setPathDescriptions(descriptions);
        console.log("Processed data:", { stops, routes: processedRoutes, descriptions });
      });
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
            (path.distance / 1000).toFixed(2) // Distance in kilometers
          );

          const allTimes = response.data.paths.map((path) =>
            (path.time / 60000).toFixed(2) // Time in minutes
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
        options={transportOptions}
        defaultValue={transportOptions[0]}
        onChange={(selected) => {
          setTransportMode(selected.value);
          setBusStops([]);
          setRoutes([]);
          setPathDescriptions([]);
          setTimes([]);
          setDistances([]);
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
      {transportMode === 'bus' && pathDescriptions.length > 0 ? (
        pathDescriptions.map((description, index) => (
          <p key={index}>
            <span style={{ color: routeColors[index % routeColors.length], fontWeight: "bold" }}>
              🚌 {description}
            </span>
          </p>
        ))
      ) : (
        routes.length > 0 && (
          routes.map((_, index) => (
            <p key={index}>
              <span style={{ color: routeColors[index % routeColors.length], fontWeight: "bold" }}>
                {index === 0 ? "✅ Optimized Route" : `🔄 Alternative Route ${index}`}
              </span>
              <>: 📏 <strong>{distances[index]} km</strong> | ⏳ <strong>{times[index]} min</strong></>
            </p>
          ))
        )
      )}

      <MapContainer
        center={(startLocation?.coordinates && startLocation.coordinates) || userLocation || [53.3498, -6.2603]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Start and end markers */}
        {startLocation?.coordinates && (
          <Marker position={startLocation.coordinates} icon={redMarker}>
            <Popup>
              <strong>Start:</strong> {startLocation.name || 'Starting Point'}
            </Popup>
          </Marker>
        )}
        {endLocation?.coordinates && (
          <Marker position={endLocation.coordinates} icon={greenMarker}>
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
            icon={stop.mode === 'BUS' ? stopMarker :
              (index === 0 ? redMarker : (index === busStops.length - 1 ? greenMarker : stopMarker))}
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
              color={routeColors[index % routeColors.length]}
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
              color={routeColors[index % routeColors.length]}
            />
          ))
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userMarker}>
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
            icon={tollMarker}
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