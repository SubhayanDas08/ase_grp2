import { useState, useEffect } from "react";

import MapVisual from "../components/mapVisual";

export default function Map() {
    const [location1, setLocation1] = useState<any>(null);
    const [location2, setLocation2] = useState<any>(null);

    useEffect(() => {
        console.log("Location 1: ", location1);
    }, [location1]);

    useEffect(() => {
        console.log("Location 2: ", location2);
    }, [location2]);

    return (
        <div className="h-full relative shadow-xl">
            <MapVisual setLocation1={setLocation1} setLocation2={setLocation2}/>
        </div>
    );
}
