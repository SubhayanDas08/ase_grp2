import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import Sidebar from "./Sidebar";
import RouteOptions from "./RouteOptions";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";

const redMarker = new L.Icon({ iconUrl: "red-marker.svg", iconSize: [25, 41], iconAnchor: [12, 41] });
const greenMarker = new L.Icon({ iconUrl: "destination.svg", iconSize: [25, 41], iconAnchor: [12, 41] });

const GraphHopperMap: React.FC = () => {
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
  // const [routes, setRoutes] = useState<{ distance: string; time: string; type: string; color: string }[]>([]);
  const [routes, setRoutes] = useState<{ 
    distance: string; 
    time: string; 
    type: string; 
    color: string; 
    coordinates: [number, number][]; 
  }[]>([]);

  // const fetchRoutes = async () => {
  //   if (!startLocation || !endLocation) {
  //     alert("⚠️ Please select both start and destination locations.");
  //     return;
  //   }
  
  //   console.log("🚀 Fetching multiple best routes from GraphHopper API...");
  
  //   const apiKey = "afa8f81e-bb1b-4d1e-aec9-c6bd1664d322"; // Replace with actual API key
  //   const url = `https://graphhopper.com/api/1/route?point=${startLocation[0]},${startLocation[1]}&point=${endLocation[0]},${endLocation[1]}&profile=car&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${apiKey}`;
  
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  
  //     if (!data.paths || data.paths.length === 0) {
  //       alert("⚠️ No routes found.");
  //       return;
  //     }
  
  //     // Convert API response into UI format
  //     const updatedRoutes = data.paths.map((path: any, index: number) => ({
  //       distance: (path.distance / 1000).toFixed(2), // Convert meters to km
  //       time: (path.time / 60000).toFixed(2), // Convert ms to minutes
  //       type: index === 0 ? "🚗 Best Route" : `Alternative Route ${index}`,
  //       color: ["red", "blue", "black"][index % 3], // Assign different colors
  //       coordinates: path.points.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]), // Extract coordinates
  //     }));
  
  //     console.log("✅ Multiple Routes received:", updatedRoutes);
  //     setRoutes(updatedRoutes);
  //   } catch (error) {
  //     console.error("❌ Error fetching routes:", error);
  //     alert("❌ Failed to fetch routes. Check your API key.");
  //   }
  // };

const [transportMode, setTransportMode] = useState("car"); // Default: Car

const fetchRoutes = async () => {
  if (!startLocation || !endLocation) {
    alert("⚠️ Please select both start and destination locations.");
    return;
  }

  console.log(`🚀 Fetching routes for: ${transportMode}`);

  const apiKey = "afa8f81e-bb1b-4d1e-aec9-c6bd1664d322"; // Replace with actual API key
  const url = `https://graphhopper.com/api/1/route?point=${startLocation[0]},${startLocation[1]}&point=${endLocation[0]},${endLocation[1]}&profile=${transportMode}&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.paths || data.paths.length === 0) {
      alert("⚠️ No routes found.");
      return;
    }

    // Convert API response into UI format
    const updatedRoutes = data.paths.map((path: any, index: number) => ({
      distance: (path.distance / 1000).toFixed(2), // Convert meters to km
      time: (path.time / 60000).toFixed(2), // Convert ms to minutes
      type: `${transportMode.toUpperCase()} Route ${index + 1}`, // Indicate transport mode
      color: ["red", "blue", "black"][index % 3], // Assign different colors
      coordinates: path.points.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]), // Extract coordinates
    }));

    console.log(`✅ ${transportMode} Routes received:`, updatedRoutes);
    setRoutes(updatedRoutes);
  } catch (error) {
    console.error(`❌ Error fetching ${transportMode} routes:`, error);
    alert(`❌ Failed to fetch ${transportMode} routes. Check your API key.`);
  }
};

  return (
    <div className="container">
      <Sidebar setStartLocation={setStartLocation} setEndLocation={setEndLocation} setTransportMode={() => {}} fetchRoutes={fetchRoutes} />
      <RouteOptions routes={routes} />
      <MapContainer center={[53.3498, -6.2603]} zoom={12} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {startLocation && <Marker position={startLocation} icon={redMarker} />}
        {endLocation && <Marker position={endLocation} icon={greenMarker} />}
        {routes.map((route, index) => (
  route.coordinates && route.coordinates.length > 0 ? (
    <Polyline key={index} positions={route.coordinates} color={route.color} weight={4} />
  ) : null
))}
      </MapContainer>
    </div>
  );
};

export default GraphHopperMap;