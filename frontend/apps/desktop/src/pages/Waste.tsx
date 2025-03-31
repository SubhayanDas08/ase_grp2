import { useState, useEffect } from 'react';
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FiCloudLightning } from "react-icons/fi";
import { Link } from "react-router-dom";


export default function Waste() {
    const [recommendations, setRecommendations] = useState(false); // State to track edit mode
    const [isAddingWidget, setIsAddingWidget] = useState(false); // State to track if adding widgets
    const [showAddWidget, setShowAddWidget] = useState(false); // State to manage widget container visibility

    
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

    const handleAddButtonClick = () => {
    if (isAddingWidget) {
        // Save changes (e.g., add selected widgets)
        console.log("Changes saved!");
    }
    setIsAddingWidget(!isAddingWidget); // Toggle adding state
    setShowAddWidget(!showAddWidget); // Toggle widget container visibility
    };

    return (
        <div className='flex flex-col h-full w-full'>
            {/* Header Section */}
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

            <div className="routes_waste flex flex-col justify-between">
            {["Route 1", "Route 2"].map((route, index) => (
                <Link key={index} to="/wasteroutes" className="route_waste_container flex flex-row">
                    <div className="routes_waste_logo mt-6">
                        <HiOutlineLightningBolt className="text-white text-2xl" />
                    </div>
                    <div className="cloud_secondcolumn ml-10 mt-3 h-5">
                        <div className="text-lg font-bold text-white">{route}</div>
                        <div className="cloud_info_firstrow mb-2">
                            <span id="road_list_waste">Ballsbridge, Dublin - Pembroke Road, Anglesea Road, Lansdowne Road, Herbert Park Road, Ailesbury Road, Mespil Road ...</span>
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