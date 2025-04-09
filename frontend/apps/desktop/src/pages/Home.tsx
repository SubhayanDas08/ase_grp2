import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { IoCloseOutline, IoAdd, IoRemove } from "react-icons/io5";

import { WeatherWidget, EventsWidget, RoutesWidget } from "../components/HomeWidgets";

export default function Home() {
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const widgetDictionary: Record<string, JSX.Element> = {
    weather: <WeatherWidget />,
    events: <EventsWidget />,
    routes: <RoutesWidget />
  };
  const [visibleWidgets, setVisibleWidgets] = useState<string[]>(["weather", "events"]);
  const [hiddenWidgets, setHiddenWidgets] = useState<string[]>(["routes"]);

  const closeBtn = () => setShowAddWidget(false);

  const handleAddWidget = (index: number) => {
    const widgetToAdd = hiddenWidgets[index];
    setHiddenWidgets(prev => prev.filter((_, i) => i !== index));
    setVisibleWidgets(prev => [...prev, widgetToAdd]);
  };
  
  const handleRemoveWidget = (index: number) => {
    const widgetToRemove = visibleWidgets[index];
    setVisibleWidgets(prev => prev.filter((_, i) => i !== index));
    setHiddenWidgets(prev => [...prev, widgetToRemove]);
  };
  
  const handleAddButtonClick = () => setShowAddWidget(!showAddWidget);

  const AddWidgetContainer = () => {
    return (
      <div 
        className="absolute top-[130px] left-1/2 transform -translate-x-1/2 flex flex-col primaryColor2BG w-5/8 max-h-[80%] min-h-[25%] overflow-hidden z-50 p-5 shadow-2xl"
        style={{borderRadius: "var(--cornerRadius)"}}
      >
        <div className="flex justify-between mb-5">
          <div className="textLight titleText">Add Widgets</div>
          <button className="widgetButton" onClick={closeBtn}>
            <IoCloseOutline />
          </button>
        </div>
        <div className="flex w-full gap-5 overflow-auto flex-wrap justify-around">
          {hiddenWidgets.map((key, index) => (
            <div key={index} className="relative">
              <button
                className="absolute right-0 widgetButton"
                onClick={() => handleAddWidget(index)}
              >
                <IoAdd />
              </button>
              <div className="pointer-events-none">{widgetDictionary[key]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  useEffect(() => {
    const savedVisible = localStorage.getItem("visibleWidgets");
    const savedHidden = localStorage.getItem("hiddenWidgets");
  
    if (savedVisible && savedHidden) {
      setVisibleWidgets(JSON.parse(savedVisible));
      setHiddenWidgets(JSON.parse(savedHidden));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("visibleWidgets", JSON.stringify(visibleWidgets));
    localStorage.setItem("hiddenWidgets", JSON.stringify(hiddenWidgets));
  }, [visibleWidgets, hiddenWidgets]);

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
              cursor-pointer
              ${editMode 
                ? "bg-gray-300 primaryColor2 w-[80px] sm:w-[100px]" 
                : "primaryColor2BG text-white w-[80px] sm:w-[100px]"
              }
            `}
            onClick={() => {
              setEditMode(!editMode);
              setShowAddWidget(false);
            }}
          >
            {editMode ? "Done" : "Edit"}
          </button>
      </div>
      {/* Main Content Section */}
      <div className="flex flex-col h-full w-full overflow-y-auto">
        {/* Widgets Section */}
        <div className="flex flex-wrap gap-5">
          {visibleWidgets.map((key, index) => (
            <div key={index} className="relative">
              {editMode && (
                <button
                  className="absolute right-0 widgetButton"
                  onClick={() => handleRemoveWidget(index)}
                >
                  <IoRemove />
                </button>
              )}
              <div className={editMode ? "pointer-events-none" : ""}>{widgetDictionary[key]}</div>
            </div>
          ))}
        </div>
        {/* Add Widget Button */}
        <div className='flex w-full mt-auto justify-end items-end p-4'>
          {/* Add button only shown when editing and not displaying add widget container */}
          {editMode && !showAddWidget && (
            <button
              onClick={handleAddButtonClick}
              className="px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out primaryColor2BG text-white cursor-pointer"
            >
              Add
            </button>
          )}
          {/* Add Widget Container */}
          {showAddWidget && (
            <>
              <div className="backgroundBlur"></div>
              <AddWidgetContainer />
            </>
          )}
        </div>
      </div>
    </div>
  );
}