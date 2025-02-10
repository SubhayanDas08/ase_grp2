const latitude="53.353297983914004";
const longitude="-6.264278548826408";
const url=`https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=554caaa45869a6f123fb8fa1e0dd48a854f0889a`;

console.log(url);

const fetchAQICoordinates=async()=>{
    try {
      const response=await fetch(url);
      if(!response.ok){
        throw new Error(`Failed to fetch AQI data of ${latitude}`);
      }
      const aqiData=await response.json();
      console.log("API Response:",aqiData);

      const aqi=aqiData.data.aqi;
      console.log(`AQI of ${latitude} and ${longitude} is:`, aqi);

    } catch (error) {
        console.log("Error fetching AQI:",error);
      ;
    }
  }

  fetchAQICoordinates();