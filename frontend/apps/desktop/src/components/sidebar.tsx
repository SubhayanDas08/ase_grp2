import { Link } from "react-router-dom";
import sidebarLogo from "../assets/sidebarLogo.svg";
import { FiHome, FiMap, FiList, FiTrash2, FiCloudDrizzle, FiTruck, FiSettings } from "react-icons/fi";
import { RiTrafficLightFill } from "react-icons/ri";

export default function Sidebar() {
    return(
        <div id="sidebarID" className="sidebarContainer primaryColor2BG textLight h-full">
            <div className="h-24 flex justify-center items-center">
                <img src={sidebarLogo} alt="Logo" className="h-1/2"/>
            </div>
            <div id="sideBarMod" className="h-full flex flex-col justify-between gap-10 pt-24 relative">
                <Link to="/" className="sidebarItems">
                    <div className = "f-border"><FiHome className="sidebarIcons " /></div>
                    <div className="sidebarText">Home</div>
                </Link>
                <Link to="/routes" className="sidebarItems">
                    <div className = "f-border"><FiMap className="sidebarIcons" /></div>
                    <div className="sidebarText">Routes</div>
                </Link>
                <Link to="/events" className="sidebarItems">
                    <div className = "f-border"><FiList className="sidebarIcons" /></div>
                    <div className="sidebarText">Events</div>
                </Link>
                <Link to="/traffic" className="sidebarItems">
                    <div className = "f-border"><RiTrafficLightFill className="sidebarIcons" /></div>
                    <div className="sidebarText">Traffic</div>
                </Link>
                <Link to="/waste" className="sidebarItems">
                    <div className = "f-border"><FiTrash2 className="sidebarIcons" /></div>
                    <div className="sidebarText">Waste</div>
                </Link>
                <Link to="/weather" className="sidebarItems">
                    <div className = "f-border"><FiCloudDrizzle className="sidebarIcons" /></div>
                    <div className="sidebarText">Weather</div>
                </Link>
                <Link to="/fleetsize" className="sidebarItems">
                    <div className = "f-border"><FiTruck className="sidebarIcons" /></div>
                    <div className="sidebarText">Fleet Size</div>
                </Link>
                <Link to="/settings" className="sidebarItems">
                    <div className = "f-border"><FiSettings className="sidebarIcons" /></div>
                    <div className="sidebarText">Settings</div>
                </Link>
            </div>
        </div>
    )
}