import { useState, useEffect } from 'react';
import { HiOutlineLightningBolt } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Waste() {
    const [routes, setRoutes] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [selectedCounty, setSelectedCounty] = useState<string>("");
    const [searchTriggered, setSearchTriggered] = useState(false);

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

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(e.target.value);
        setSearchTriggered(false);
    };
    
    const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCounty(e.target.value);
        setSearchTriggered(false);
    };

    const filteredRoutes = searchTriggered
    ? routes.filter(route => route.pickup_day === selectedDay && route.county === selectedCounty)
    : [];

    return (
        <div className='flex flex-col h-full w-full overflow-x-auto'>
            {/* Header Section */}
            <div>
                <div className="mainHeaderHeight header w-full flex items-center justify-between">
                    <div className="home_title titleText primaryColor1">Waste</div>
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
                <div className=''>
                    {/* Day Selector */}
                    <select
                        value={selectedDay}
                        onChange={handleDayChange}
                        className="p-2 border border-gray-300 rounded-md text-black"
                    >
                        <option value="" disabled>Select day</option>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>

                    {/* County Selector */}
                    <select
                        value={selectedCounty}
                        onChange={handleCountyChange}
                        className="p-2 border border-gray-300 rounded-md text-black ml-3"
                    >
                        <option value="" disabled>Select county</option>
                        {["Cork", "Donegal", "Dublin", "Galway", "Kerry", "Limerick", "Mayo", "Waterford", "Wexford", "Wicklow"].map(county => (
                            <option key={county} value={county}>{county}</option>
                        ))}
                    </select>
                </div>
                
            </div>

            <div className="routes_waste flex flex-col justify-between">
                {filteredRoutes.map((route, index) => (
                    <Link key={index} to={`/wasteroutes/${route.route_name}`} 
                        className="route_waste_container flex flex-row justify-between items-center 
                                lg:w-full min-w-[300px] overflow-hidden">
                        
                        <div className="flex flex-row overflow-hidden">
                            <div className="routes_waste_logo mt-0.5">
                                <HiOutlineLightningBolt className="text-white text-2xl" />
                            </div>

                            <div className="cloud_secondcolumn ml-4 flex flex-col overflow-hidden">
                                <div className="text-lg font-bold text-white">{route.route_name}</div>

                                {/* Ensure pickup details display fully until overflow naturally hides excess */}
                                <div className="cloud_info_firstrow text-gray-300 flex-1 overflow-hidden whitespace-nowrap">
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

                        {/* Number of stops should remain visible, while overflow hides other text if necessary */}
                        <div className="mr-5 text-white opacity-75 text-sm shrink-0">
                            {route.num_stops} stops
                        </div>
                    </Link>
                ))}
            </div>


            <div className='flex w-full grow justify-end items-end mt-4'> 
                <button
                    onClick={() => setSearchTriggered(true)}
                    className={`px-6 py-2 h-12 rounded-full primaryColor2BG font-semibold text-white transition-all duration-300 ease-in-out`}
                >
                Search
                </button>
                
            </div>

        </div>
    )
}