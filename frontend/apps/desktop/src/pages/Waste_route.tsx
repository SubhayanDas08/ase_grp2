import { useState, useEffect } from 'react';
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FiCloudLightning, FiMinus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function Waste_routes() {
    const { routeName } = useParams(); // Get the routeName from the URL params
    const [routeDetails, setRouteDetails] = useState<{
        route_name: string;
        county: string;
        pickup_day: string;
        pickup_duration_min: number;
        num_stops: number;
        place_pickup_times: { place: string; pickup_time: string }[];
      } | null>(null);
      
    const [visibleContainers, setVisibleContainers] = useState<boolean[]>([]);
    const [isAddingWidget, setIsAddingWidget] = useState(false);
    const [showAddWidget, setShowAddWidget] = useState(false);
    const [recommendations, setRecommendations] = useState(false);

    const handleMinusButtonClick = (index: number) => {
        setVisibleContainers(prev => {
            const newVisibility = [...prev];
            newVisibility[index] = !newVisibility[index];
            return newVisibility;
        });
    };

    const mockData = [
        {
            route_name: "Route B",
            county: "Mayo",
            pickup_day: "Saturday",
            pickup_duration_min: 93,
            num_stops: 19,
            place_pickup_times: [
                { place: "Ballintubber", pickup_time: "13:30" },
                { place: "Lecanvey", pickup_time: "13:45" },
                { place: "Belderrig", pickup_time: "13:58" },
                { place: "Claremorris", pickup_time: "14:10" },
                { place: "Westport", pickup_time: "14:21" },
            ]
        },
        {
            route_name: "Route C",
            county: "Kerry",
            pickup_day: "Monday",
            pickup_duration_min: 64,
            num_stops: 19,
            place_pickup_times: [
                { place: "Annascaul", pickup_time: "11:00" },
                { place: "Tarbert", pickup_time: "11:08" },
                { place: "Lixnaw", pickup_time: "11:17" },
                { place: "Waterville", pickup_time: "11:25" },
                { place: "Blennerville", pickup_time: "11:33" },
            ]
        },
        {
            route_name: "Route D",
            county: "Kerry",
            pickup_day: "Monday",
            pickup_duration_min: 64,
            num_stops: 19,
            place_pickup_times: [
                { place: "Annascaul", pickup_time: "11:00" },
                { place: "Tarbert", pickup_time: "11:08" },
                { place: "Lixnaw", pickup_time: "11:17" },
                { place: "Waterville", pickup_time: "11:25" },
                { place: "Blennerville", pickup_time: "11:33" },
            ]
        },
        {
            route_name: "Route C",
            county: "Kerry",
            pickup_day: "Tuesday",
            pickup_duration_min: 89,
            num_stops: 19,
            place_pickup_times: [
                { place: "Annascaul", pickup_time: "11:00" },
                { place: "Tarbert", pickup_time: "11:14" },
                { place: "Lixnaw", pickup_time: "11:22" },
                { place: "Waterville", pickup_time: "11:28" },
                { place: "Blennerville", pickup_time: "11:33" },
            ]
        }
    ];

    useEffect(() => {
        // Find the route details based on routeName
        const selectedRoute = mockData.find(route => route.route_name === routeName);
        if (selectedRoute) {
            setRouteDetails(selectedRoute);
            // Initialize visibility for all stops
            setVisibleContainers(new Array(selectedRoute.place_pickup_times.length).fill(true));
        } else {
            setRouteDetails(null);
        }
    }, [routeName]);

    const AddWidgetContainer = () => {
        return (
          <div className="fixed inset-0 flex justify-center items-center z-50 overflow-y">
            {/* Blurry Background */}
            <div className="absolute inset-0 blur-background" onClick={() => setShowAddWidget(false)}></div>

            {/* Modal Content */}
            <div className="relative p-4 primaryColor2BG shadow-lg rounded-3xl z-10 w-96 max-h-[50vh] overflow-y-auto">
              {/* Close Button */}
              <button 
                className="absolute top-2 right-2 text-black hover:text-gray-500" 
                onClick={() => setShowAddWidget(false)}
              >
                <IoClose size={24} />
              </button>

              <h2 className="text-lg font-semibold mb-4 text-white">Add Street</h2>
              <div className="widget-options flex flex-wrap">
                <button className="widget-street-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
                <button className="widget-street-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
                <button className="widget-street-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
                <button className="widget-street-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
                <button className="widget-street-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
                <button className="widget-street-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
                <button className="widget-street-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
              </div>
            </div>
          </div>
        );
    };

    const handleAddButtonClick = () => {
        setIsAddingWidget(!isAddingWidget);
        setShowAddWidget(!showAddWidget);
    };

    if (!routeDetails) {
        return <div className="w-full mt-10 ml-10">Loading route details...</div>;
    }

    // Calculate estimated time per stop (total duration divided by number of stops)
    const estimatedTimePerStop = Math.round(routeDetails.pickup_duration_min / routeDetails.place_pickup_times.length);

    return (
        <div>
            <div className='w-full mt-10 ml-10 flex flex-row'>
                <div>
                    <div id="routes_waste_logo2">
                        <FiCloudLightning />
                    </div>
                    <div className='mt-5 text-xl font-semibold'>
                        {routeDetails.route_name}
                    </div>
                    <div style={{ color: "var(--secondaryColor)" }}>
                        {routeDetails.county}
                    </div>
                </div>
                <div className ="mr-10 flex w-full justify-end items-start">
                    <button
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out 
                        ${recommendations ? "bg-gray-300 primaryColor2 w-[100px]" 
                                    : "errorBG text-white w-[100px]"}`}
                        onClick={() => setRecommendations(!recommendations)}
                    >
                        {recommendations ? "Done" : "Delete"}
                    </button>
                </div>
            </div>

            {routeDetails.place_pickup_times.map((stop, index) => (
                visibleContainers[index] && (
                    <div key={index} className="routes_waste flex flex-col justify-between mt-3 w-5xl">
                        <div className="relative route_waste_container flex flex-row ml-5 w-full justify-between items-center">
                            <FiMinus 
                                className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000" 
                                onClick={() => handleMinusButtonClick(index)}
                            />
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
                            <div className="text-right mr-5 text-white opacity-75 text-xs">
                                est. time: ~{estimatedTimePerStop} mins
                            </div>
                        </div>
                    </div>
                )
            ))}

            <div className='flex w-full grow justify-end items-end mt-4'> 
                <button
                    onClick={handleAddButtonClick}
                    className={`px-6 py-2 h-12 rounded-full font-semibold transition-all duration-300 ease-in-out
                        ${isAddingWidget ? "primaryColor2BG text-white" : "primaryColor2BG text-white"}`}
                >
                    {isAddingWidget ? "Add" : "Add"}
                </button>
                {showAddWidget && <AddWidgetContainer />}
            </div>
        </div>
    );
}