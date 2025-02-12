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
    // { value: "car_delivery", label: "Delivery Car" },
    // { value: "car_avoid_toll", label: "Car avoiding toll" },
    // { value: "truck", label: "Cargo Truck" },
    // { value: "small_truck", label: "Small Truck" },
  ];

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoords = [position.coords.latitude, position.coords.longitude];
              setUserLocation(userCoords);
              setStartLocation(userCoords); 
            },
            async (error) => {
              console.error("Geolocation error:", error);
              try {
                const response = await axios.get("https://ipapi.co/json/");
                const userCoords = [response.data.latitude, response.data.longitude];
                setUserLocation(userCoords);
                setStartLocation(userCoords); 
              } catch (ipError) {
                console.error("Error fetching location from IP API:", ipError);
              }
            }
          );
        } else {
          const response = await axios.get("https://ipapi.co/json/");
          const userCoords = [response.data.latitude, response.data.longitude];
          setUserLocation(userCoords);
          setStartLocation(userCoords); 
        }
      } catch (err) {
        console.error("Unexpected error fetching location:", err);
      }
    };
  
    fetchUserLocation();
  }, []);
  

  const fetchRoutes = async () => {
    if (!startLocation || !endLocation) {
      alert("Please select both start and destination locations.");
      return;
    }
    const apiKey = 'afa8f81e-bb1b-4d1e-aec9-c6bd1664d322';
    const url = `https://graphhopper.com/api/1/route?point=${startLocation[0]},${startLocation[1]}&point=${endLocation[0]},${endLocation[1]}&profile=${transportMode}&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.paths.length > 0) {
        const allRoutes = response.data.paths.map((path) =>
          path.points.coordinates.map(([lng, lat]) => [lat, lng])
        );

        const allDistances = response.data.paths.map((path) => (path.distance / 1000).toFixed(2));
        const allTimes = response.data.paths.map((path) => (path.time / 60000).toFixed(2));

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
          return { cost: tollCost.toFixed(2), tolls: Array.from(tollsPassed.values()).map(t => t["Toll Name"]) };
        });

        setRoutes(allRoutes);
        setDistances(allDistances);
        setTimes(allTimes);
        setTollCosts(calculatedTollCosts);
      } else {
        alert("No routes found.");
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const isSameLocation = (loc1, loc2) => {
    return loc1 && loc2 && loc1[0] === loc2[0] && loc1[1] === loc2[1];
  };

  return (
    <div>
      <Select options={transportOptions} defaultValue={transportOptions[0]} onChange={(selected) => setTransportMode(selected.value)} />
      <LocationSearch onSelect={setStartLocation} label="Starting Location" defaultLocation={userLocation} />
      <LocationSearch onSelect={setEndLocation} label="Destination Location" />
      <button onClick={fetchRoutes} disabled={!startLocation || !endLocation}>Get Routes</button>
      {routes.length > 0 && routes.map((_, index) => (
        <p key={index}>
          <span style={{ color: routeColors[index % routeColors.length], fontWeight: "bold" }}>
            {index === 0 ? "✅ Optimized Route" : `🔄 Alternative Route ${index}`}
          </span>: 📏 <strong>{distances[index]} km</strong> | ⏳ <strong>{times[index]} min</strong>{transportMode === "car" && <> | 💰 Toll: <strong>€{tollCosts[index].cost}</strong></>}

        </p>
      ))}
      <MapContainer center={startLocation || userLocation || [53.3498, -6.2603]} zoom={12} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {!isSameLocation(startLocation, userLocation) && startLocation && <Marker position={startLocation} icon={redMarker} />}
        {endLocation && <Marker position={endLocation} icon={greenMarker} />}
        {tollData.map((toll, index) => (
          <Marker key={index} position={[toll.Latitude, toll.Longitude]} icon={tollMarker}>
            <Popup>{toll["Toll Name"]} - €{toll["Toll Price"]}</Popup>
          </Marker>
        ))}
         {/* {busStopsData.map((stop, index) => (
          <Marker key={index} position={[stop.stop_lat, stop.stop_lon]} icon={stopMarker}>
            <Popup>{stop.stop_name}</Popup>
          </Marker>
        ))} */}
        {routes.map((route, index) => <Polyline key={index} positions={route} color={routeColors[index % routeColors.length]} />)}
        {userLocation && <Marker position={userLocation} icon={userMarker}><Popup>Your Location</Popup></Marker>}
      
      </MapContainer>
    </div>
  );
};

export default GraphHopperMap;
