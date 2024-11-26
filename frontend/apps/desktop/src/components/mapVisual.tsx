import { MapContainer, TileLayer } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

import MapSearchFunctionality from "./mapSearchFunctionality";

interface MapVisualProps {
    defaultLocation: {
        latitude: number;
        longitude: number;
    };
    setLocation: (location: any) => void;
}

export default function MapVisual({ defaultLocation, setLocation }: MapVisualProps) {
    const position: [number, number] = [defaultLocation.latitude, defaultLocation.longitude];

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapSearchFunctionality
                provider={new OpenStreetMapProvider()}
                searchLabel="Search for a location"
                setLocation={setLocation}
            />
        </MapContainer>
    );
}
