import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "leaflet/dist/leaflet.css";
import "./styles/App.css";

import CreateAccount from "./pages/CreateAccount.tsx";
import Login from "./pages/Login.tsx";
import Sidebar from "./components/sidebar.tsx";
import Home from "./pages/Home.tsx";
import Routing from "./pages/Routing.tsx";
import Events from "./pages/Events.tsx";
import AddEvent from "./pages/AddEvent.tsx";
import ViewEvent from "./pages/ViewEvent.tsx";
import Traffic from "./pages/Traffic.tsx";
import Waste from "./pages/Waste.tsx";
import Weather from "./pages/Weather.tsx";
import FleetSize from "./pages/FleetSize.tsx";
import Settings from "./pages/Settings.tsx";
import SettingsProfile from "./pages/SettingsProfile.tsx";
import SettingsChangePassword from "./pages/SettingsChangePassword.tsx";
import ReportAnIssue from "./pages/ReportAnIssue.tsx";
import { useAuth } from "./utils/useAuth.ts";
import About from "./pages/About.tsx";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking auth
  }

  if (!userAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const {
    userAuthenticated,
    permissions,
    loading,
    logout,
    setUserAuthenticated,
  } = useAuth();

  const pageRoutesList: {
    path: string;
    component: React.ReactElement;
    permission: string;
  }[] = [
    { path: "/home", component: <Home />, permission: "" },
    {
      path: "/routing",
      component: <Routing />,
      permission: "view_efficient_routes",
    },
    {
      path: "/events",
      component: <Events permissions={permissions} />,
      permission: "view_events",
    },
    {
      path: "/events/add",
      component: <AddEvent />,
      permission: "manage_events",
    },
    {
      path: "/events/view/:id",
      component: <ViewEvent permissions={permissions} />,
      permission: "view_events",
    },
    {
      path: "/traffic",
      component: <Traffic />,
      permission: "monitor_transport_congestion",
    },
    {
      path: "/waste",
      component: <Waste />,
      permission: "get_trash_pickup_recommendation",
    },
    {
      path: "/weather",
      component: <Weather />,
      permission: "view_weather_AQI",
    },
    {
      path: "/fleetsize",
      component: <FleetSize />,
      permission: "get_fleet_size_recommendation",
    },
    {
      path: "/settings",
      component: (
        <Settings
          setUserAuthenticated={setUserAuthenticated}
          onLogout={logout}
        />
      ),
      permission: "",
    },
    {
      path: "/settings/profile",
      component: (
        <SettingsProfile setUserAuthenticated={setUserAuthenticated} />
      ),
      permission: "",
    },
    {
      path: "/settings/changepassword",
      component: (
        <SettingsChangePassword setUserAuthenticated={setUserAuthenticated} />
      ),
      permission: "",
    },
    {
      path: "/settings/report",
      component: <ReportAnIssue setUserAuthenticated={setUserAuthenticated} />,
      permission: "",
    },
    {
      path: "/settings/about",
      component: <About setUserAuthenticated={setUserAuthenticated} />,
      permission: "",
    }
  ];

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking auth
  }
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
              <Sidebar permissions={permissions} />
            </div>
            <div className="flex flex-col h-full grow ml-[250px] ps-5 pe-5 pb-5">
              <Routes>
                {pageRoutesList.map((route, index) => {
                  if (
                    !route.permission ||
                    permissions.includes(route.permission)
                  ) {
                    return (
                      <Route
                        path={route.path}
                        element={
                          <ProtectedRoute>{route.component}</ProtectedRoute>
                        }
                        key={index}
                      />
                    );
                  }
                  return null;
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
