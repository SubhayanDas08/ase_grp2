import React from "react";
import "../styles/RouteOptions.css";

type Route = {
  distance: string;
  time: string;
  type: string;
  color: string;
};

const RouteOptions: React.FC<{ routes: Route[] }> = ({ routes }) => {
  return (
    <div className="route-options">
      {routes.map((route, index) => (
        <div key={index} className="route-card" style={{ borderLeft: `5px solid ${route.color}` }}>
          <h3>{route.type}</h3>
          <p>🕒 {route.time} min | 📏 {route.distance} km</p>
          <button className="route-select-btn">Select</button>
        </div>
      ))}
    </div>
  );
};

export default RouteOptions;