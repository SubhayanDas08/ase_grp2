import { FiMapPin} from "react-icons/fi";
import { FaCloud} from "react-icons/fa";
import {FaDroplet} from "react-icons/fa6";

export default function Home() {
  return(
    <>
    <div className ="header flex flex-row">
      <div className="home_title titleText">
        Home
      </div>
      <div>
        <button className="editHomeButton">
        Edit
        </button>
      </div>
    </div>
    
    <div className="home_main">
        <div className="first_row mt-4">
           <div className="home_weather h-[350px] primaryColor1BG">
             <div className="home_first_row flex flex-row justify-between mt-5">
                <div className="ml-5 flex flex-row"><span className="mt-1"><FiMapPin/></span><span className="ml-2 text-lg">Dublin 1</span></div>
                <div className="text-sm mr-5"><span id="mostlycloudy">2 mins ago</span></div>
              </div>
              <div className="home_second_row flex flex-row justify-between">
                <div className="cloud_container w-1/2 flex flex-row ml-5"><div className="cloud_firstcolumn mt-5"><div id="cloud_logo"><FaCloud/></div></div>
                <div className="cloud_secondcolumn ml-10 mt-2">
                  <div className="cloud_info_firstrow text-xs">Temperature</div>
                  <div className="cloud_info_firstrow text-lg mt-2 font-bold">6C</div>
                  <div className="cloud_info_firstrow mt-2"><span id="mostlycloudy">Mostly Cloudy</span></div>
                  <div className="cloud_info_firstrow mb-2"><span id="mostlycloudy">H L</span></div>
                </div>
                </div>
                <div className="drop_container w-1/2 flex flex-row mr-5 "><div className="cloud_firstcolumn mt-5"><div id="cloud_logo"><FaDroplet/></div></div>
                <div className="cloud_secondcolumn ml-10 mt-2">
                  <div className="cloud_info_firstrow text-xs">Precipitation</div>
                  <div className="cloud_info_firstrow text-lg mt-2">0 mm</div>
                  <div className="cloud_info_firstrow mt-2"><span id="mostlycloudy">In last 24 hours</span></div>
                </div>
                </div>
              </div>
              <div className="home_third_row flex flex-row justify-between">
              <div className="cloud_container w-1/2 flex flex-row ml-5"><div className="cloud_firstcolumn mt-5"><div id="cloud_logo"><FaCloud/></div></div>
                <div className="cloud_secondcolumn ml-10 mt-2">
                  <div className="cloud_info_firstrow text-xs">Temperature</div>
                  <div className="cloud_info_firstrow text-lg mt-2 font-bold">6C</div>
                  <div className="cloud_info_firstrow mt-2"><span id="mostlycloudy">Mostly Cloudy</span></div>
                  <div className="cloud_info_firstrow mb-2"><span id="mostlycloudy">H L</span></div>
                </div>
                </div>
                <div>humidity</div>
              </div>
            </div>
           <div className="event_weather">Events</div>
        </div>
        <div className="second_row"></div>
        <div className="third_row"></div>
    </div>
    </>
  )
}
