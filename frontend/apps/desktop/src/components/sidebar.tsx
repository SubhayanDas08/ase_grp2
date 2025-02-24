import { Link } from "react-router-dom";
import sidebarLogo from "../assets/sidebarLogo.svg";
import { FiHome, FiMap, FiList, FiTrash2, FiCloudDrizzle, FiTruck, FiSettings } from "react-icons/fi";
import { RiTrafficLightFill } from "react-icons/ri";

export default function Sidebar() {
    return(
        <div className="sidebarContainer primaryColor2BG textLight">
            <div className="h-24 flex justify-center items-center">
                <img src={sidebarLogo} alt="Logo" className="h-1/2"/>
            </div>
            <div className="h-full flex flex-col pt-24 relative">
                <Link to="/" className="sidebarItems">
                    <FiHome className="sidebarIcons" />
                    <div className="sidebarText">Home</div>
                </Link>
                <Link to="/routes" className="sidebarItems">
                    <FiMap className="sidebarIcons" />
                    <div className="sidebarText">Routes</div>
                </Link>
                <Link to="/events" className="sidebarItems">
                    <FiList className="sidebarIcons" />
                    <div className="sidebarText">Events</div>
                </Link>
                <Link to="/traffic" className="sidebarItems">
                    <RiTrafficLightFill className="sidebarIcons" />
                    <div className="sidebarText">Traffic</div>
                </Link>
                <Link to="/waste" className="sidebarItems">
                    <FiTrash2 className="sidebarIcons" />
                    <div className="sidebarText">Waste</div>
                </Link>
                <Link to="/weather" className="sidebarItems">
                    <FiCloudDrizzle className="sidebarIcons" />
                    <div className="sidebarText">Weather</div>
                </Link>
                <Link to="/fleetsize" className="sidebarItems">
                    <FiTruck className="sidebarIcons" />
                    <div className="sidebarText">Fleet Size</div>
                </Link>
                <Link to="/settings" className="sidebarItems">
                    <FiSettings className="sidebarIcons" />
                    <div className="sidebarText">Settings</div>
                </Link>
            </div>
        </div>
    )
}