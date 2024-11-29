import { useState, useEffect } from "react";

import MapVisual from "../components/mapVisual";

interface Location {
    latitude: number;
    longitude: number;
    label: string;
}

export default function Map() {
    const [location, setLocation] = useState<Location>({
        latitude: 53.3498,
        longitude: -6.2603,
        label: "Dublin, Ireland",
    });

    useEffect(() => {
        console.log(location);
    }, [location]);

    return (
        <div className="h-full relative shadow-xl">
            <MapVisual defaultLocation={location} setLocation={setLocation} />
        </div>
    );
}
