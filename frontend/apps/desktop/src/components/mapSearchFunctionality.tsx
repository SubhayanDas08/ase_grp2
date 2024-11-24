import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { GeoSearchControl } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

// Type for the props of MapSearchFunctionality
interface MapSearchFunctionalityProps {
    provider: any;
    searchLabel: string;
    setLocation: (location: any) => void;
}

export default function MapSearchFunctionality({ provider, searchLabel, setLocation }: MapSearchFunctionalityProps) {
    const map = useMap();

    useEffect(() => {
        // Initialize a new GeoSearchControl
        const searchControl = GeoSearchControl({
            provider,
            style: "bar",
            notFoundMessage: "Sorry, that address could not be found.",
            searchLabel: searchLabel,
        });

        map.addControl(searchControl);

        map.on('geosearch/showlocation', (event: any) => {
            // Find out how to set it to one location only (maybe make it an object instead of separate states (location1 and location2))
            console.log("Location: ", event.location);
        });

        // Cleanup: Remove control on unmount
        return () => {
            map.removeControl(searchControl);
        };
    }, [map, provider, searchLabel]);

    return null;
}
