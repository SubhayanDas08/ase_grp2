import { useState, useEffect } from "react";
import { warn, debug, trace, info, error } from '@tauri-apps/plugin-log';

import MapVisual from "../components/mapVisual";

const waqiApiToken = import.meta.env.VITE_WAQI_API_TOKEN;

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

  const [waqiData, setWaqiData] = useState([]);

  useEffect(() => {
    info('running useEffect' + waqiApiToken);
    let url = `https://api.waqi.info/feed/@13402/?token=` + waqiApiToken;
    // fetch(url)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setWaqiData(data);
    //     // var strData = JSON.stringify(data);
    //     // info(strData);
    //   });
  }, []);
  
  useEffect(() => {
    // stringify waqiData
    var strData = JSON.stringify(waqiData);
    info("waqiData: " + strData)
  }, [waqiData]); 

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <div className="h-full relative shadow-xl">
      <MapVisual defaultLocation={location} setLocation={setLocation} />
    </div>
  );
}
