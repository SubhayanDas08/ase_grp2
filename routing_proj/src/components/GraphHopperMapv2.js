import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import Select from 'react-select';
import "leaflet/dist/leaflet.css";
import LocationSearch from './LocationSearch';
import './GraphHopperMap.css';
import tollData from './tollData.json';

// Custom Markers
const redMarker = new L.Icon({
  iconUrl: "/markers/red-marker.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const greenMarker = new L.Icon({
  iconUrl: "/markers/destination.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const tollMarker = new L.Icon({
  iconUrl: "/markers/toll-marker.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const GraphHopperMap = () => {
  const [routes, setRoutes] = useState([]);
  const [distances, setDistances] = useState([]);
  const [times, setTimes] = useState([]);
  const [tollCosts, setTollCosts] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [transportMode, setTransportMode] = useState('car');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const routeColors = ['#0000FF', '#FF0000', '#00FF00'];

  const transportOptions = [
    { value: 'car', label: 'Car' },
    { value: 'bike', label: 'Bike' },
    { value: 'foot', label: 'Walking' },
    { value: 'bus', label: 'Bus' },
    { value: 'luas', label: 'Luas' },
    { value: 'busandluas', label: 'Bus & Luas' }
  ];

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    const fetchDefaultLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoords = [position.coords.latitude, position.coords.longitude];
              setUserLocation(userCoords);
              setStartLocation(userCoords);
            },
            (error) => {
              console.error("Geolocation error:", error);
              setUserLocation([53.3498, -6.2603]); // Dublin center
              setStartLocation([53.3498, -6.2603]);
            }
          );
        }
      } catch (error) {
        console.error("Location fetch error:", error);
        setUserLocation([53.3498, -6.2603]);
        setStartLocation([53.3498, -6.2603]);
      }
    };

    fetchDefaultLocation();
  }, []);

  const fetchPublicTransportRoutes = async (startLoc, endLoc) => {
    const apiUrl = 'https://api-lts.transportforireland.ie/lts/lts/v1/public/planJourney';
    const currentDate = new Date().toISOString();
    
    const requestBody = {
      type: "LEAVE_AFTER",
      modes: transportMode === 'bus' ? ["BUS"] : 
            transportMode === 'luas' ? ["TRAM"] : 
            ["BUS", "TRAM"],
      date: currentDate,
      time: currentDate,
      clientTimeZoneOffsetInMs: 0,
      routeType: "FASTEST",
      walkingSpeed: 1,
      maxWalkTime: 30,
      minComfortWaitTime: 5,
      includeRealTimeUpdates: true,
      includeIntermediateStops: true,
      origin: {
        coordinate: {
          longitude: startLoc[1],
          latitude: startLoc[0]
        },
        type: "STREET"
      },
      destination: {
        coordinate: {
          longitude: endLoc[1],
          latitude: endLoc[0]
        },
        type: "STREET"
      }
    };

    try {
      console.log('Fetching public transport routes:', requestBody);
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': '630688984d38409689932a37a8641bb9'
        }
      });
      console.log('Public transport response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching public transport routes:', error);
      throw error;
    }
  };

  const fetchRoutes = async (mode) => {
    if (!startLocation || !endLocation) {
      alert("Please select both start and destination locations.");
      return;
    }

    setLoading(true);
    try {
      if (mode === 'bus' || mode === 'luas' || mode === 'busandluas') {
        const response = await fetchPublicTransportRoutes(startLocation, endLocation);
        
        if (response && response.length > 0) {
          const processedRoutes = response.slice(0, 3).map(journey => {
            const durationMatch = journey.duration.match(/PT(\d+)M/);
            const duration = durationMatch ? durationMatch[1] : "0";

            const coordinates = [];
            journey.legs.forEach(leg => {
              if (leg.path?.points) {
                const decodedPoints = leg.path.points
                  .split(' ')
                  .map(point => {
                    const [lat, lng] = point.split(',').map(Number);
                    return [lat, lng];
                  });
                coordinates.push(...decodedPoints);
              } else if (leg.origin?.coordinate && leg.destination?.coordinate) {
                coordinates.push(
                  [leg.origin.coordinate.latitude, leg.origin.coordinate.longitude],
                  [leg.destination.coordinate.latitude, leg.destination.coordinate.longitude]
                );
              }
            });

            // Remove duplicate consecutive coordinates
            const uniqueCoordinates = coordinates.filter((coord, index) => {
              if (index === 0) return true;
              return !(coord[0] === coordinates[index - 1][0] && coord[1] === coordinates[index - 1][1]);
            });

            let totalDistance = 0;
            for (let i = 1; i < uniqueCoordinates.length; i++) {
              totalDistance += haversineDistance(
                uniqueCoordinates[i-1][0],
                uniqueCoordinates[i-1][1],
                uniqueCoordinates[i][0],
                uniqueCoordinates[i][1]
              );
            }

            return {
              route: uniqueCoordinates,
              duration: duration,
              distance: totalDistance,
              legs: journey.legs.map(leg => ({
                mode: leg.mode,
                serviceNumber: leg.serviceNumber || '',
                operator: leg.operator?.name || ''
              }))
            };
          });

          const validRoutes = processedRoutes.filter(route => route.route.length > 1);

          if (validRoutes.length > 0) {
            setRoutes(validRoutes.map(r => r.route));
            setDistances(validRoutes.map(r => r.distance.toFixed(2)));
            setTimes(validRoutes.map(r => r.duration));
            setTollCosts([]);
          } else {
            throw new Error("No valid routes found with coordinates");
          }
        } else {
          throw new Error("No routes returned from the API");
        }
      } else {
        // Handle car, bike, and walking routes with GraphHopper
        const apiKey = process.env.REACT_APP_GRAPHHOPPER_API_KEY;
        const url = `https://graphhopper.com/api/1/route?point=${startLocation[0]},${startLocation[1]}&point=${endLocation[0]},${endLocation[1]}&profile=${mode}&locale=en&calc_points=true&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${apiKey}`;
        
        const response = await axios.get(url);
        
        if (response.data.paths) {
          const paths = response.data.paths;
          setRoutes(paths.map(path => path.points.coordinates.map(([lng, lat]) => [lat, lng])));
          setDistances(paths.map(path => (path.distance / 1000).toFixed(2)));
          setTimes(paths.map(path => Math.round(path.time / 60000)));

          if (mode === 'car') {
            const newTollCosts = paths.map(path => {
              let cost = 0;
              const coords = path.points.coordinates;
              const tollsFound = new Set();

              coords.forEach(([lng, lat]) => {
                tollData.forEach(toll => {
                  if (haversineDistance(lat, lng, toll.Latitude, toll.Longitude) < 0.5) {
                    tollsFound.add(toll["Toll Name"]);
                    cost += parseFloat(toll["Toll Price"]);
                  }
                });
              });

              return { cost: cost.toFixed(2), tolls: Array.from(tollsFound) };
            });
            setTollCosts(newTollCosts);
          } else {
            setTollCosts([]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
      alert(error.message || `Error fetching ${mode} routes. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-container">
      <div className="controls">
        <Select
          options={transportOptions}
          value={transportOptions.find(option => option.value === transportMode)}
          onChange={(selected) => setTransportMode(selected.value)}
          className="transport-select"
        />
        <LocationSearch
          onSelect={setStartLocation}
          label="Start"
          defaultLocation={userLocation}
        />
        <LocationSearch
          onSelect={setEndLocation}
          label="Destination"
        />
        <button 
          onClick={() => fetchRoutes(transportMode)}
          disabled={loading || !startLocation || !endLocation}
          className="route-button"
        >
          {loading ? 'Loading...' : 'Get Routes'}
        </button>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={startLocation || userLocation || [53.3498, -6.2603]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {startLocation && (
            <Marker position={startLocation} icon={redMarker}>
              <Popup>Start Location</Popup>
            </Marker>
          )}
          
          {endLocation && (
            <Marker position={endLocation} icon={greenMarker}>
              <Popup>Destination</Popup>
            </Marker>
          )}
          
          {transportMode === 'car' && tollData.map((toll, index) => (
            <Marker
              key={index}
              position={[toll.Latitude, toll.Longitude]}
              icon={tollMarker}
            >
              <Popup>{toll["Toll Name"]} - €{toll["Toll Price"]}</Popup>
            </Marker>
          ))}
          
          {routes.map((route, index) => (
            <Polyline
              key={index}
              positions={route}
              color={routeColors[index % routeColors.length]}
              weight={4}
            >
              <Popup>
                Distance: {distances[index]} km<br />
                Time: {times[index]} minutes
                {transportMode === 'car' && tollCosts[index]?.cost > 0 && (
                  <><br />Tolls: €{tollCosts[index].cost}</>
                )}
              </Popup>
            </Polyline>
          ))}
        </MapContainer>

        <div className="route-info">
          {routes.map((_, index) => (
            <div key={index} className="route-item">
              <span style={{ color: routeColors[index % routeColors.length], fontWeight: 'bold' }}>
                Route {index + 1}:
              </span>
              <br />
              Distance: {distances[index]} km
              <br />
              Time: {times[index]} min
              {transportMode === 'car' && tollCosts[index]?.cost > 0 && (
                <><br />Tolls: €{tollCosts[index].cost}</>
              )}
              {(transportMode === 'bus' || transportMode === 'luas' || transportMode === 'busandluas') && (
                <div className="transport-details">
                  Transport: {routes[index]?.legs?.map(leg => 
                    `${leg.mode}${leg.serviceNumber ? ` ${leg.serviceNumber}` : ''}`
                  ).join(' → ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphHopperMap;