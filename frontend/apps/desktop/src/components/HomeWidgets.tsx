import { Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { FiCloud, FiDroplet, FiSun, FiCloudRain, FiMapPin, FiCloudLightning, FiZap } from "react-icons/fi";

export function WeatherWidget() {
    const widgetContentItems = [
        {
            title: "Temperature",
            mainInfo: "6°C",
            secondaryInfo: "Mostly Cloudy",
            tertiaryInfo: "H: 9°CL: 5°C",
            icon: <FiCloud className="widgetIcons" />
        },
        {
            title: "Precipitation",
            mainInfo: "0 mm",
            secondaryInfo: "In last 24 hours",
            icon: <FiDroplet className="widgetIcons" />
        },
        {
            title: "UV Index",
            mainInfo: "1",
            secondaryInfo: "Low for the rest of the day",
            icon: <FiSun className="widgetIcons" />
        },
        {
            title: "Humidity",
            mainInfo: "88 %",
            secondaryInfo: "The dew point is 4°C right now",
            icon: <FiCloudRain className="widgetIcons" />
        }
    ];

    return (
        <Link to="/weather" className="widgetContainer pb-5 ps-5 pe-5">
            <div className="flex h-[20%] justify-between items-center">
                <div className="flex items-center">
                    <FiMapPin />
                    <div className="ms-2 widgetTitle">Dublin 1</div>
                </div>
                <div className="widgetTitleSecondary">2 min ago</div>
            </div>
            <div className="grid grid-cols-2 gap-5 h-[80%]">
                {widgetContentItems.map((item, index) => (
                    <div key={index} className="widgetContainerItemContainer">
                        <div className="w-24 flex justify-center items-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white">
                                {item.icon}
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 pt-2">
                            <div className="miniText">{item.title}</div>
                            <div className="widgetTitle font-bold">{item.mainInfo}</div>
                            <div className="widgetTitleSecondary">{item.secondaryInfo}</div>
                            <div className="widgetTitleSecondary">{item.tertiaryInfo}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Link>
    );
}

export function EventsWidget() {
    const widgetContentItems = [
        {
            title: "Lightning strike in Hamilton Gardens",
            time: "20 min ago",
            secondaryInfo: "Burning houses, People crying",
            icon: <FiCloudLightning className="widgetIcons" />
        },
        {
            title: "Chain Reaction Collision",
            time: "15:45",
            secondaryInfo: "approx. 100 cars and 3 buses involved",
            icon: <FiZap className="widgetIcons" />
        },
    ];
    return (
        <Link to="/events" className="widgetContainer pb-5 ps-5 pe-5">
            <div className="flex h-[20%] justify-between items-center">
                <div className="flex items-center">
                    <div className="ms-2 widgetTitle">Events</div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-5 h-[80%]">
                {widgetContentItems.map((item, index) => (
                    <div key={index} className="widgetContainerItemContainer">
                        <div className="w-24 flex justify-center items-center">
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white">
                                {item.icon}
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 pt-2 justify-center">
                            <div className="widgetTitle font-bold">{item.title}</div>
                            <div className="flex justify-between">
                                <div className="widgetTitleSecondary">{item.secondaryInfo}</div>
                                <div className="widgetTitleSecondary">{item.time}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Link>
    );
}

export function RoutesWidget() {
    const position: [number, number] = [53.3498, -6.2603];

    return (
        <Link to="/routing" className="widgetContainer">
             <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%', borderRadius: "var(--cornerRadius)", zIndex: 0 }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        </Link>
    )
}