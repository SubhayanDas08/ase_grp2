import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import "./styles/App.css";

import CreateAccount from "./pages/CreateAccount.tsx";
import Login from "./pages/Login.tsx";
import Sidebar from "./components/sidebar.tsx";
import Home from "./pages/Home.tsx";
import Routing from "./pages/Routing.tsx";
import Events from "./pages/Events.tsx";
import Traffic from "./pages/Traffic.tsx";
import Waste from "./pages/Waste.tsx";
import Weather from "./pages/Weather.tsx";
import FleetSize from "./pages/FleetSize.tsx";
import Settings from "./pages/Settings.tsx";

export default function App() {
    const [userAuthenticated, setUserAuthenticated] = useState<Boolean>(false);
    const pageRoutesList: string[] = ["/", "/routing", "/events", "/traffic", "/waste", "/weather", "/fleetsize", "/settings"];
    const pageRouteItemsList: React.ReactElement[] = [<Home />, <Routing />, <Events />, <Traffic />, <Waste />, <Weather />, <FleetSize />, <Settings setUserAuthenticated={setUserAuthenticated} />];
    return (
        <Router>
            <div className="flex h-screen"> 
                {!userAuthenticated ? (
                    <div className="h-full w-full">  
                        <Routes> 
                            <Route path="/" element={<Login setUserAuthenticated={setUserAuthenticated} />} />
                            <Route path="/create_account" element={<CreateAccount />} />
                        </Routes> 
                    </div>
                ) : (
                    <div className="flex h-full w-full">
                        <div className="h-full w-[250px] flex-none fixed">
                            <Sidebar />
                        </div>
                        <div className="flex flex-col h-full grow ml-[250px] ps-5 pe-5 pb-5">
                            <Routes>
                                {pageRoutesList.map((route, index) => {
                                    return(
                                        <Route path={route} element={pageRouteItemsList[index]} key={index} />
                                    );
                                })}
                            </Routes>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
}