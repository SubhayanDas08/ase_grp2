import { useState, useEffect } from "react";

import MapVisual from "../components/mapVisual";

interface Location {
    latitude: number;
    longitude: number;
    label: string;
}

export default function Routing() {
    const [location, setLocation] = useState<Location>({
        latitude: 53.3498,
        longitude: -6.2603,
        label: "Dublin, Ireland",
    });

    useEffect(() => {
        console.log(location);
    }, [location]);

    return (
        <div className="h-full w-full flex flex-col">
            <div className="mainHeaderHeight w-full flex items-center justify-between">
                <div className="titleText primaryColor1">Routes</div>
            </div>
            <div className="h-full w-full">
                <MapVisual defaultLocation={location} setLocation={setLocation} />
            </div>
        </div>
    );
}
