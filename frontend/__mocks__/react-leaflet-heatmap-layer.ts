import React from "react";

export default function MockHeatmapLayer({ points }: { points: { lat: number; lng: number }[] }) {
  return React.createElement("div", { 
    "data-testid": "heatmap-layer", 
    "data-points": JSON.stringify(points) 
  });
}