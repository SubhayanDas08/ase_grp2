import { Link } from "react-router-dom";

import TauriSVG from "../assets/tauri.svg";
import { FiHome, FiMapPin, FiServer, FiSettings } from "react-icons/fi";

export default function Sidebar() {
    return(
        <div className="sidebarContainer">
            <div className="h-24 flex justify-center items-center">
                <img src={TauriSVG} alt="Tauri Logo" className="h-1/2"/>
            </div>
            <div className="h-full flex flex-col pt-24 relative">
                <Link to="/" className="sidebarItems">
                    <FiHome className="sidebarIcons" />
                    <div className="sidebarText">Home</div>
                </Link>
                <Link to="/map" className="sidebarItems">
                    <FiMapPin className="sidebarIcons" />
                    <div className="sidebarText">Map</div>
                </Link>
                <Link to="/server" className="sidebarItems">
                    <FiServer className="sidebarIcons" />
                    <div className="sidebarText">Server</div>
                </Link>
                <Link to="/settings" className="sidebarItems">
                    <FiSettings className="sidebarIcons" />
                    <div className="sidebarText">Settings</div>
                </Link>
            </div>
        </div>
    )
}