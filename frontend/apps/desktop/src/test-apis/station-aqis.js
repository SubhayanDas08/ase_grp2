import dotenv from 'dotenv';
dotenv.config();

const access_token = process.env.WAQI_ACCESS_TOKEN;

export const getStationAqi=async(stationId)=>{
    console.log(`https://api.waqi.info/feed/@${stationId}/?token=${access_token}`);
    
    try {
        const url=`https://api.waqi.info/feed/@${stationId}/?token=${access_token}`;
        const response=await fetch(url);
        const stationsData=await response.json();
        console.log(stationsData);
        
        // return stationUids;
        
    } catch (error) {
        throw new Error("Error in fetching station AQI");
    }
}

getStationAqi("14649");