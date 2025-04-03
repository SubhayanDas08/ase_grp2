import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { IoCloseOutline } from "react-icons/io5";

import { WeatherWidget, EventsWidget, RoutesWidget } from "../components/HomeWidgets";

export default function Home() {
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [visibleWidgetStack, setVisibleWidgetStack] = useState<JSX.Element[]>([
    <WeatherWidget />,
    <EventsWidget />,
    <RoutesWidget />,
  ]);
  const [hiddenWidgetStack, setHiddenWidgetStack] = useState<JSX.Element[]>([
  ]);

  const closeBtn = () => setShowAddWidget(false);

  const handleAddWidget = (index: number) => {
    const widgetToAdd = hiddenWidgetStack[index];
    setHiddenWidgetStack(prev => prev.filter((_, i) => i !== index));
    setVisibleWidgetStack(prev => [...prev, widgetToAdd]);
  };
  
  const handleRemoveWidget = (index: number) => {
    const widgetToRemove = visibleWidgetStack[index];
    setVisibleWidgetStack(prev => prev.filter((_, i) => i !== index));
    setHiddenWidgetStack(prev => [...prev, widgetToRemove]);
  };
  
  const handleAddButtonClick = () => setShowAddWidget(!showAddWidget);

  const AddWidgetContainer = () => {
    return (
      <div className="absolute top-[130px] left-1/2 transform -translate-x-1/2 flex flex-col primaryColor2BG w-1/2 max-h-[80%] min-h-[25%] overflow-hidden z-50">
        {/* Close button */}
        <div className="flex justify-end">
          <button className="close_button cursor-pointer" onClick={closeBtn}>
            <IoCloseOutline />
          </button>
        </div>
        <div className="flex w-full gap-5 overflow-auto flex-wrap justify-around">
          {hiddenWidgetStack.map((widget, index) => (
            <div key={index} className="relative">
              <button
                className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                onClick={() => handleAddWidget(index)}
              >
                +
              </button>
              <div className="pointer-events-none">{widget}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          {visibleWidgetStack.map((widget, index) => (
            <div key={index} className="relative">
              {editMode && (
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                  onClick={() => handleRemoveWidget(index)}
                >
                  −
                </button>
              )}
              <div className={editMode ? "pointer-events-none" : ""}>{widget}</div>
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
          {showAddWidget && <AddWidgetContainer />}
        </div>
      </div>
    </div>
  );
}