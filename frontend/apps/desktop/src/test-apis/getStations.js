const latitude=1;
const longitude=1;

const url="https://api.waqi.info/map/bounds?token=554caaa45869a6f123fb8fa1e0dd48a854f0889a&latlng=52.2000,-6.4000,53.4100,-6.0500"

const fetchStationData=async()=>{
    try {
        console.log(url);
        const response=await fetch(url);
        const stationData=await response.json();

        const stationUids=stationData.data.map(station => station.uid);
        console.log(stationUids);
                
    } catch (error) {
        throw new Error("Error !!!")
    }
}

fetchStationData();