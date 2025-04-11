import { HiOutlineLightningBolt } from "react-icons/hi";
import { FiCloudLightning } from "react-icons/fi";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authenticatedPost } from "../utils/auth";

export default function Waste_routes() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state.data as {data?: any};
    
    // State to control button visibility and recommendations box
    const [showRecommendationsBox, setShowRecommendationsBox] = useState(false);
    const [aqiData, setAqiData] = useState<any[]>([]);
    const [recommendation, setRecommendation] = useState("");
    
    // Calculated estimated time per stop
    const estimatedTimePerStop = Math.round(state.data.pickup_duration_min / state.data.place_pickup_times.length);
    useEffect(() => {
        const fetchAQIData = async () => {
            try {
            const response = await authenticatedPost<any[]>(
                "/predict/AQI_TC",
                { route_id: state.data.route_id }
            );
            console.log("AQI data: ", response);
            setAqiData(response);
            } catch (error) {
            console.error("Failed to fetch AQI data", error);
            }
        };
        
        fetchAQIData();
    }, [state.data.route_id]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
              const response = await authenticatedPost<{ recommendations: string }>(
                "/recommend/trashpickup",
                { route_id: state.data.route_id }
              );
              console.log("Recommendation: ", response);
              setRecommendation(response.recommendations);
            } catch (err) {
              console.error("Failed to fetch recommendation", err);
              setRecommendation("Unable to fetch recommendation");
            }
        }; 
       
        fetchRecommendations();
    }, [state.data.route_id]);

    return (
        <div className="overflow-y-auto">
            <div className='w-full flex flex-row'>
                <div>
                    <div className="w-full flex">
                        <div className="mainHeaderHeight w-full flex items-center justify-between">
                            <div className="titleText primaryColor1 flex">
                                <div className="underline cursor-pointer mr-2" onClick={()=>navigate("/waste/")}>Waste</div>
                                <div className="mr-2">{">"}</div>
                                <div>Waste Route</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div>
                            <div id="routes_waste_logo2">
                                <FiCloudLightning />
                            </div>
                            <div className='mt-5 text-xl font-semibold'>
                                {state.data.route_name}
                            </div>
                            <div style={{ color: "var(--secondaryColor)" }}>
                                {state.data.county}
                            </div>
                        </div>
                        <div className="relative mt-20 ml-50">
                            <button 
                                className="primaryColor2BG text-white font-bold py-2 px-4 rounded"
                                onClick={() => setShowRecommendationsBox(!showRecommendationsBox)}
                            >
                                View Recommendations
                            </button>
                            
                            {/* Recommendations Box */}
                            {showRecommendationsBox && (
                                <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800"> Recommendations</h3>
                                        <p className="text-sm text-gray-600 mt-2">{recommendation || "Loading..."}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {state.data.place_pickup_times.map((stop: any, index: any) => (
                <div key={index} className="routes_waste flex flex-col justify-between mt-3 w-full max-w-5xl min-w-[500px] mx-auto">
                    <div className="relative route_waste_container flex flex-row w-full justify-between items-center">
                        <div className="flex flex-row items-center">
                            <div className="">
                                <div id="routes_waste_logo">
                                    <HiOutlineLightningBolt />
                                </div>
                            </div>
                            <div className="ml-8 mt-0.5">
                                <span id="road_list_waste">{stop.place}</span>
                                <div className="text-xs opacity-75 text-gray-800">Pickup time: {stop.pickup_time}</div>
                            </div>
                        </div>
                        <div className="index_waste text-white">
                            <div className="ml-6 mt-2 text-xs">
                                AQI
                            </div>
                            <div className="ml-7.5 font-bold text-lg">
                                {aqiData.find((a) => a.place === stop.place)?.aqi || "-"}
                            </div>
                        </div>
                        <div className="index_waste text-white">
                            <div className="mt-2 text-xs text-center">
                                Traffic Index
                            </div>
                            <div className="ml-7.5 font-bold text-lg">
                                {aqiData.find((a) => a.place === stop.place)?.tc || "-"}
                            </div>
                        </div>
                        <div className="text-right mr-5 text-white opacity-75 text-xs">
                            est. time: ~{estimatedTimePerStop} mins
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}