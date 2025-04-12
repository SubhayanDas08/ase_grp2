import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import Select, { SingleValue } from "react-select";

// Import Leaflet and its icon images for correct paths in production
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Override default Leaflet marker icon
L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

import FetchUserLocation from "../utils/fetchUserLocation.ts";
import UpdateMapView from "../utils/updateMapView.ts";
import LocationSearch from "../components/locationSearch.tsx";
import processTFIJourneys from "../components/processTFIJourneys.tsx";

const TRANSPORT_OPTIONS: TransportOption[] = [
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "foot", label: "Walking" },
  { value: "bus", label: "Public Transport" }
];

interface TransportOption {
  value: string;
  label: string;
}

interface GraphHopperPath {
  points: {
    coordinates: [number, number][];
  };
  distance: number;
  time: number;
}

interface locationData {
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
}

interface ProcessedStop {
  position: [number, number];
  name: string;
  time: string;
  serviceNumber: string;
  mode: string;
}

const locationNameFromCoordinates = async (lat: number, lon: number) => {
  try {
    const apiUrl = 'https://api-lts.transportforireland.ie/lts/lts/v1/public/reverseLocationLookup';

    const requestBody = {
      "coord": {
        "longitude": lon,
        "latitude": lat,
        "pixel": [
          170.55027141873433,
          440.6569131791863
        ]
      },
      "type": [
        "AIR_PORT",
        "BUS_STOP",
        "COACH_STOP",
        "FERRY_PORT",
        "TRAIN_STATION",
        "TRAM_STOP",
        "TRAM_STOP_AREA",
        "UNDERGROUND_STOP",
        "ADDRESS",
        "COORDINATE",
        "LOCALITY",
        "POINT_OF_INTEREST",
        "STREET"
      ],
      "language": "en"
    };
    
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': import.meta.env.VITE_PUBLIC_TRANSPORT_API_KEY
      }
    });
    return response.data.name;
  } catch (error) {
    console.error("Error fetching location name:", error);
  }
};

