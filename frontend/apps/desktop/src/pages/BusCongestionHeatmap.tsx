import { MapContainer, TileLayer } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer";
import { useEffect, useState } from "react";
import { authenticatedGet } from "../utils/auth";

export default function HeatmapPage() {
  const [busPositions, setBusPositions] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const data = await authenticatedGet<any>("/heatmap");
        const buses = data?.buses?.Vehicles || [];

        const coords = buses.map((bus: any) => [
          bus.latitude,
          bus.longitude,
        ]);

        setBusPositions(coords);
      } catch (error) {
        console.error("Failed to load heatmap data", error);
      }
    };

    fetchBusData();
  }, []);

  return (
    <MapContainer center={[53.3498, -6.2603]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatmapLayer
        points={busPositions.map(([lat, lng]) => ({ lat, lng }))}
        longitudeExtractor={(p) => p.lng}
        latitudeExtractor={(p) => p.lat}
        intensityExtractor={() => 1}
      />
    </MapContainer>
  );
}