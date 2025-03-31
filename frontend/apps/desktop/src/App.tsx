import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { isAuthenticated } from "./utils/auth";

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
import WasteRoutes from "./pages/Waste_route.tsx";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsAuth(authenticated);
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>; // Show loading indicator while checking auth
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
        
export default function App() {
    const [userAuthenticated, setUserAuthenticated] = useState<Boolean>(true);
    const pageRoutesList: string[] = ["/", "/routing", "/events", "/traffic", "/waste", "/weather", "/fleetsize", "/settings", "/wasteroutes/:routeName"];
    const pageRouteItemsList: React.ReactElement[] = [<Home />, <Routing />, <Events />, <Traffic />, <Waste />, <Weather />, <FleetSize />, <Settings setUserAuthenticated={setUserAuthenticated} />, <WasteRoutes />];
    
    // Check authentication on app load
    useEffect(() => {
      const checkAuth = async () => {
        const authenticated = await isAuthenticated();
        setUserAuthenticated(authenticated);
      };

      //checkAuth();
    }, []);
    return (
        <Router>
            <div className="flex h-screen"> 
                {!userAuthenticated ? (
                    <div className="h-full w-full">  
                        <Routes> 
                            <Route path="/" element={<Login setUserAuthenticated={setUserAuthenticated} />} />
                            <Route path="/create_account" element={<CreateAccount setUserAuthenticated={setUserAuthenticated} />} />
                            {/* Redirect any other route to login */}
                            <Route path="*" element={<Navigate to="/" replace />} />
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
                                        <Route 
                                          path={route} 
                                          element={pageRouteItemsList[index]}
                                          key={index} 
                                        />
                                    );
                                })}
                              {/* Redirect to home if authenticated and accessing root */}
                              <Route path="/" element={<Navigate to="/home" replace />} />
                              {/* Catch any other routes and redirect to home */}
                              <Route path="*" element={<Navigate to="/home" replace />} />
                            </Routes>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
}