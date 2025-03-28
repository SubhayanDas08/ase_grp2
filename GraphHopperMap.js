import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import LocationSearch from "./LocationSearch";
import Select from "react-select";
import tollData from "./tollData.json";
import busStopsData from "./bus_stops.json";

// Custom Markers (unchanged)
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
  const [busStops, setBusStops] = useState([]);
  const [pathDescriptions, setPathDescriptions] = useState([]);

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
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

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
    const apiUrl = 'https://api-lts.transportforireland.ie/lts/lts/v1/public/planJourney';
    const currentDate = new Date().toISOString();

    const requestBody = {
      "type": "LEAVE_AFTER",
      "modes": ["BUS", "RAIL", "TRAM"],
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
    if (!startLocation || !endLocation) {
      alert("Please select both start and destination locations.");
      return;
    }

    try {
      if (mode === 'bus') {
        const response = await fetchPublicTransportRoutes(startLocation, endLocation);
        console.log("Public transport response:", response);

        if (response && response.journeys && response.journeys.length > 0) {
          const journey = response.journeys[0];
          console.log("Journey legs:", journey.legs);

          const stops = [];
          const routeCoordinates = [];
          const descriptions = [];
          const legTimes = [];

          // Process legs in their natural order (remove sorting)
          const legsToProcess = journey.legs.slice(0, 3);

          legsToProcess.forEach((leg, index) => {
            console.log(`Processing leg ${index}:`, leg);

            if (['TRAM', 'BUS', 'WALK', 'RAIL'].includes(leg.mode)) {
              let durationInMinutes = 0;
              if (leg.duration) {
                const durationMatch = leg.duration.match(/PT(\d+)M/);
                if (durationMatch) {
                  durationInMinutes = parseInt(durationMatch[1]);
                }
              }

              // Origin
              stops.push({
                position: [leg.origin.coordinate.latitude, leg.origin.coordinate.longitude],
                name: leg.origin.name || "Start",
                time: leg.origin.departure,
                serviceNumber: leg.serviceNumber || "N/A",
                mode: leg.mode
              });

              // Route segment
              let segmentCoords = [[leg.origin.coordinate.latitude, leg.origin.coordinate.longitude]];

              // Intermediate stops
              if (leg.intermediateStops) {
                leg.intermediateStops.forEach(stop => {
                  stops.push({
                    position: [stop.coordinate.latitude, stop.coordinate.longitude],
                    name: stop.name || "Intermediate",
                    time: stop.arrival,
                    serviceNumber: leg.serviceNumber || "N/A",
                    mode: leg.mode
                  });
                  segmentCoords.push([stop.coordinate.latitude, stop.coordinate.longitude]);
                });
              }

              // Destination
              stops.push({
                position: [leg.destination.coordinate.latitude, leg.destination.coordinate.longitude],
                name: leg.destination.name || "End",
                time: leg.destination.arrival,
                serviceNumber: leg.serviceNumber || "N/A",
                mode: leg.mode
              });
              segmentCoords.push([leg.destination.coordinate.latitude, leg.destination.coordinate.longitude]);

              routeCoordinates.push({
                coordinates: segmentCoords,
                mode: leg.mode,
                serviceNumber: leg.serviceNumber || "N/A"
              });

              legTimes.push(durationInMinutes.toString());

              // Create path description for this leg
              let description = '';
              if (leg.mode === 'WALK') {
                description = `Walk ${durationInMinutes} mins from ${leg.origin.name || "Start"} to ${leg.destination.name || "End"}`;
              } else {
                description = `Take ${leg.mode} ${leg.serviceNumber || ''} from ${leg.origin.name || "Start"} to ${leg.destination.name || "End"} (${durationInMinutes} mins)`;
              }
              descriptions.push(description);
            }
          });

          console.log("Processed stops:", stops);
          console.log("Processed route coordinates:", routeCoordinates);
          console.log("Path descriptions:", descriptions);
          console.log("Leg times:", legTimes);

          setBusStops(stops);
          setRoutes(routeCoordinates);
          setDistances(["N/A"]);
          setTimes(legTimes);
          setTollCosts([]);
          setPathDescriptions(descriptions);
        } else {
          alert("No public transport routes found.");
          setPathDescriptions(["No routes available"]);
        }
      } else {
        // GraphHopper logic (unchanged)
        const apiKey = 'afa8f81e-bb1b-4d1e-aec9-c6bd1664d322';
        const url = `https://graphhopper.com/api/1/route?point=${startLocation.coordinates[0]},${startLocation.coordinates[1]}&point=${endLocation.coordinates[0]},${endLocation.coordinates[1]}&profile=${mode}&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${apiKey}`;
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

//   return (
//     <div>
//       <Select
//         options={transportOptions}
//         defaultValue={transportOptions[0]}
//         onChange={(selected) => {
//           setTransportMode(selected.value);
//           setBusStops([]);
//           setRoutes([]);
//           setPathDescriptions([]);
//           setTimes([]);
//         }}
//       />
//       <LocationSearch
//         onSelect={setStartLocation}
//         label="Starting Location"
//         defaultLocation={userLocation}
//       />
//       <LocationSearch
//         onSelect={setEndLocation}
//         label="Destination Location"
//       />
//       <button
//         onClick={() => fetchRoutes(transportMode)}
//         disabled={!startLocation || !endLocation}
//       >
//         Get Routes
//       </button>

//       {/* Route information display */}
//       {routes.length > 0 && pathDescriptions.length > 0 ? (
//         <div>
//           {transportMode === 'bus' ? (
//             pathDescriptions.map((description, index) => (
//               <p key={index}>
//                 <span style={{ color: routeColors[index % routeColors.length], fontWeight: "bold" }}>
//                   🚌 {description}
//                 </span>
//               </p>
//             ))
//           ) : (
//             routes.map((_, index) => (
//               <p key={index}>
//                 <span style={{ color: routeColors[index % routeColors.length], fontWeight: "bold" }}>
//                   {index === 0 ? "✅ Optimized Route" : `🔄 Alternative Route ${index}`}
//                 </span>
//                 <>: 📏 <strong>{distances[index]} km</strong> | ⏳ <strong>{times[index]} min</strong></>
//                 {transportMode === "car" && tollCosts[index] && 
//                   <> | 💰 Toll: <strong>€{tollCosts[index].cost}</strong></>
//                 }
//               </p>
//             ))
//           )}
//         </div>
//       ) : (
//         pathDescriptions.length > 0 && (
//           <p style={{ color: "red" }}>{pathDescriptions[0]}</p>
//         )
//       )}

//       <MapContainer
//         center={(startLocation?.coordinates && startLocation.coordinates) || userLocation || [53.3498, -6.2603]}
//         zoom={12}
//         style={{ height: "500px", width: "100%" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* Start and end markers */}
//         {startLocation?.coordinates && (
//           <Marker position={startLocation.coordinates} icon={redMarker}>
//             <Popup>
//               <strong>Start:</strong> {startLocation.name || 'Starting Point'}
//             </Popup>
//           </Marker>
//         )}
//         {endLocation?.coordinates && (
//           <Marker position={endLocation.coordinates} icon={greenMarker}>
//             <Popup>
//               <strong>Destination:</strong> {endLocation.name || 'Destination Point'}
//             </Popup>
//           </Marker>
//         )}

//         {/* Bus stops markers */}
//         {transportMode === 'bus' && busStops.map((stop, index) => (
//           <Marker
//             key={`bus-stop-${index}`}
//             position={stop.position}
//             icon={index === 0 ? redMarker : (index === busStops.length - 1 ? greenMarker : stopMarker)}
//           >
//             <Popup>
//               <div style={{ minWidth: "200px" }}>
//                 <strong>{stop.name}</strong><br />
//                 <strong>Mode:</strong> {stop.mode}<br />
//                 {stop.serviceNumber !== "N/A" && (
//                   <>
//                     <strong>Service:</strong> {stop.serviceNumber}<br />
//                   </>
//                 )}
//                 {stop.time && (
//                   <>
//                     <strong>Time:</strong> {new Date(stop.time).toLocaleTimeString()}
//                   </>
//                 )}
//               </div>
//             </Popup>
//           </Marker>
//         ))}

//         {/* Route polylines */}
//         {transportMode === 'bus' && routes.map((route, index) => (
//           <Polyline
//             key={`route-${index}`}
//             positions={route.coordinates}
//             color={routeColors[index % routeColors.length]}
//             weight={4}
//             dashArray={route.mode === 'WALK' ? "10, 10" : null}
//             opacity={0.8}
//           >
//             <Popup>
//               {route.mode === 'WALK' ? 'Walking segment' : `Bus route: ${route.serviceNumber}`}
//             </Popup>
//           </Polyline>
//         ))}

//         {/* Non-bus routes */}
//         {transportMode !== 'bus' && routes.map((route, index) => (
//           <Polyline
//             key={index}
//             positions={route}
//             color={routeColors[index % routeColors.length]}
//           />
//         ))}

//         {/* User location marker */}
//         {userLocation && (
//           <Marker position={userLocation} icon={userMarker}>
//             <Popup>
//               <strong>Your Location</strong>
//             </Popup>
//           </Marker>
//         )}

//         {/* Toll markers for car mode */}
//         {transportMode === 'car' && tollData.map((toll, index) => (
//           <Marker
//             key={`toll-${index}`}
//             position={[toll.Latitude, toll.Longitude]}
//             icon={tollMarker}
//           >
//             <Popup>
//               <strong>{toll["Toll Name"]}</strong><br />
//               Cost: €{toll["Toll Price"]}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

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
      {pathDescriptions.length > 0 ? (
        <div>
          {transportMode === 'bus' ? (
            pathDescriptions.map((description, index) => (
              <p key={index}>
                <span style={{ color: routeColors[index % routeColors.length], fontWeight: "bold" }}>
                  🚌 {description}
                </span>
              </p>
            ))
          ) : (
            routes.map((_, index) => (
              <p key={index}>
                <span style={{ color: routeColors[index % routeColors.length], fontWeight: "bold" }}>
                  {index === 0 ? "✅ Optimized Route" : `🔄 Alternative Route ${index}`}
                </span>
                <>: 📏 <strong>{distances[index]} km</strong> | ⏳ <strong>{times[index]} min</strong></>
                {transportMode === "car" && tollCosts[index] && 
                  <> | 💰 Toll: <strong>€{tollCosts[index].cost}</strong></>
                }
              </p>
            ))
          )}
        </div>
      ) : (
        routes.length > 0 && (
          <p style={{ color: "red" }}>No path descriptions available</p>
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
            icon={index === 0 ? redMarker : (index === busStops.length - 1 ? greenMarker : stopMarker)}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <strong>{stop.name}</strong><br />
                <strong>Mode:</strong> {stop.mode}<br />
                {stop.serviceNumber !== "N/A" && (
                  <>
                    <strong>Service:</strong> {stop.serviceNumber}<br />
                  </>
                )}
                {stop.time && (
                  <>
                    <strong>Time:</strong> {new Date(stop.time).toLocaleTimeString()}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route polylines */}
        {transportMode === 'bus' && routes.map((route, index) => (
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
        ))}

        {/* Non-bus routes */}
        {transportMode !== 'bus' && routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route}
            color={routeColors[index % routeColors.length]}
          />
        ))}

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