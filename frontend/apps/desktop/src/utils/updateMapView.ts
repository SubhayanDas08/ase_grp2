import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Helper component to update map view dynamically
export default function UpdateMapView({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position]);
    return null;
};