const fetchLocationDetailsFromName = async (name: string) => {
  try {
    const response = await axios.get(
      `https://api-lts.transportforireland.ie/lts/lts/v1/public/locationLookup?query=${name}&language=en`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': import.meta.env.VITE_ROUTES_SEARCH_KEY
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching location details:", error);
  }
}

// Component to fly to the new location
const FlyToLocation = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

export default function Routing() {
  const [position, setPosition] = useState<[number, number] | null>();
  const [startLocation, setStartLocation] = useState<[number, number] | null>(null);
  const [startLocationData, setStartLocationData] = useState<locationData>({
    id: "",
    name: "",
    type: "",
    lat: 0,
    lon: 0
  });
  const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
  const [endLocationData, setEndLocationData] = useState<locationData>({
    id: "",
    name: "",
    type: "",
    lat: 0,
    lon: 0
  });
  const [transportMode, setTransportMode] = useState<string>("car");
  const [routes, setRoutes] = useState<[number, number][][]>([]);
  const [selectedRoute, setSelectedRoute] = useState<[number, number][] | null>(null);
  const [distances, setDistances] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [showRoutePopup, setShowRoutePopup] = useState<boolean>(false);
  const [busStops, setBusStops] = useState<ProcessedStop[]>([]);
  const [journeyDescriptions, setJourneyDescriptions] = useState<string[]>([]);

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
            setStartLocation([lat, lon]);
            // Get the name of the current location using reverse lookup:
            const locationName = await locationNameFromCoordinates(lat, lon);
            // Call your lookup function with the name
            fetchLocationDetailsFromName(locationName).then((response) => {
              // Assuming response.data is an array of locations,
              // select the first one from the list and update state.
              if (response && response.data && response.data.length > 0) {
                const firstLocation = response.data[0];
                setStartLocationData({
                  id: firstLocation.id || "",
                  name: firstLocation.name || locationName,
                  type: firstLocation.type || "",
                  lat: firstLocation.coordinate.latitude || lat,
                  lon: firstLocation.coordinate.longitude || lon,
                });
              } else {
                console.warn("No valid location details found, using default location info");
                // Fallback: set default details using the reverse lookup name and user's coordinates.
                setStartLocationData({
                  id: "",
                  name: locationName,
                  type: "",
                  lat,
                  lon,
                });
              }
            });
          } else {
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

  const fetchRoutes = async (startLocationData: locationData, endLocationData: locationData) => {
    if (!startLocation || !endLocation) return;

    try {
      if(transportMode === "bus") {
        const apiUrl = 'https://api-lts.transportforireland.ie/lts/lts/v1/public/planJourney';
        const currentDate = new Date().toISOString();
        const requestBody = {
          "type": "LEAVE_AFTER",
          "modes": ["BUS","TRAM","RAIL"],
          "date": currentDate,
          "time": currentDate,
          "clientTimeZoneOffsetInMs": 0,
          "routeType": "FASTEST",
          "cyclePlanType": "BALANCED",
          "cycleSpeed": 20,
          "walkingSpeed": 1,
          "maxWalkTime": 30,
          "minComfortWaitTime": 5,
          "includeRealTimeUpdates": true,
          "restrictToFreeTravelPassOnly": false,
          "showNoBikesAllowedOnTrains": false,
          "includeIntermediateStops": true,
          "operator": {
            "code": "",
            "name": "journeyPlanner.options.publicTransport.operator.anyOperator"
          },
          "origin": {
            "coordinate": {
              "latitude": startLocationData.lat,
              "longitude": startLocationData.lon
            },
            "id": startLocationData.id,
            "name": startLocationData.name,
            "type": startLocationData.type
          },
          "destination": {
            "status": { "success": true },
            "name": endLocationData.name,
            "id": endLocationData.id,
            "coordinate": {
              "latitude": endLocationData.lat,
              "longitude": endLocationData.lon
            },
            "type": endLocationData.type
          },
          "via": null
        };
        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': import.meta.env.VITE_PUBLIC_TRANSPORT_API_KEY
          }
        });
        const processedData = processTFIJourneys(response.data);
        // Save the processed stops for bus markers.
        setBusStops(processedData.stops);
        // For consistency with the car/bike/foot branch, set the routes array (each bus journey’s route coordinates)
        setRoutes(processedData.routes.map(route => route.coordinates));
        // Save journey descriptions to display in the popup.
        setJourneyDescriptions(processedData.descriptions);
        setShowRoutePopup(true);
      } else {
        const url = `https://graphhopper.com/api/1/route?point=${startLocation[0]},${startLocation[1]}&point=${endLocation[0]},${endLocation[1]}&profile=${transportMode}&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${import.meta.env.VITE_GRAPHHOPPER_API_KEY}`;
        const response = await axios.get(url);
        const paths: GraphHopperPath[] = response.data.paths;

        if (paths.length > 0) {
          const allRoutes = paths.map((path) =>
            path.points.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])
          );
          const allDistances = paths.map((path) =>
            (path.distance / 1000).toFixed(2)
          );
          const allTimes = paths.map((path) =>
            (path.time / 60000).toFixed(2)
          );
          setRoutes(allRoutes);
          setDistances(allDistances);
          setTimes(allTimes);
          setShowRoutePopup(true);
          // Reset bus-specific states in case the mode was previously bus.
          setBusStops([]);
          setJourneyDescriptions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  if (!position) {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="mainHeaderHeight w-full flex items-center justify-between">
          <div className="titleText primaryColor1">Routes</div>
        </div>
        <div className="h-full w-full justify-center items-center flex titleText primaryColor1">
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mainHeaderHeight w-full flex items-center justify-between px-4">
        <div className="titleText primaryColor1">Routes</div>
      </div>

      <div className="relative h-full w-full z-0">
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
          {selectedRoute && (
            <Polyline positions={selectedRoute} color="blue" />
          )}
          {startLocation && (
            <Marker position={startLocation}>
              <FlyToLocation lat={startLocation[0]} lng={startLocation[1]} />
              <Popup>Start Location</Popup>
            </Marker>
          )}
          {endLocation && (
            <Marker position={endLocation}>
              <FlyToLocation lat={endLocation[0]} lng={endLocation[1]} />
              <Popup>End Location</Popup>
            </Marker>
          )}

          {/* Render bus stop markers when transport mode is bus */}
          {transportMode === "bus" && busStops.map((stop, index) => (
            <Marker key={`bus-stop-${index}`} position={stop.position}>
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <strong>{stop.name}</strong><br />
                  {stop.serviceNumber !== "N/A" && (
                    <>
                      <span>Service: {stop.serviceNumber}<br /></span>
                    </>
                  )}
                  {stop.time && (
                    <span>Time: {stop.time}</span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Overlay Inputs inside map */}
        <div className="absolute top-2 left-15 z-10 bg-white p-4 rounded-[var(--cornerRadius)] shadow-md w-[300px] space-y-4">
          <LocationSearch label="Start Location" onSelect={setStartLocation} setLocationData={setStartLocationData} />
          <LocationSearch label="End Location" onSelect={setEndLocation} setLocationData={setEndLocationData} />
          <Select<TransportOption>
            options={TRANSPORT_OPTIONS}
            defaultValue={TRANSPORT_OPTIONS[0]}
            onChange={(opt: SingleValue<TransportOption>) => setTransportMode(opt?.value || "car")}
          />
          <button
            className="routeSelectButton"
            onClick={() => fetchRoutes(startLocationData, endLocationData)}
          >
            Get Route
          </button>
        </div>

        {/* Route Selection Popup */}
        {showRoutePopup && (
          <div className="absolute bottom-10 left-15 z-10 bg-white p-4 rounded-[var(--cornerRadius)] shadow-md w-[300px] max-h-[300px] overflow-y-auto space-y-3">
            {transportMode === "bus" && journeyDescriptions.length > 0 ? (
              journeyDescriptions.map((desc, index) => (
                <div
                  key={index}
                  className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    // Set the corresponding route (if available) when a bus journey is selected
                    setSelectedRoute(routes[index]);
                    setShowRoutePopup(false);
                  }}
                >
                  <p><strong className="underline">Journey {index + 1}</strong></p>
                  <p>{desc}</p>
                </div>
              ))
            ) : (
              routes.map((route, index) => (
                <div
                  key={index}
                  className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedRoute(route);
                    setShowRoutePopup(false);
                  }}
                >
                  <strong className="underline">Route {index + 1}</strong><br />
                  Distance: {distances[index]} km<br />
                  Duration: {times[index]} min
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}