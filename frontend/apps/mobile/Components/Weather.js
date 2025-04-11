import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons"; // <-- added for menu icon
import DataConfig from "./utils/DataConfig";

const GOOGLE_API_KEY = DataConfig.GOOGLE_API_KEY;
const WEATHER_API_KEY = DataConfig.WEATHER_API_KEY; // Add your OpenWeatherMap API key here

const { height } = Dimensions.get("window");

const Weather = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 53.3498,
    longitude: -6.2603,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [weatherData, setWeatherData] = useState(null);
  const [airPollutionData, setAirPollutionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSearchLocation = async (text) => {
    setQuery(text);
    if (text.length < 3) return;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_API_KEY}&components=country:ie`
    );
    const json = await response.json();
    setPredictions(json.predictions || []);
  };

  const selectLocation = async (placeId) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
    );
    const json = await response.json();
    const location = json.result.geometry.location;

    setSelectedCoords([location.lat, location.lng]);
    setMapRegion({
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setPredictions([]);
    setQuery(json.result.name);
    setWeatherData(null);
    setAirPollutionData(null);
  };

  const fetchWeatherData = async () => {
    if (!selectedCoords) return;

    const [lat, lng] = selectedCoords;
    try {
      setLoading(true);

      // Fetch weather data
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const weatherJson = await weatherRes.json();

      // Fetch air pollution data
      const airPollutionRes = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`
      );
      const airPollutionJson = await airPollutionRes.json();

      setWeatherData(weatherJson);
      setAirPollutionData(airPollutionJson.list[0].components);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getColorForAirPollution = (value) => {
    if (value < 50) return "lightgreen";
    if (value < 100) return "yellow";
    if (value < 150) return "orange";
    if (value < 200) return "red";
    return "darkred";
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header row with menu icon */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="menu" size={28} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.header}>Weather</Text>
      </View>

      <TextInput
        value={query}
        onChangeText={onSearchLocation}
        placeholder="Search for a location"
        style={styles.input}
      />

      <FlatList
        data={predictions}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectLocation(item.place_id)}>
            <Text style={styles.suggestion}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={fetchWeatherData}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get Weather</Text>}
      </TouchableOpacity>

      {weatherData && airPollutionData && (
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherText}>
            {weatherData.name} - {weatherData.weather[0].description}
          </Text>
          <Text style={styles.weatherText}>Temp: {weatherData.main.temp}°C</Text>
          <Text style={styles.weatherText}>Humidity: {weatherData.main.humidity}%</Text>

          <Text style={styles.weatherText}>
            Air Pollution (PM2.5): {airPollutionData["pm2_5"]} µg/m³
          </Text>
          <Text style={styles.weatherText}>
            Air Quality:{" "}
            <Text style={{ color: getColorForAirPollution(airPollutionData["pm2_5"]) }}>
              {airPollutionData["pm2_5"] < 50 ? "Good" : airPollutionData["pm2_5"] < 100 ? "Fair" : "Poor"}
            </Text>
          </Text>
        </View>
      )}

      <MapView region={mapRegion} style={styles.map}>
        {selectedCoords && (
          <Marker coordinate={{ latitude: selectedCoords[0], longitude: selectedCoords[1] }} />
        )}

        {weatherData && airPollutionData && selectedCoords && (
          <Circle
            center={{
              latitude: selectedCoords[0],
              longitude: selectedCoords[1],
            }}
            radius={300}
            strokeColor={getColorForAirPollution(airPollutionData["pm2_5"])}
            fillColor={getColorForAirPollution(airPollutionData["pm2_5"])}
          />
        )}
      </MapView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff", paddingBottom: 30, marginTop: 40 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009688",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: "#f8f8f8",
  },
  suggestion: {
    padding: 10,
    backgroundColor: "#eee",
    marginVertical: 1,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#009688",
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  weatherInfo: {
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 15,
  },
  weatherText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
  map: {
    marginTop: 15,
    borderRadius: 20,
    height: height * 0.45,
    width: "100%",
  },
});

export default Weather;
