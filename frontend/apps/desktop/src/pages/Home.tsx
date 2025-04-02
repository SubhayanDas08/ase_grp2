import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiSun, FiCloudRain, FiMinus } from "react-icons/fi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaCloud } from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface Location {
  latitude: number;
  longitude: number;
  label: string;
}

export default function Home() {
  // --------------------------------------------------------------------------------------------------------------
  // ---------------------------
  //  State
  // ---------------------------

  // Edit mode states
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  // Dynamically added widgets (for any widget type beyond the 6 below)
  const [widgets, setWidgets] = useState<{ id: number; type: string }[]>([]);

  /**
   * Track which widgets are disabled/hidden. Any widget key in this array
   * will appear in the Add Widgets container. The six "default" widgets are:
   *    - weatherWidget
   *    - eventsWidget
   *    - mapWidget
   *    - fleetsize
   *    - widget2
   *    - widget3
   *
   * Initially, we assume weather, events, map are enabled (not in this list),
   * and widget1, widget2, widget3 are disabled (so they start in this list).
   */
  const [disabledDefaultWidgets, setDisabledDefaultWidgets] = useState<string[]>([
    "fleetsize",
  ]);

  /**
   * Whether each of the 6 widgets is currently visible on the home screen.
   * Defaults: weatherWidget, eventsWidget, mapWidget => true
   *           fleetsize, widget2, widget3 => false
   */
  const [widgetVisibility, setWidgetVisibility] = useState({
    weatherWidget: true,
    eventsWidget: true,
    mapWidget: true,
    fleetsize: false,
  });

  // Location state (not directly relevant to widget adding/removal)
  const [location, setLocation] = useState<Location>({
    latitude: 53.3498,
    longitude: -6.2603,
    label: "Dublin, Ireland",
  });

  // Effects
  useEffect(() => {
    console.log(location);
  }, [location]);

  // ---------------------------
  //  Handlers
  // ---------------------------

  // Close the AddWidgetContainer
  const closeBtn = () => {
    setShowAddWidget(false);
  };

  /**
   * Re-add a disabled widget or create a new dynamic widget.
   *
   * If widgetType is one of the 6 "default" widgets (weather, events, map, fleetsize, widget2, widget3),
   * then remove it from disabledDefaultWidgets and set it to visible.
   * Otherwise, create a brand-new dynamic widget in the `widgets` array.
   */
  const handleAddWidget = (widgetType: string) => {
    if (
      [
        "weatherWidget",
        "eventsWidget",
        "mapWidget",
        "fleetsize"
      ].includes(widgetType)
    ) {
      // Remove from disabledDefaultWidgets
      setDisabledDefaultWidgets((prev) => prev.filter((w) => w !== widgetType));
      // Set it visible
      setWidgetVisibility((prev) => ({
        ...prev,
        [widgetType]: true,
      }));
    } else {
      // Otherwise add a brand-new (multi-instance) widget
      setWidgets((prevWidgets) => [
        ...prevWidgets,
        { id: prevWidgets.length + 1, type: widgetType },
      ]);
    }
  };

  // Delete a newly added (dynamic) widget
  const handleDeleteNewWidget = (widgetId: number) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== widgetId));
  };

  /**
   * Hide (disable) any of the 6 "default" widgets. This pushes the widget
   * to the end of `disabledDefaultWidgets` so it appears last in the
   * Add Widgets container.
   */
  const handleDeleteWidget = (
    widgetKey:
      | "weatherWidget"
      | "eventsWidget"
      | "mapWidget"
      | "fleetsize"
  ) => {
    // Hide the widget
    setWidgetVisibility((prev) => ({
      ...prev,
      [widgetKey]: false,
    }));

    // Remove the widget from its current position (if any) and append it at the end
    setDisabledDefaultWidgets((prev) => {
      const newDisabled = prev.filter((w) => w !== widgetKey);
      return [...newDisabled, widgetKey];
    });
  };
  
  // Toggle the AddWidgetContainer
  const handleAddButtonClick = () => {
    if (isAddingWidget) {
      console.log("Changes saved!");
    }
    setIsAddingWidget(!isAddingWidget);
    setShowAddWidget(!showAddWidget);
  };
  const AddWidgetContainer = () => {
    return (
      <div className="absolute top-[130px] left-1/2 transform -translate-x-1/2 flex flex-col bg-red-500 w-1/2 max-h-[80vh] overflow-hidden">
        {/* Close button */}
        <div className="flex justify-end">
          <button className="close_button" onClick={closeBtn}>
            <IoCloseOutline />
          </button>
        </div>
        <div className="w-full gap-5 overflow-auto">
          {hiddenWidgetStack.map((widget, index) => (
            widget
          ))}
        </div>
      </div>
    );
  }
  

  const AddWidgetContainerOLD = () => {
    return (
      <div
        className="add-widget-container p-4 bg-white shadow-lg rounded-lg absolute top-20 right-10 z-10"
        style={{ left: "30%" }}
      >
        {/* Close button */}
        <div className="flex justify-end">
          <button className="close_button" onClick={closeBtn}>
            <IoCloseOutline />
          </button>
        </div>

        {/* Scrollable Widget Options */}
        <div className="widget-scroll-container overflow-y-auto max-h-[500px] mt-2">
          <h2 className="text-lg font-semibold mb-4 text-white">Add Widgets</h2>
          <div className="widget-options flex flex-wrap">
            {/** 
             *  Map over the disabledDefaultWidgets. Each entry is one of:
             *   - "weatherWidget"
             *   - "eventsWidget"
             *   - "mapWidget"
             *   - "fleetsize"
             *   - "widget2"
             *   - "widget3"
             *  Show a preview for each, plus a "plus" button to re-add.
             */}
            {disabledDefaultWidgets.map((widgetKey) => (
              <div
                key={widgetKey}
                className="widget-option rounded-lg m-2 textDark relative overflow-hidden"
                style={{ width: "350px", height: "250px" }}
              >
                {widgetKey === "weatherWidget" ? (
                  // -- Weather PREVIEW (mini version) --
                  <div id="weatherwidget" className="w-full h-full relative bg-teal-400">
                    <div className="relative z-10 p-3 text-white text-xs">
                      {/* Top Row: location & time */}
                      <div className="flex justify-between mb-2">
                        <div className="font-semibold text-sm flex items-center gap-1">
                          <FiMapPin /> Dublin 1
                        </div>
                        <div className="text-sm">2 min ago</div>
                      </div>

                      {/* Grid with 4 blocks: Temperature, Precipitation, UV index, Humidity */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Temperature */}
                        <div className="bg-teal-500 p-2 rounded">
                          <div className="text-[10px]">Temperature</div>
                          <div className="font-bold text-sm">6°C</div>
                          <div className="text-[10px]">Mostly Cloudy</div>
                          <div className="text-[10px]">H L</div>
                        </div>
                        {/* Precipitation */}
                        <div className="bg-teal-500 p-2 rounded">
                          <div className="text-[10px]">Precipitation</div>
                          <div className="font-bold text-sm">0 mm</div>
                          <div className="text-[10px]">In last 24 hours</div>
                        </div>
                        {/* UV index */}
                        <div className="bg-teal-500 p-2 rounded">
                          <div className="text-[10px]">UV index</div>
                          <div className="font-bold text-sm">1</div>
                          <div className="text-[10px]">
                            Low for the rest of the day.
                          </div>
                        </div>
                        {/* Humidity */}
                        <div className="bg-teal-500 p-2 rounded">
                          <div className="text-[10px]">Humidity</div>
                          <div className="font-bold text-sm">88%</div>
                          <div className="text-[10px]">
                            The dew point is 4°C right now.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : widgetKey === "eventsWidget" ? (
                  // -- Events PREVIEW --
                  <div id="eventwidget" className="w-full h-full relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: "url('/images/eventsPreview.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    <div className="relative z-10 p-3 text-white text-xs">
                      <div className="text-base font-semibold mb-2">Events</div>

                      {/* First event row */}
                      <div className="bg-teal-500 p-2 rounded mb-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FaCloud />
                          <div className="font-semibold text-[10px]">
                            Lightning strikes in Hamilton Gardens
                          </div>
                        </div>
                        <div className="text-[10px]">20 mins ago</div>
                      </div>
                      <div className="text-[10px] ml-6 mb-2">
                        Burning house, people crying
                      </div>

                      {/* Second event row */}
                      <div className="bg-teal-500 p-2 rounded mb-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FiSun />
                          <div className="font-semibold text-[10px]">
                            Chain Reaction Collision
                          </div>
                        </div>
                        <div className="text-[10px]">15:45</div>
                      </div>
                      <div className="text-[10px] ml-6">
                        approx. 100 cars and 3 buses involved
                      </div>
                    </div>
                  </div>
                ) : widgetKey === "mapWidget" ? (
                  // -- Map PREVIEW --
                  <div className="absolute inset-0 z-0">
                    <MapContainer
                      center={[53.3498, -6.2603]}
                      zoom={13}
                      style={{
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none", // disable map interaction in preview
                      }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[53.3498, -6.2603]}>
                        <Popup>Dublin City Center</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                ) : widgetKey === "fleetsize" ? (
                  // -- Widget 1 PREVIEW --
                  <div className="fleet_widgets absolute inset-0 flex items-center justify-center text-white font-semibold">
                    <span id="fleet_widget_heading">Fleet Size</span>
                    <div className="fleetsize_content">
                     <div id="addbuses">
                      <div id="busfirstrow">
                      <span id="cloud_icon"><FiCloudRain/></span>
                      <span id="buses_content">Add more buses</span>
                      <span id="bustime">2 mins ago</span>
                      </div>
                      <span id="busattention">Attention needed</span>
                      </div>
                      <div id="exceptional">
                        <div id="exceptionalfirstrow">
                        <span id="thunderlogo"><AiOutlineThunderbolt/></span>
                      <span id="exceptional_content">Exceptional high demand in City Centre!</span>
                      <span id="exceptionaltime">2 mins ago</span>
                        </div>
                        <span id="exceptionalsuggestion">Suggestion</span>
                      </div>
                      <div id="past_recommendation">
                        <span id="recom_logo"><MdOutlineKeyboardArrowDown/></span>
                        <span id="pastrecom_content">past recommendations</span>
                        </div>
                      <div className="chain_reaction">
                        <div id="chainfirstrow">
                         <span id="thunderlogo"><AiOutlineThunderbolt/></span>
                         <span id="chain_content">Double Chain Reaction Collision</span>
                         <div className="chain_time">
                          <span id="time_first_part">23/01/25</span>
                          <span id="time_second_part">15:45</span>
                         </div>
                        </div>
                        <span id="chainaction">Critical Action</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Fallback for any other key
                  <div className="absolute inset-0 bg-teal-400 flex items-center justify-center text-white font-semibold">
                    {widgetKey}
                  </div>
                )}

                {/* Plus button on top */}
                <button
                  className="add_symbol absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow"
                  onClick={() => handleAddWidget(widgetKey)}
                >
                  <FaPlus />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  // --------------------------------------------------------------------------------------------------------------
  const [editMode, setEditMode] = useState(false);
  const [visibleWidgetStack, setVisibleWidgetStack] = useState<JSX.Element[]>([
    <div className="h-[200px] w-[400px] bg-blue-500">Widget 1</div>,
    <div className="h-[200px] w-[400px] bg-blue-200">Widget 2</div>,
    <div className="h-[200px] w-[400px] bg-blue-800">Widget 3</div>,
  ]);
  const [hiddenWidgetStack, setHiddenWidgetStack] = useState<JSX.Element[]>([
    <div className="h-[200px] w-[400px] bg-red-300">Widget 4</div>,
  ]);

  return (
    <div className="h-full w-full flex flex-col relative">
      {/* Header Section */}
      <div className="mainHeaderHeight w-full flex items-center justify-between">
          <div className="titleText primaryColor1">Home</div>
          <button
            className={`
              flex-shrink-0
              px-4 py-2 
              rounded-full 
              font-semibold 
              transition-all 
              duration-300 
              ease-in-out 
              text-sm sm:text-base
              ${editMode 
                ? "bg-gray-300 primaryColor2 w-[80px] sm:w-[100px]" 
                : "primaryColor2BG text-white w-[80px] sm:w-[100px]"
              }
            `}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Done" : "Edit"}
          </button>
      </div>
      {/* Main Content Section */}
      <div className="flex flex-col h-full w-full overflow-y-auto bg-green-500">
        {/* Widgets Section */}
        <div className="flex flex-wrap gap-5 bg-gray-500">
          {visibleWidgetStack.map((widget, index) => (
            widget
          ))}
        </div>
        <div className="hidden flex flex-wrap gap-5 bg-red-500">
          {/* Weather Widget */}
          {widgetVisibility.weatherWidget && (
            <Link to="/weather">
              <div className="relative home_weather h-[350px] w-[600px] primaryColor1BG">
                {editMode && (
                  <FiMinus
                    className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000"
                    onClick={(e) => { e.preventDefault();e.stopPropagation(); handleDeleteWidget("weatherWidget"); }}
                  />
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
                      <div className="cloud_info_firstrow text-lg mt-2 font-bold">
                        6°C
                      </div>
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
                      <div className="cloud_info_firstrow text-lg mt-2 font-bold">
                        0 mm
                      </div>
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
                      <div className="cloud_info_firstrow text-lg mt-2 font-bold">
                        1
                      </div>
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
                      <div className="cloud_info_firstrow text-lg mt-2 font-bold">
                        88%
                      </div>
                      <div className="cloud_info_firstrow mt-2">
                        <span id="mostlycloudy">The dew point is 4°C right now.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
          {/* Events Widget */}
          {widgetVisibility.eventsWidget && (
            <Link to="/events">
              <div className="relative event_weather h-[350px] w-[600px] primaryColor1BG">
                {editMode && (
                  <FiMinus
                    className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000"
                    onClick={(e) => { e.preventDefault();e.stopPropagation(); handleDeleteWidget("eventsWidget"); }}
                  />
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
                      <div className="cloud_info_firstrow text-xs ml-80">
                        20 mins ago
                      </div>
                      <div className="cloud_info_firstrow text-lg mt-2 font-bold">
                        Lightning strikes in Hamilton Gardens
                      </div>
                      <div className="cloud_info_firstrow text-xs">
                        Burning house, people crying
                      </div>
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
                      <div className="event_info_secondrow text-xs ml-[360px]">
                        15:45
                      </div>
                      <div className="event_info_secondrow text-lg mt-2 font-bold">
                        Chain Reaction Collision
                      </div>
                      <div className="cloud_info_firstrow text-xs">
                        approx. 100 cars and 3 buses involved
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
          {/* Map Widget */}
          {widgetVisibility.mapWidget && (
            <Link to="/routing">
              <div className="relative map_container h-[350px] w-[600px] rounded-[40px] primaryColor1BG">
                {editMode && (
                  <FiMinus
                    className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000"
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteWidget("mapWidget");
                    }}
                  />
                )}
                <div className="map_inner_container h-full w-full rounded-[40px] overflow-hidden">
                  <MapContainer
                    center={[53.3498, -6.2603]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[53.3498, -6.2603]}>
                      <Popup>Dublin City Center</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            </Link>
          )}
          {/* Fleetsize Widget */}
          {widgetVisibility.fleetsize && (
            <Link to="/fleetsize">
              <div className="main_fleet_size relative home_weather min-h-[350px] w-[600px] primaryColor1BG p-4">
                {editMode && (
                  <FiMinus
                    className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000"
                    onClick={(e) => { e.preventDefault();e.stopPropagation(); handleDeleteWidget("fleetsize"); }}
                  />
                )}

                {/* Header Row */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="fleet_size_heading text-lg font-semibold">Fleet Size</h2>
                  <span id="tfi" className="text-base font-medium">Transport for Ireland (TFI)</span>
                </div>

                {/* 1) Add more buses to Borris */}
                <div className="add_more rounded-md p-3 mb-3 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span id="attention_cloud_logo"><FiCloudRain/></span>
                      <span className="text-white font-semibold">
                        Add more buses to Borris
                      </span>
                    </div>
                    <span className="attention_needed inline-block mt-1 text-xs px-2 py-1 bg-yellow-300 text-black rounded">
                      Attention needed
                    </span>
                  </div>
                  <span className="attention_time text-xs text-white">2 min ago</span>
                </div>

                {/* 2) Exceptional high demand in City Centre */}
                <div className="exceptional_high_demand rounded-md p-3 mb-3 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                    <span id="attention_cloud_logo"> <AiOutlineThunderbolt/></span>
                      <span className="text-white font-semibold">
                        Exceptional high demand in City Centre
                      </span>
                    </div>
                    <span className="suggestion_needed inline-block mt-1 text-xs px-2 py-1 bg-green-300 text-black rounded">
                      Suggestion
                    </span>
                  </div>
                  <span className="attention_time text-xs text-white">2 min ago</span>
                </div>

                {/* Past Recommendations */}
                <div>
                  <div className="past_recom">
                    <span id="past_recom_logo"><MdOutlineKeyboardArrowDown/></span>
                  <h3 className="past_recom_heading text-sm font-semibold mb-2">Past recommendations</h3>
                  </div>
                  <div className="double_chain rounded-md p-3 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                      <span id="attention_cloud_logo"><AiOutlineThunderbolt/></span> 
                        <span className="text-white font-semibold">
                          Double Chain Reaction Collision
                        </span>
                      </div>
                      <span className="action_criticial inline-block mt-1 text-xs px-2 py-1 bg-red-500 text-white rounded">
                        Critical Action
                      </span>
                    </div>
                    <div className="flex flex-col items-end text-xs text-white">
                      <span id="critical_time">23/01/25</span>
                      <span>15:45</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
          {/* Dynamically Added Widgets (unlimited) */}
          {widgets.map((widget) => (
              <div
                key={widget.id}
                className="relative home_weather h-[350px] w-[600px] primaryColor1BG"
              >
                {/* Minus button to delete newly added widget */}
                {editMode && (
                  <FiMinus
                    className="circlecontainer absolute -top-2 -right-1 cursor-pointer z-1000"
                    onClick={() => handleDeleteNewWidget(widget.id)}
                  />
                )}
                <div className="home_first_row flex flex-row justify-between mt-5">
                  <div className="ml-5 flex flex-row">
                    <span className="ml-2 text-lg font-semibold">
                      {widget.type} - Widget {widget.id}
                    </span>
                  </div>
                </div>
              </div>
          ))}
        </div>
        {/* Add Widget Button */}
        <div className='flex w-full mt-auto justify-end items-end p-4 bg-yellow-500'>
          {/* Add/Done Button */}
          {editMode == true && showAddWidget == false && (
            <button
              onClick={handleAddButtonClick}
              className="px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out primaryColor2BG text-white"
            >
              Add
            </button>
          )}
          {/* Add Widget Container */}
          {showAddWidget && <AddWidgetContainer />}
        </div>
      </div>
    </div>
  );
}
