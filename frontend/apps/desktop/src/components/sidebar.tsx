import { Link } from "react-router-dom";
import sidebarLogo from "../assets/sidebarLogo.svg";
import { FiHome, FiMap, FiList, FiTrash2, FiCloudDrizzle, FiTruck, FiSettings } from "react-icons/fi";
import { RiTrafficLightFill } from "react-icons/ri";

import "../styles/Components.css";

export default function Sidebar() {
    const routesList: string[] = ["/", "/routing", "/events", "/traffic", "/waste", "/weather", "/fleetsize"];
    const sidebarTitlesList: string[] = ["Home", "Routes", "Events", "Traffic", "Waste", "Weather", "Fleet Size"];
    const sidebarIconsList: React.ReactElement[] = [<FiHome />, <FiMap />, <FiList />, <RiTrafficLightFill />, <FiTrash2 />, <FiCloudDrizzle />, <FiTruck />];

    return(
       <div className="flex flex-col h-full w-full primaryColor1BG sidebarText font-bold textLight pb-5 cursor-default overflow-y-auto">
            <div className="mainHeaderHeight sidebarHeader">
                <img src={sidebarLogo} alt="Logo" className="h-2/3"/>
                <div className="ml-2">CityManager</div>
            </div>
            <div className="w-full h-full flex flex-col pt-5 font-normal">
                {routesList.map((route, index) => {
                    return(
                        <Link to={route} key={index} className="sidebarItem">
                            <div className="iconContainer primaryColor2">{sidebarIconsList[index]}</div>
                            <div className="ml-5">{sidebarTitlesList[index]}</div>
                        </Link>
                    );
                })}
                <div className="mt-auto">
                    <Link to="/settings" className="sidebarItem">
                        <div className="iconContainer primaryColor2"><FiSettings /></div>
                        <div className="ml-5">Settings</div>
                    </Link>
                </div>
            </div>
       </div>
    )
}