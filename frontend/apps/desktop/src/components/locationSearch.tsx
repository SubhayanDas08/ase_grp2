import { useState } from "react";
import axios from "axios";

interface LocationSearchProps {
    label: string;
    onSelect: (value: [number, number]) => void;
    setLocationData: (data: {
        id: string;
        name: string;
        type: string;
        lat: number;
        lon: number;
    }) => void;
}

interface Suggestion {
    label: string;
    value: [number, number];
    id: string;
    type: string;
}

export default function LocationSearch ({ label, onSelect, setLocationData }: LocationSearchProps) {
    const [query, setQuery] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const fetchLocationFormSuggestions = async (input: string) => {
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
                location.coordinate.longitude &&
                location.id &&
                location.type
            );

            const mappedSuggestions: Suggestion[] = validLocations.map((place: any) => ({
                label: place.name,
                value: [place.coordinate.latitude, place.coordinate.longitude],
                id: place.id,
                type: place.type
            }));
            setSuggestions(mappedSuggestions);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleSelect = (location: Suggestion) => {
        setLocationData({
            id: location.id,
            name: location.label,
            type: location.type,
            lat: location.value[0],
            lon: location.value[1]
        });
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
                placeholder={label.startsWith("Start") ? "Current location" : "Search location..."}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    fetchLocationFormSuggestions(e.target.value);
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