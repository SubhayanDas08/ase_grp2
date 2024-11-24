import { MapContainer, TileLayer } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

import MapSearchFunctionality from "./mapSearchFunctionality";

interface MapVisualProps {
    setLocation1: (location: any) => void;
    setLocation2: (location: any) => void;
}


export default function MapVisual({ setLocation1, setLocation2 }: MapVisualProps) {
    const position: [number, number] = [53.3498, -6.2603];

    return (
        <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapSearchFunctionality
                provider={new OpenStreetMapProvider()}
                searchLabel="Orginal location"
                setLocation={setLocation1}
            />

            <MapSearchFunctionality
                provider={new OpenStreetMapProvider()}
                searchLabel="Destination location"
                setLocation={setLocation2}
            />
        </MapContainer>
    );
}
