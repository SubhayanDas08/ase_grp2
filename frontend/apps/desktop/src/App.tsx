import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Map from "./pages/Map.tsx";
import Events from "./pages/Events.tsx";
import Settings from "./pages/Settings.tsx";
import Login from "./pages/Login.tsx";

import Sidebar from "./components/sidebar.tsx";
import "./App.css";

export default function App() {
    return (
        <Router>
            <div className="flex h-screen"> 
                {/*}
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
                */}
                <div className="h-full w-full">  
                    <Routes> 
                        <Route path="/" element={<Login />} />
                    </Routes> 
                </div>

            </div>
        </Router>
    );
}
  