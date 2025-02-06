const city="Dublin";
const url=`https://api.waqi.info/feed/${city}/?token=554caaa45869a6f123fb8fa1e0dd48a854f0889a`;

const fetchAQICity=async()=>{
    try {
      const response=await fetch(url);
      if(!response.ok){
        throw new Error(`Failed to fetch AQI data of ${city}`);
      }
      const aqiData=await response.json();
      console.log("API Response:",aqiData);

      const aqi=aqiData.data.aqi;
      console.log(`AQI of ${city} is:`,aqi);
      

    } catch (error) {
        console.log("Error fetching AQI:",error);
      ;
    }
  }

const fetchCityInfo=async()=>{
  try {
    
  } catch (error) {
    
  }
}

  fetchAQICity();