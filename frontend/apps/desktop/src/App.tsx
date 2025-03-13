import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import Home from "./pages/Home.tsx";
import WeatherMap from "./pages/WeatherMap.tsx";
import Events from "./pages/Events2.tsx";
import Settings from "./pages/Settings.tsx";
import Login from "./pages/Login.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import Routing from "./pages/Routing.tsx";

import Sidebar from "./components/sidebar.tsx";
import "./App.css";
import { useState } from "react";

export default function App() {
    const [userAuthenticated, setUserAuthenticated] = useState<Boolean>(true);
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
                    <>
                        {/* <div className="h-full w-[185px] fixed overflow-y-auto">
                            <Sidebar />
                        </div> */}
                        <div className="ml-24 flex-1 overflow-y-auto p-5 ">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/weather" element={<WeatherMap />} />
                                <Route path="/events" element={<Events />} />
                                <Route path="/routing" element={<Routing />} />
                                <Route path="/settings" element={<Settings setUserAuthenticated={setUserAuthenticated} />} />
                                
                            </Routes>
                        </div>
                    </>
                )}
            </div>
        </Router>
    );
}
  