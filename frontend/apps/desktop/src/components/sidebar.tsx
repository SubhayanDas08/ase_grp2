import { Link } from "react-router-dom";
import sidebarLogo from "../assets/sidebarLogo.svg";
import {
  FiHome,
  FiMap,
  FiList,
  FiTrash2,
  FiCloudDrizzle,
  FiTruck,
  FiSettings,
} from "react-icons/fi";
import { RiTrafficLightFill } from "react-icons/ri";

import "../styles/Components.css";

interface SidebarProps {
  permissions: string[];
}

export default function Sidebar({ permissions }: SidebarProps) {
  const routesList: {
    path: string;
    title: string;
    icon: React.ReactElement;
    permission: string;
  }[] = [
    { path: "/", title: "Home", icon: <FiHome />, permission: "" },
    {
      path: "/routing",
      title: "Routes",
      icon: <FiMap />,
      permission: "view_efficient_routes",
    },
    {
      path: "/events",
      title: "Events",
      icon: <FiList />,
      permission: "view_events",
    },
    {
      path: "/traffic",
      title: "Traffic",
      icon: <RiTrafficLightFill />,
      permission: "monitor_transport_congestion",
    },
    {
      path: "/waste",
      title: "Waste",
      icon: <FiTrash2 />,
      permission: "get_trash_pickup_recommendation",
    },
    {
      path: "/weather",
      title: "Weather",
      icon: <FiCloudDrizzle />,
      permission: "view_weather_AQI",
    },
    {
      path: "/fleetsize",
      title: "Fleet Size",
      icon: <FiTruck />,
      permission: "get_fleet_size_recommendation",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full primaryColor1BG sidebarText textLight pb-5 cursor-default overflow-y-auto">
      <div className="mainHeaderHeight sidebarHeader">
        <img src={sidebarLogo} alt="Logo" className="h-2/3" />
        <div className="ml-2 font-bold text-xl">Ecovate Ireland</div>
      </div>
      <div className="w-full h-full flex flex-col pt-5 font-normal">
        {routesList.map((route, index) => {
          if (!route.permission || permissions.includes(route.permission)) {
            return (
              <Link to={route.path} key={index} className="sidebarItem">
                <div className="iconContainer primaryColor2">{route.icon}</div>
                <div className="ml-5">{route.title}</div>
              </Link>
            );
          }
          return null;
        })}
        <div className="mt-auto">
          <Link to="/settings" className="sidebarItem">
            <div className="iconContainer primaryColor2">
              <FiSettings />
            </div>
            <div className="ml-5">Settings</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
