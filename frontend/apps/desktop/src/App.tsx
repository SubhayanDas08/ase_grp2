import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import Home from "./pages/Home.tsx";
import Map from "./pages/WeatherMap2.tsx";
import Events from "./pages/Events.tsx";
import Settings from "./pages/Settings.tsx";

import Sidebar from "./components/sidebar.tsx";
import "./App.css";

export default function App() {
    return (
        <Router>
            <div className="flex h-screen">
                <div className="h-full w-24 fixed">
                    <Sidebar />
                </div>
                <div className="ml-24 flex-1 overflow-y-auto p-5 ">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/map" element={<Map />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
  