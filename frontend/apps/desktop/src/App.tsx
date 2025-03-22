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

import SettingsProfile from "./pages/SettingsProfile.tsx";
import SettingsChangePassword from "./pages/SettingsChangePassword.tsx";
import ReportAnIssue from "./pages/ReportAnIssue.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import Login from "./pages/Login.tsx";
import Sidebar from "./components/sidebar.tsx";
import Home from "./pages/Home.tsx";
import Routing from "./pages/Routing.tsx";
import Events from "./pages/Events.tsx";
import Traffic from "./pages/Traffic.tsx";
import Waste from "./pages/Waste.tsx";
import WeatherMap from "./pages/WeatherMap.tsx";
import FleetSize from "./pages/FleetSize.tsx";
import Settings from "./pages/Settings.tsx";

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
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setUserAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <div className="flex h-screen">
        {!userAuthenticated ? (
          <div className="h-full w-full">
            <Routes>
              <Route
                path="/"
                element={<Login setUserAuthenticated={setUserAuthenticated} />}
              />
              <Route
                path="/create_account"
                element={
                  <CreateAccount setUserAuthenticated={setUserAuthenticated} />
                }
              />
              {/* Redirect any other route to login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        ) : (
          <div className="flex h-full w-full">
            <div className="h-full w-[250px] flex-none fixed">
              <Sidebar />
            </div>
            <div className="h-full grow ml-[250px] p-5">
              <Routes>
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/weather"
                  element={
                    <ProtectedRoute>
                      <WeatherMap />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute>
                      <Events />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/routing"
                  element={
                    <ProtectedRoute>
                      <Routing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/traffic"
                  element={
                    <ProtectedRoute>
                      <Traffic />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/waste"
                  element={
                    <ProtectedRoute>
                      <Waste />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fleetsize"
                  element={
                    <ProtectedRoute>
                      <FleetSize />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings setUserAuthenticated={setUserAuthenticated} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/profile"
                  element={
                    <ProtectedRoute>
                      <SettingsProfile
                        setUserAuthenticated={setUserAuthenticated}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/changepassword"
                  element={
                    <ProtectedRoute>
                      <SettingsChangePassword
                        setUserAuthenticated={setUserAuthenticated}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings/report"
                  element={
                    <ProtectedRoute>
                      <ReportAnIssue
                        setUserAuthenticated={setUserAuthenticated}
                      />
                    </ProtectedRoute>
                  }
                />
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
