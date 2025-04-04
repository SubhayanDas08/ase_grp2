import { useState, useEffect } from "react";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import FetchUserLocation from "../utils/fetchUserLocation.ts";
import UpdateMapView from "../utils/updateMapView.ts";

export default function Routing() {
    const [position, setPosition] = useState<[number, number] | null>();
    
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const userLocationData = await FetchUserLocation();
                if (userLocationData) {
                    const { lat, lon } = userLocationData;
                    const isValidLat = typeof lat === "number" && lat >= -90 && lat <= 90;
                    const isValidLon = typeof lon === "number" && lon >= -180 && lon <= 180;
                    if (isValidLat && isValidLon) {
                        setPosition([lat, lon]);
                    } else {
                        console.warn("Invalid coordinates received:", lat, lon);
                        setPosition(null);
                    }
                } else {
                    setPosition(null);
                }
            } catch (error) {
                console.error("Failed to fetch location:", error);
                setPosition(null);
            }
        };

        fetchLocation();
    }, []);

    if (!position) {
        return (
            <div className="h-full w-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Routes</div>
            </div>
            <div className="h-full w-full justify-center items-center flex titleText primaryColor1">
                Loading map...
            </div>
        </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Routes</div>
            </div>
            <div className="h-full w-full">
                <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "100%", width: "100%", borderRadius: "var(--cornerRadius)", zIndex: 0 }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <UpdateMapView position={position} />
                </MapContainer>
            </div>
        </div>
    );
}
