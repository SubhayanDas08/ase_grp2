import { useState, useEffect } from "react";
import { warn, debug, trace, info, error } from '@tauri-apps/plugin-log';
import dotenv from 'dotenv';

import MapVisual from "../components/mapVisual";

dotenv.config();
const waqiApiToken = process.env.VITE_WAQI_API_TOKEN;

const city="Dublin";

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

  const [waqiData, setWaqiData] = useState({});

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

  useEffect(()=>{
    const [aqi, setAqi] = useState(null);
    const fetchAQICity=async()=>{
      try {
        const response=await fetch(`https://api.waqi.info/feed/${city}/?token=554caaa45869a6f123fb8fa1e0dd48a854f0889a`);
        if(!response.ok){
          throw new Error(`Failed to fetch AQI data of ${city}`);
        }
        const aqiData=await response.json();

        if(aqiData.status==="ok"){
          setAqi(aqiData.data.aqi);
        }
        else{
          throw new Error("Bad response from AQI API");
        }
      } catch (error) {
        return error;
      }
    }
    fetchAQICity();
  },[]);

  
  return (
    <div className="h-full relative shadow-xl">
      <MapVisual defaultLocation={location} setLocation={setLocation} />
    </div>
  );
}
