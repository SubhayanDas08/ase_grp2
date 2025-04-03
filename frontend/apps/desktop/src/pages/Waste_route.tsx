import { HiOutlineLightningBolt } from "react-icons/hi";
import { FiCloudLightning } from "react-icons/fi";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Waste_routes() {
    const navigate=useNavigate();
    const location = useLocation();
    const state = location.state.data as {data?:any}
    
    // Calculated estimated time per stop (total duration divided by number of stops)
    const estimatedTimePerStop = Math.round(state.data.pickup_duration_min / state.data.place_pickup_times.length);

    return (
        <div className="overflow-y-auto">
            <div className='w-full ml-10 flex flex-row'>
                <div>
                    <div className="w-full flex mt-2">
                        <div className="titleText primaryColor1 flex">
                            <div className="underline cursor-pointer mr-2" onClick={()=>navigate("/waste/")}>Waste</div>
                            <div className="mr-2">{">"}</div>
                            <div>Waste </div>
                            <div className='text-white'> .</div>
                            <div>Route</div>
                        </div>
                    </div>
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
            </div>

            {state.data.place_pickup_times.map((stop:any, index:any) => (
               (
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
                                    1
                                </div>
                            </div>
                            <div className="index_waste text-white">
                            <div className="mt-2 text-xs text-center">
                                    Traffic Index
                                </div>
                                <div className="ml-7.5 font-bold text-lg">
                                    1
                                </div>
                            </div>
                            <div className="text-right mr-5 text-white opacity-75 text-xs">
                                est. time: ~{estimatedTimePerStop} mins
                            </div>
                        </div>
                    </div>
                )
            ))}
        </div>
    );

}