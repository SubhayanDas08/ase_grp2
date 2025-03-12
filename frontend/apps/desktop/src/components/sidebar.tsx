import { Link } from "react-router-dom";
import sidebarLogo from "../assets/sidebarLogo.svg";
import { FiHome, FiMap, FiList, FiTrash2, FiCloudDrizzle, FiTruck, FiSettings } from "react-icons/fi";
import { RiTrafficLightFill } from "react-icons/ri";

import "../styles/Components.css";

export default function Sidebar() {
    return(
        /*
        <div className="flex flex-col primaryColor1BG sidebarText textLight h-full w-full ">
            <div className="h-24 flex justify-center items-center border-b border-white">
                <img src={sidebarLogo} alt="Logo" className="h-1/2"/>
                <div className="sidebarText ml-2">CityManager</div>
            </div>
            <div className="h-full flex flex-col items-start gap-10 pt-5 pl-9">
                <Link to="/"  id = "one" className="sidebarItems flex items-center">
                    <div className = "f-border"><FiHome className="sidebarIcons " /></div>
                    <div className="sidebarText ml-2">Home</div>
                </Link>
                <Link to="/routing" id = "one" className="sidebarItems flex items-center">
                    <div className = "f-border"><FiMap className="sidebarIcons" /></div>
                    <div className="sidebarText ml-2">Routes</div>
                </Link>
                <Link to="/events" id = "one" className="sidebarItems flex items-center">
                    <div className = "f-border"><FiList className="sidebarIcons" /></div>
                    <div className="sidebarText ml-2">Events</div>
                </Link>
                <Link to="/traffic" id = "one" className="sidebarItems flex items-center">
                    <div className = "f-border"><RiTrafficLightFill className="sidebarIcons" /></div>
                    <div className="sidebarText ml-2">Traffic</div>
                </Link>
                <Link to="/waste" id = "one" className="sidebarItems flex items-center">
                    <div className = "f-border"><FiTrash2 className="sidebarIcons" /></div>
                    <div className="sidebarText ml-2">Waste</div>
                </Link>
                <Link to="/weather" id = "one" className="sidebarItems flex items-center">
                    <div className = "f-border"><FiCloudDrizzle className="sidebarIcons" /></div>
                    <div className="sidebarText ml-2">Weather</div>
                </Link>
                <Link to="/fleetsize" id = "one" className="sidebarItems flex items-center">
                    <div className = "f-border"><FiTruck className="sidebarIcons" /></div>
                    <div className="sidebarText ml-2">Fleet Size</div>
                </Link>
                <Link to="/settings" id = "one" className="sidebarItems flex items-center mt-5">
                    <div className = "f-border"><FiSettings className="sidebarIcons" /></div>
                    <div className="sidebarText ml-2">Settings</div>
                </Link>
            </div>
        </div>
        */
       <div className="flex flex-col h-full w-full primaryColor1BG">
            <div className="mainHeaderHeight bg-red-500 w-full border">

            </div>
            <div className="h-full w-full bg-green-500">

            </div>
       </div>
    )
}