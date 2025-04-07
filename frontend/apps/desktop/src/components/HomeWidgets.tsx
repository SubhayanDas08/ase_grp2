import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { FiCloud, FiDroplet, FiSun, FiCloudRain, FiMapPin } from "react-icons/fi";
import { FaBolt } from "react-icons/fa";

import { getWeatherDetails } from "../../../../shared/utils/weather-map/getWeatherDetails.ts";
import FetchUserLocation from "../utils/fetchUserLocation.ts";
import UpdateMapView from "../utils/updateMapView.ts";
import { authenticatedGet } from "../utils/auth.ts";

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
    interface Event {
        id: string;
        name: string;
        event_time:string;
        event_date: string;
        location: string;
    }
    
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
              const data = await authenticatedGet<Event[]>("/events/");
              setEvents(data);
            } catch (error) {
              console.error("Error fetching events:", error);
            } finally {
              setLoading(false);
            }
          };
      
          fetchEvents();
        }, []);

        const widgetContentItems = events.map((event) => ({
            title: event.name,
            secondaryInfo: event.location,
            time: `${new Date(event.event_date).toLocaleDateString()} ${event.event_time.slice(0, 5)}`,
            icon: <FaBolt className="widgetIcons"/>,
          }));
    
      if (loading) return <p>Loading events...</p>;
    
      return (
        <Link to="/events" className="widgetContainer pb-5 ps-5 pe-5">
          <div className="flex h-[20%] justify-between items-center">
            <div className="flex items-center">
              <div className="ms-2 widgetTitle">Events</div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 h-[80%] overflow-y-auto pr-2">
            {loading ? (
              <div className="widgetTitleSecondary">Loading...</div>
            ) : widgetContentItems.length === 0 ? (
              <div className="widgetTitleSecondary">No upcoming events</div>
            ) : (
              widgetContentItems.map((item, index) => (
                <div key={index} className="widgetContainerItemContainer h-22">
                  <div className="w-24 flex justify-center items-center">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white"
                    >
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 justify-center">
                    <div className="widgetTitle font-bold">{item.title}</div>
                    <div className="flex justify-between">
                      <div className="widgetTitleSecondary ">{item.secondaryInfo.length > 20
                        ? item.secondaryInfo.slice(0, 45) + "..."
                        : item.secondaryInfo}</div>
                      <div className="widgetTitleSecondary font-semibold">{item.time}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
