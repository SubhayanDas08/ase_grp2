import { useState, useEffect } from 'react';
import { HiOutlineLightningBolt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";

export default function Waste() {
    const [routes, setRoutes] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState(false);
    const [isAddingWidget, setIsAddingWidget] = useState(false);
    const [showAddWidget, setShowAddWidget] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string>("Monday");

    const AddWidgetContainer = () => {
        return (
          <div className="fixed inset-0 flex justify-center items-center z-50 overflow-y">
            <div className="absolute inset-0 blur-background" onClick={() => setShowAddWidget(false)}></div>
            <div className="relative p-4 primaryColor2BG shadow-lg rounded-3xl z-10 w-96 max-h-[50vh] overflow-y-auto">
              <button 
                className="absolute top-2 right-2 text-black hover:text-gray-500" 
                onClick={() => setShowAddWidget(false)}
              >
                <IoClose size={24} />
              </button>
              <h2 className="text-lg font-semibold mb-4 text-white">Add Route</h2>
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
            num_stops: 20,
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
        setRoutes(mockData);
    }, []);

    const filteredRoutes = routes.filter(route => route.pickup_day === selectedDay);

    const handleAddButtonClick = () => {
        setIsAddingWidget(!isAddingWidget);
        setShowAddWidget(!showAddWidget);
    };

    return (
        <div className='flex flex-col h-full w-full'>
            {/* Header Section */}
            <div>
                <div className="mainHeaderHeight header w-full flex items-center justify-between">
                    <div className="home_title titleText">Waste</div>
                    <div>
                    <button
                        className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out 
                        ${recommendations ? "bg-gray-300 primaryColor2 w-[200px]" 
                                    : "primaryColor2BG text-white w-[200px]"}`}
                        onClick={() => setRecommendations(!recommendations)}
                    >
                        {recommendations ? "Done" : "Recommendations"}
                    </button>
                    </div>
                </div>
                {/* Day Selector */}
                <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-black"
                >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>
            </div>

            <div className="routes_waste flex flex-col justify-between">
                {filteredRoutes.map((route, index) => (
                    <Link key={index} to={`/wasteroutes/${route.route_name}`} className="route_waste_container flex flex-row justify-between items-center">
                        <div className="flex flex-row">
                            <div className="routes_waste_logo mt-0.5">
                                <HiOutlineLightningBolt className="text-white text-2xl" />
                            </div>
                            <div className="cloud_secondcolumn ml-10 h-5">
                                <div className="text-lg font-bold text-white -mt-3">{route.route_name}</div>
                                <div className="cloud_info_firstrow mb-2 text-gray-300">
                                    {route.county} -{" "}
                                    {route.place_pickup_times.map((item:any, idx:any) => (
                                        <span key={idx}>
                                            {item.place} at {item.pickup_time}
                                            {idx < route.place_pickup_times.length - 1 && ", "}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mr-5 text-white opacity-75 text-sm">
                            {route.num_stops} stops
                        </div>
                    </Link>
                ))}
            </div>

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
    )
}