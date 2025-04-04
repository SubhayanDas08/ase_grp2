import { useState } from "react";
import { FiMapPin, FiSun, FiCloudRain, FiMinus } from "react-icons/fi";
import { FaCloud } from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

export default function Home() {
  const [editMode, setEditMode] = useState(false); // State to track edit mode
  const [showAddWidget, setShowAddWidget] = useState(false); // State to manage widget container visibility
  const [isAddingWidget, setIsAddingWidget] = useState(false); // State to track if adding widgets

  // Add Widget Container Component
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

  // Handle Add/Done button click
  const handleAddButtonClick = () => {
    if (isAddingWidget) {
      // Save changes (e.g., add selected widgets)
      console.log("Changes saved!");
    }
    setIsAddingWidget(!isAddingWidget); // Toggle adding state
    setShowAddWidget(!showAddWidget); // Toggle widget container visibility
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header Section */}
      <div className="mainHeaderHeight w-full flex items-center justify-between">
        <div className="titleText primaryColor1">Home</div>
        <div className="flex h-fit w-fit items-center justify-end">
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out 
              ${editMode ? "bg-gray-300 primaryColor2 w-[100px]" 
                         : "primaryColor2BG text-white w-[100px]"}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Done" : "Edit"}
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col h-full w-full overflow-y-auto">
        <div className="flex flex-wrap background gap-5">
          {/* Weather Widget */}
          <div className="relative home_weather h-[350px] w-[600px] primaryColor1BG">
            {editMode && (
              <FiMinus className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000" />
            )}
            <div className="home_first_row flex flex-row justify-between mt-5">
              <div className="ml-5 flex flex-row">
                <span className="mt-1">
                  <FiMapPin />
                </span>
                <span className="ml-2 text-lg font-semibold">Dublin 1</span>
              </div>
              <div className="text-sm mr-5">
                <span id="mostlycloudy">2 min ago</span>
              </div>
            </div>

            <div className="home_second_row flex flex-row justify-between">
              <div className="cloud_container w-1/2 flex flex-row ml-5">
                <div className="cloud_firstcolumn mt-5">
                  <div id="cloud_logo">
                    <FaCloud />
                  </div>
                </div>
                <div className="cloud_secondcolumn ml-10 mt-2 h-5">
                  <div className="cloud_info_firstrow text-xs">Temperature</div>
                  <div className="cloud_info_firstrow text-lg mt-2 font-bold">6°C</div>
                  <div className="cloud_info_firstrow mt-2">
                    <span id="mostlycloudy">Mostly Cloudy</span>
                  </div>
                  <div className="cloud_info_firstrow mb-2">
                    <span id="mostlycloudy">H L</span>
                  </div>
                </div>
              </div>

              <div className="drop_container w-1/2 flex flex-row mr-5">
                <div className="cloud_firstcolumn mt-5">
                  <div id="cloud_logo">
                    <FaDroplet />
                  </div>
                </div>
                <div className="cloud_secondcolumn ml-10 mt-2">
                  <div className="cloud_info_firstrow text-xs">Precipitation</div>
                  <div className="cloud_info_firstrow text-lg mt-2 font-bold">0 mm</div>
                  <div className="cloud_info_firstrow mt-2">
                    <span id="mostlycloudy">In last 24 hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="home_third_row flex flex-row justify-between">
              <div className="cloud_container w-1/2 flex flex-row ml-5">
                <div className="cloud_firstcolumn mt-5">
                  <div id="cloud_logo">
                    <FiSun />
                  </div>
                </div>
                <div className="cloud_secondcolumn ml-10 mt-2">
                  <div className="cloud_info_firstrow text-xs">UV index</div>
                  <div className="cloud_info_firstrow text-lg mt-2 font-bold">1</div>
                  <div className="cloud_info_firstrow mt-2">
                    <span id="mostlycloudy">Low for the rest of the day.</span>
                  </div>
                </div>
              </div>

              <div className="drop_container w-1/2 flex flex-row mr-5">
                <div className="cloud_firstcolumn mt-5">
                  <div id="cloud_logo">
                    <FiCloudRain />
                  </div>
                </div>
                <div className="cloud_secondcolumn ml-10 mt-2">
                  <div className="cloud_info_firstrow text-xs">Humidity</div>
                  <div className="cloud_info_firstrow text-lg mt-2 font-bold">88%</div>
                  <div className="cloud_info_firstrow mt-2">
                    <span id="mostlycloudy">The dew point is 4°C right now.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Events Widget */}
          <div className="relative event_weather h-[350px] w-[600px] primaryColor1BG">
            {editMode && (
              <FiMinus className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000" />
            )}
            <div className="home_first_row flex flex-row justify-between mt-5">
              <div className="ml-5 flex flex-row">
                <span className="ml-2 text-lg font-semibold">Events</span>
              </div>
            </div>

            <div className="home_second_row flex flex-row justify-between">
              <div className="event_container h-[120px] w-1/2 flex flex-row ml-5">
                <div className="cloud_firstcolumn mt-5">
                  <div id="cloud_logo">
                    <FaCloud />
                  </div>
                </div>
                <div className="cloud_secondcolumn ml-10 mt-2 w-full">
                  <div className="cloud_info_firstrow text-xs ml-80">20 mins ago</div>
                  <div className="cloud_info_firstrow text-lg mt-2 font-bold">
                    Lightning strikes in Hamilton Gardens
                  </div>
                  <div className="cloud_info_firstrow text-xs"> Burning house, people crying </div>
                </div>
              </div>
            </div>

            <div className="home_third_row flex flex-row justify-between">
              <div className="event_container h-[120px] w-1/2 flex flex-row ml-5">
                <div className="cloud_firstcolumn mt-5">
                  <div id="cloud_logo">
                    <FiSun />
                  </div>
                </div>
                <div className="cloud_secondcolumn ml-10 mt-2">
                  <div className="event_info_secondrow text-xs ml-[360px]">15:45</div>
                  <div className="event_info_secondrow text-lg mt-2 font-bold">Chain Reaction Collision</div>
                  <div className="cloud_info_firstrow text-xs"> approx. 100 cars and 3 buses involved </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Widget */}
          <div className="relative h-[350px] w-[600px] primaryColor1BG">
            {editMode && (
              <FiMinus className="circlecontainer absolute -top-1 -right-1 cursor-pointer z-1000 ml-100" />
            )}
            <MapContainer 
              center={[53.3498, -6.2603]} // Dublin's coordinates
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[53.3498, -6.2603]}>
                <Popup> Dublin City Center </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
        <div className='flex w-full mt-auto justify-end items-end p-4'> 
          {/* Add/Done Button */}
          <button
            onClick={handleAddButtonClick}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out
              ${isAddingWidget ? "bg-gray-300 primaryColor2" : "primaryColor2BG text-white"}`}
          >
            {isAddingWidget ? "Done" : "Add"}
          </button>
          {/* Add Widget Container */}
          {showAddWidget && <AddWidgetContainer />}
        </div>
      </div>
    </div>
  );
}