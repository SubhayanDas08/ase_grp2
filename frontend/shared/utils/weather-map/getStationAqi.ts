const dotenv = require('dotenv');
dotenv.config();
const access_token: string | undefined = process.env.VITE_WAQI_ACCESS_TOKEN;

interface StationData {
    status: string;
    data: {
        aqi:number
    };
}

export const getStationAqi=async(stationId:string): Promise<number>=>{
    if(!access_token)
        throw new Error("Missing access token");

    try {
        const url=`https://api.waqi.info/feed/@${stationId}/?token=${access_token}`;
        const response=await fetch(url);

        if(!response.ok)
            throw new Error(`Failed to fetch aqi of Station ID: ${stationId}: ${response.statusText}`);

        const stationData:StationData=await response.json();

        if (!stationData.data || stationData.data.aqi === undefined) {
            throw new Error(`Invalid response structure for Station ID ${stationId}`);
        }

        return stationData.data.aqi;
        
    } catch (error) {
        throw new Error("Error in fetching AQI of stations");
    }
}