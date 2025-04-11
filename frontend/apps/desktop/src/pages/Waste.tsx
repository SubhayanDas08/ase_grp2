import { useState } from "react";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { authenticatedPost } from "../utils/auth";

export default function Waste() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  //const [searchTriggered, setSearchTriggered] = useState(false);

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(e.target.value);
    // setSearchTriggered(false);
  };

  const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCounty(e.target.value);
    // setSearchTriggered(false);
  };

  const onClickSearch = async () => {
    console.log("hello", selectedCounty, selectedDay)
    // fetch data from the server
    const data = await authenticatedPost<Event[]>(
      "/trashPickup/getRouteDetails",
      {
        county: selectedCounty,
        pickup_day: selectedDay,
      },
    );

    console.log("data: ", data);
    setRoutes(data);

    // setSearchTriggered(true);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-x-auto">
      {/* Header Section */}
      <div>
        <div className="mainHeaderHeight header w-full flex items-center justify-between">
          <div className="home_title titleText primaryColor1">Waste</div>
        </div>
        <div className="">
          {/* Day Selector */}
          <select
            value={selectedDay}
            onChange={handleDayChange}
            className="p-2 border border-gray-300 rounded-md text-black"
          >
            <option value="" disabled>
              Select day
            </option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          {/* County Selector */}
          <select
            value={selectedCounty}
            onChange={handleCountyChange}
            className="p-2 border border-gray-300 rounded-md text-black ml-3"
          >
            <option value="" disabled>
              Select county
            </option>
            {[
              "Cork",
              "Donegal",
              "Dublin",
              "Galway",
              "Kerry",
              "Limerick",
              "Mayo",
              "Waterford",
              "Wexford",
              "Wicklow",
            ].map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="routes_waste flex flex-col justify-between">
        {routes.map((route, index) => (
            <Link
                key={index}
                state= {{ data : {county: route.county, pickup_day: route.pickup_day, data: route, route_id: route.route_id } }}
                to={ `/wasteroutes/${route.route_name}`}
                className="route_waste_container flex flex-row justify-between items-center
                                            lg:w-full min-w-[100px] overflow-hidden"
             > 
          

            <div className="flex flex-row overflow-hidden">
              <div className="routes_waste_logo mt-3">
                <HiOutlineLightningBolt className="text-white text-2xl" />
              </div>

              <div className="cloud_secondcolumn ml-4 flex flex-col flex-wrap">
                <div className="text-lg font-bold text-white">
                  {route.route_name}
                </div>

                {/* Ensure pickup details display fully until overflow naturally hides excess */}
                <div className="cloud_info_firstrow text-gray-300 flex-1 overflow-x-auto whitespace-nowrap">
                  {route.county} -{" "}
                  {route.place_pickup_times.map((item: any, idx: any) => (
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

      <div className="flex w-full grow justify-end items-end mt-4">
        <button
          onClick={() => onClickSearch()}
          className={`px-6 py-2 h-12 rounded-full primaryColor2BG font-semibold text-white transition-all duration-300 ease-in-out`}
        >
          Search
        </button>
      </div>
    </div>
  );
}
