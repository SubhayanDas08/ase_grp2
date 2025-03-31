import { useState, useEffect } from 'react';
import { HiOutlineLightningBolt } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Waste() {
    const [routes, setRoutes] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState(false); // State to track edit mode
    const [isAddingWidget, setIsAddingWidget] = useState(false); // State to track if adding widgets
    const [showAddWidget, setShowAddWidget] = useState(false); // State to manage widget container visibility
    const [selectedDay, setSelectedDay] = useState<string>("Monday");

    
    const AddWidgetContainer = () => {
        return (
          <div className="add-widget-container p-4 bg-white shadow-lg rounded-lg absolute top-20 right-10 z-10">
            <h2 className="text-lg font-semibold mb-4 text-white">Add Widgets</h2>
            <div className="widget-options flex flex-wrap">
              <button className="widget-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
              <button className="widget-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
              <button className="widget-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
              <button className="widget-option bg-gray-200 p-2 rounded-lg m-2 textDark"></button>
            </div>
          </div>
        );
      };

 {/*     useEffect(() => {
        // Use relative path for CSV in public folder or a backend API endpoint
        fetch(data)
            .then(response => response.text())
            .then(csvText => {
                const rows = csvText.split("\n").slice(1); // Remove headers
                const parsedData = rows.map(row => {
                    const [route_name, county, pickup_day, pickup_duration_min, num_stops, place_pickup_times] = row.split(",");
                    return { route_name, county, pickup_day, pickup_duration_min, num_stops, place_pickup_times };
                });
                setRoutes(parsedData);
            })
            .catch(error => console.error("Error fetching CSV:", error));
    }, []); */}

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
        console.log("Setting routes data", mockData);
        // Instead of fetching, we use the mock data for now
        setRoutes(mockData);
    }, []);

    const filteredRoutes = routes.filter(route => route.pickup_day === selectedDay);

    const handleAddButtonClick = () => {
    if (isAddingWidget) {
        // Save changes (e.g., add selected widgets)
        console.log("Changes saved");
    }
    setIsAddingWidget(!isAddingWidget); // Toggle adding state
    setShowAddWidget(!showAddWidget); // Toggle widget container visibility
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
                    <Link key={index} to="/wasteroutes" className="route_waste_container flex flex-row">
                        <div className="routes_waste_logo mt-6">
                            <HiOutlineLightningBolt className="text-white text-2xl" />
                        </div>
                        <div className="cloud_secondcolumn ml-10 mt-3 h-5">
                            <div className="text-lg font-bold text-white">{route.route_name}</div>
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
                    </Link>
                ))}
            </div>

            <div className='flex w-full grow justify-end items-end'> 
                <button
                    onClick={handleAddButtonClick}
                    className={`px-6 py-2 h-12 rounded-full font-semibold transition-all duration-300 ease-in-out
                        ${isAddingWidget ? "bg-gray-300 primaryColor2" : "primaryColor2BG text-white"}`}
                >
                    {isAddingWidget ? "Done" : "Add"}
                </button>
                {showAddWidget && <AddWidgetContainer />}
            </div>
        </div>
    )
}