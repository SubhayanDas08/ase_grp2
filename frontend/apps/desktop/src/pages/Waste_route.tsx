import { useState } from 'react';
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FiCloudLightning, FiMinus } from "react-icons/fi";
import { IoClose } from "react-icons/io5"; // Import close icon
import { Link } from "react-router-dom";

export default function Waste_routes() {
    const [visibleContainers, setVisibleContainers] = useState([true, true]);
    const [isAddingWidget, setIsAddingWidget] = useState(false);
    const [showAddWidget, setShowAddWidget] = useState(false);
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

            {visibleContainers[0] && (
                <div className="routes_waste flex flex-col justify-between mt-10 w-5xl">
                    <div className="relative route_waste_container flex flex-row ml-5 w-full justify-between items-center">
                        <FiMinus 
                            className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000" 
                            onClick={() => handleMinusButtonClick(0)}
                        />
                        <div className="flex flex-row items-center">
                            <div className="mt-0.5">
                                <div id="routes_waste_logo">
                                    <HiOutlineLightningBolt />
                                </div>
                            </div>
                            <div className="ml-8 mt-0.5">
                                <span id="road_list_waste">Pembroke Road</span>
                            </div>
                        </div>
                        <div className="text-right mr-5 text-white opacity-75 text-xs">
                            est. 50 stops
                        </div>
                    </div>
                </div>
            )}

            {visibleContainers[1] && (
                <div className="routes_waste flex flex-col justify-between mt-3 w-5xl">
                    <div className="relative route_waste_container flex flex-row ml-5 w-full justify-between items-center">
                        <FiMinus 
                            className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000" 
                            onClick={() => handleMinusButtonClick(1)}
                        />
                        <div className="flex flex-row items-center">
                            <div className="mt-0.5">
                                <div id="routes_waste_logo">
                                    <HiOutlineLightningBolt />
                                </div>
                            </div>
                            <div className="ml-8 mt-0.5">
                                <span id="road_list_waste">Anglesea Road</span>
                            </div>
                        </div>
                        <div className="text-right mr-5 text-white opacity-75 text-xs">
                            est. 50 stops
                        </div>
                    </div>
                </div>
            )}

            <div className='flex w-full grow justify-end items-end'> 
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
