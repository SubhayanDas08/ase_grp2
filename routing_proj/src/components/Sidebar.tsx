import React from "react";
import Select from "react-select";
import LocationSearch from "./LocationSearch";
import "../styles/Sidebar.css";

interface SidebarProps {
  setStartLocation: (location: [number, number]) => void;
  setEndLocation: (location: [number, number]) => void;
  setTransportMode: (mode: string) => void;
  fetchRoutes: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setStartLocation, setEndLocation, setTransportMode, fetchRoutes }) => {
  const transportOptions = [
    { value: "car", label: "🚗 Car" },
    { value: "bike", label: "🚴 Bike" },
    { value: "foot", label: "🚶 Walking" },
    { value: "bus", label: "🚌 Bus" }
  ];

  return (
    <div className="sidebar">
      <h2>🚀 Routes</h2>

      <div className="input-container">
        <LocationSearch onSelect={setStartLocation} label="Starting Location" />
      </div>

      <div className="input-container">
        <LocationSearch onSelect={setEndLocation} label="Destination Location" />
      </div>

      {/* 🚀 Transport Mode Selection */}
      <div className="transport-selection">
        <label>Transport Mode</label>
        <Select 
          options={transportOptions} 
          defaultValue={transportOptions[0]} 
          onChange={(selected) => setTransportMode(selected?.value || "car")} 
        />
      </div>

      {/* 🔍 Get Routes Button */}
      <button className="search-btn" onClick={fetchRoutes}>🔍 Get Routes</button>
    </div>
  );
};

export default Sidebar;