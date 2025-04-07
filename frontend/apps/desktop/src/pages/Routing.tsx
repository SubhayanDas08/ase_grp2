import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import FetchUserLocation from "../utils/fetchUserLocation.ts";
import UpdateMapView from "../utils/updateMapView.ts";
import Select, { SingleValue } from "react-select";
import axios from "axios";

interface LocationSearchProps {
    label: string;
    onSelect: (value: [number, number]) => void;
}

interface Suggestion {
    label: string;
    value: [number, number];
}

interface TransportOption {
    value: string;
    label: string;
}

interface GraphHopperPath {
    points: {
        coordinates: [number, number][];
    };
    distance: number;
    time: number;
}

const TRANSPORT_OPTIONS: TransportOption[] = [
    { value: "car", label: "Car" },
    { value: "bike", label: "Bike" },
    { value: "foot", label: "Walking" },
];

const LocationSearch = ({ label, onSelect }: LocationSearchProps) => {
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const fetchSuggestions = async (input: string) => {
        if (!input) return;
        try {
            const response = await axios.get(
                `https://api-lts.transportforireland.ie/lts/lts/v1/public/locationLookup?query=${input}&language=en`,
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': import.meta.env.VITE_ROUTES_SEARCH_KEY
                    }
                }
            );

            const validLocations = response.data.filter((location: any) =>
                location.status.success &&
                location.coordinate &&
                location.coordinate.latitude &&
                location.coordinate.longitude
            );

            const mappedSuggestions: Suggestion[] = validLocations.map((place: any) => ({
                label: place.name,
                value: [place.coordinate.latitude, place.coordinate.longitude]
            }));

            setSuggestions(mappedSuggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleSelect = (location: Suggestion) => {
        onSelect(location.value);
        setQuery(location.label);
        setSuggestions([]);
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                placeholder="Search location..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                }}
            />
            {suggestions.length > 0 && (
                <ul className="border mt-1 rounded bg-white max-h-48 overflow-y-auto z-20 relative">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(suggestion)}
                        >
                            {suggestion.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default function Routing() {
    const [position, setPosition] = useState<[number, number] | null>();
    const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
    const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
    const [transportMode, setTransportMode] = useState<string>("car");
    const [routes, setRoutes] = useState<[number, number][][]>([]);
    const [selectedRoute, setSelectedRoute] = useState<[number, number][] | null>(null);
    const [distances, setDistances] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [showRoutePopup, setShowRoutePopup] = useState<boolean>(false);

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

    const fetchRoutes = async () => {
        if (!startLocation || !endLocation) return;

        try {
            const url = `https://graphhopper.com/api/1/route?point=${startLocation[0]},${startLocation[1]}&point=${endLocation[0]},${endLocation[1]}&profile=${transportMode}&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${import.meta.env.VITE_APP_GRAPHHOPPER_API_KEY}`;
            const response = await axios.get(url);
            const paths: GraphHopperPath[] = response.data.paths;

            if (paths.length > 0) {
                const allRoutes = paths.map((path) =>
                    path.points.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])
                );
                const allDistances = paths.map((path) =>
                    (path.distance / 1000).toFixed(2)
                );
                const allTimes = paths.map((path) =>
                    (path.time / 60000).toFixed(2)
                );
                setRoutes(allRoutes);
                setDistances(allDistances);
                setTimes(allTimes);
                setShowRoutePopup(true);
            }
        } catch (error) {
            console.error("Error fetching routes:", error);
        }
    };

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
            <div className="mainHeaderHeight w-full flex items-center justify-between px-4">
                <div className="titleText primaryColor1">Routes</div>
            </div>

            <div className="relative h-full w-full z-0">
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
                    {selectedRoute && (
                        <Polyline positions={selectedRoute} color="blue" />
                    )}
                    {startLocation && (
                        <Marker position={startLocation}>
                            <Popup>Start Location</Popup>
                        </Marker>
                    )}
                    {endLocation && (
                        <Marker position={endLocation}>
                            <Popup>End Location</Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Overlay Inputs inside map */}
                <div className="absolute top-2 left-15 z-10 bg-white p-4 rounded-[var(--cornerRadius)] shadow-md w-[300px] space-y-4">
                    <LocationSearch label="Start Location" onSelect={setStartLocation} />
                    <LocationSearch label="End Location" onSelect={setEndLocation} />
                    <Select<TransportOption>
                        options={TRANSPORT_OPTIONS}
                        defaultValue={TRANSPORT_OPTIONS[0]}
                        onChange={(opt: SingleValue<TransportOption>) => setTransportMode(opt?.value || "car")}
                    />
                    <button
                        className="routeSelectButton"
                        onClick={fetchRoutes}
                    >
                        Get Route
                    </button>
                </div>

                {/* Route Selection Popup */}
                {showRoutePopup && (
                    <div className="absolute bottom-10 left-15 z-10 bg-white p-4 rounded-[var(--cornerRadius)] shadow-md w-[300px] max-h-[300px] overflow-y-auto space-y-3">
                        {routes.map((route, index) => (
                            <div
                                key={index}
                                className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setSelectedRoute(route);
                                    setShowRoutePopup(false);
                                }}
                            >
                                <strong className="underline">Route {index + 1}</strong><br />
                                Distance: {distances[index]} km<br />
                                Duration: {times[index]} min
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}