import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import 'leaflet/dist/leaflet.css';

const SearchFunctionality = ({ provider }: any) => {
    // Create the search control using the provider
    const searchControl = GeoSearchControl({
        provider,
    });

    // Leaflet map instance
    const map = useMap();

    useEffect(() => {
        map.addControl(searchControl);

        // Remove the control when the component is unmounted
        return () => {
            map.removeControl(searchControl);
        };
    }, [map, searchControl]);

    return null;
};

export default function MapVisual() {
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
            <SearchFunctionality provider={new OpenStreetMapProvider()} />
        </MapContainer>
    );
}
