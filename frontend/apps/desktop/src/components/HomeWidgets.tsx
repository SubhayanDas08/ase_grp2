import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { FiCloud, FiDroplet, FiSun, FiCloudRain, FiMapPin, FiCloudLightning, FiZap } from "react-icons/fi";

import { getWeatherDetails } from "../../../../shared/utils/weather-map/getWeatherDetails.ts";
import FetchUserLocation from "../utils/fetchUserLocation.ts";
import UpdateMapView from "../utils/updateMapView.ts";

export function WeatherWidget() {
    const [userCity, setUserCity] = useState<string>("");
    const [weatherData, setWeatherData] = useState<any>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [timeAgo, setTimeAgo] = useState<string>("Just now");

    useEffect(() => {
        const fetchData = async () => {
            const userLocationData = await FetchUserLocation();
            if (!userLocationData) return;
    
            const { lat, lon, city } = userLocationData;
            setUserCity(city);
            try {
                const data = await getWeatherDetails(lat, lon);
                console.log(data);
                setWeatherData(data);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };
    
        fetchData();
    }, []);

    // Update "x min ago" every 60 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (lastUpdated) {
                console.log("Updating time ago...");
                const now = new Date();
                const diffMs = now.getTime() - lastUpdated.getTime();
                const diffMinutes = Math.floor(diffMs / 60000);

                if (diffMinutes >= 1) {
                    setTimeAgo(`${diffMinutes} minute(s) ago`);
                }
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [lastUpdated]);

    if (!weatherData) {
        return <div className="widgetContainer justify-center items-center titleText">Loading weather...</div>;
    }

    const UVInformationText = () => {
        if (weatherData.uv <= 2) return "Low"
        else if (weatherData.uv <= 5) return "Moderate"
        else if (weatherData.uv <= 7) return "High"
        else if (weatherData.uv <= 10) return "Very High"
        else return "Extreme"
    };

    const widgetContentItems = [
        {
            title: "Temperature",
            mainInfo: `${weatherData.temp_c}°C`,
            secondaryInfo: weatherData.condition.text,
            tertiaryInfo: `Feels like ${weatherData.feelslike_c}°C`,
            icon: <FiCloud className="widgetIcons" />
        },
        {
            title: "Precipitation",
            mainInfo: `${weatherData.precip_mm} mm`,
            secondaryInfo: "In last 24 hours",
            icon: <FiDroplet className="widgetIcons" />
        },
        {
            title: "UV Index",
            mainInfo: weatherData.uv,
            secondaryInfo: `${UVInformationText()} for the rest of the day`,
            icon: <FiSun className="widgetIcons" />
        },
        {
            title: "Humidity",
            mainInfo: `${weatherData.humidity}%`,
            secondaryInfo: `The dew point is ${weatherData.dewpoint_c}°C right now`,
            icon: <FiCloudRain className="widgetIcons" />
        }
    ];

    return (
        <Link to="/weather" className="widgetContainer pb-5 ps-5 pe-5">
            <div className="flex h-[20%] justify-between items-center">
                <div className="flex items-center">
                    <FiMapPin />
                    <div className="ms-2 widgetTitle">{userCity}</div>
                </div>
                <div className="widgetTitleSecondary">{timeAgo}</div>
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
    const [position, setPosition] = useState<[number, number] | null>();

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const userLocationData = await FetchUserLocation();
                if (userLocationData) {
                    const { lat, lon } = userLocationData;
                    const isValidLat = typeof lat === "number" && lat >= -90 && lat <= 90;
                    const isValidLon = typeof lon === "number" && lon >= -180 && lon <= 180;
                    if (isValidLat && isValidLon) {
                        setPosition([lat, lon]);
                    } else {
                        console.warn("Invalid coordinates received:", lat, lon);
                        setPosition(null);
                    }
                } else {
                    setPosition(null);
                }
            } catch (error) {
                console.error("Failed to fetch location:", error);
                setPosition(null);
            }
        };

        fetchLocation();
    }, []);

    if (!position) {
        return (
            <div className="widgetContainer justify-center items-center titleText">
                Loading map...
            </div>
        );
    }

    return (
        <Link to="/routing" className="widgetContainer">
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: "100%", width: "100%", borderRadius: "var(--cornerRadius)", zIndex: 0 }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <UpdateMapView position={position} />
            </MapContainer>
        </Link>
    );
}
