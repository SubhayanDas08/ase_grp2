import { useState } from 'react';
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FiCloudLightning, FiMinus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Waste_routes() {
    const [visibleContainers, setVisibleContainers] = useState([true, true]);
    const [isAddingWidget, setIsAddingWidget] = useState(false); // State to track if adding widgets
    const [showAddWidget, setShowAddWidget] = useState(false); // State to manage widget container visibility
    const [recommendations, setRecommendations] = useState(false);

    const handleMinusButtonClick = (index: any) => {
        setVisibleContainers(prev => {
            const newVisibility = [...prev];
            newVisibility[index] = !newVisibility[index];
            return newVisibility;
        });
    };

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
        <div>
            <div className='w-full mt-10 ml-10 flex flex-row'>
                <div>
                    <div id="routes_waste_logo2">
                        <FiCloudLightning />
                    </div>
                    <div className='mt-5 text-lg'>
                        Route 1
                    </div>
                    <div className='mt-2' style={{ color: "var(--secondaryColor)" }}>
                        Ballsbridge, Dublin
                    </div>
                </div>
                <div>
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

            {visibleContainers[0] && (
                <div className="routes_waste flex flex-col justify-between mt-12 w-[1150px]">
                    <div className="relative route_waste_container flex flex-row ml-5">
                        <FiMinus 
                            className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000" 
                            onClick={() => handleMinusButtonClick(0)}
                        />
                        <div className="mt-3">
                            <div id="routes_waste_logo">
                                <HiOutlineLightningBolt />
                            </div>
                        </div>
                        <div className="ml-10 mt-2 h-5">
                            <div className="mt-4">
                                <span id="road_list_waste">Pembroke Road</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {visibleContainers[1] && (
                <div className="routes_waste flex flex-col justify-between mt-5 w-[1150px]">
                    <div className="relative route_waste_container flex flex-row ml-5">
                        <FiMinus 
                            className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000" 
                            onClick={() => handleMinusButtonClick(1)}
                        />
                        <div className="mt-3">
                            <div id="routes_waste_logo">
                                <HiOutlineLightningBolt />
                            </div>
                        </div>
                        <div className="ml-10 mt-2 h-5">
                            <div className="mt-4">
                                <span id="road_list_waste">Pembroke Road 2</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Add/Done Button */}
            <button
            id="add_btn"
            onClick={handleAddButtonClick}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out
                ${isAddingWidget ? "bg-gray-300 primaryColor2" : "primaryColor2BG text-white"}`}
            >
            {isAddingWidget ? "Done" : "Add"}
            </button>

            {/* Add Widget Container */}
            {showAddWidget && <AddWidgetContainer />}

        </div>
    )
}