import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// Fix marker icon issue in Leaflet with React
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
});

const MapComponent = () => {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default to London

  return (
    <div className="h-full w-full">
      <MapContainer center={position} zoom={13} className="h-[500px] w-full">
        {/* Base Map Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Marker at the center */}
        <Marker position={position} icon={customIcon}>
          <Popup>
            This is the default location. You can customize it!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;