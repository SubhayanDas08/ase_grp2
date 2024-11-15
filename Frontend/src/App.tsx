import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Map from "./pages/Map.tsx";
import Server from "./pages/Server.tsx";
import Settings from "./pages/Settings.tsx";

import Sidebar from "./components/sidebar.tsx";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen">
          <div className="flex h-full w-24">
              <Sidebar />
          </div>
          <div className="h-full w-full p-5">
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/map" element={<Map />} />
                  <Route path="/server" element={<Server />} />
                  <Route path="/settings" element={<Settings />} />
              </Routes>
          </div>
      </div>
  </Router>
  )
}
