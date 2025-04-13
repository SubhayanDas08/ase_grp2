import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import DataConfig from "./utils/DataConfig";

const { height } = Dimensions.get("window");

const transportOptions = [
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "foot", label: "Walking" },
];

const TFI_API_KEY = DataConfig.TFI_API_KEY;
const GRAPHHOPPER_API_KEY = DataConfig.GRAPHHOPPER_API_KEY;

const EfficientRoutes = ({ navigation }) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [selectedMode, setSelectedMode] = useState("car");
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);

  const fetchSuggestions = async (text, isStart) => {
    if (text.length < 3) return;
    try {
      const response = await axios.get(
        `https://api-lts.transportforireland.ie/lts/lts/v1/public/locationLookup?query=${text}&language=en`,
        {
          headers: { "Ocp-Apim-Subscription-Key": TFI_API_KEY },
        }
      );
      const suggestions = response.data || [];
      isStart ? setStartSuggestions(suggestions) : setEndSuggestions(suggestions);
    } catch (err) {
      console.error("Autocomplete Error:", err);
    }
  };

  const handleSelectSuggestion = (item, isStart) => {
    const coords = [item.coordinate.latitude, item.coordinate.longitude];
    if (isStart) {
      setStartCoords(coords);
      setStartInput(item.name);
      setStartSuggestions([]);
    } else {
      setEndCoords(coords);
      setEndInput(item.name);
      setEndSuggestions([]);
    }
  };

  const fetchRoutes = async () => {
    if (!startCoords || !endCoords) return;
    setLoading(true);
    try {
      const url = `https://graphhopper.com/api/1/route?point=${startCoords[0]},${startCoords[1]}&point=${endCoords[0]},${endCoords[1]}&profile=${selectedMode}&locale=en&points_encoded=false&algorithm=alternative_route&alternative_route_max_paths=3&key=${GRAPHHOPPER_API_KEY}`;
      const response = await axios.get(url);
      const paths = response.data.paths;

      const formattedRoutes = paths.map((path) =>
        path.points.coordinates.map(([lng, lat]) => [lat, lng]
      ))
      setRoutes(formattedRoutes);
      setSelectedRouteIndex(0);
    } catch (error) {
      console.error("Routing Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with hamburger */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="menu" size={28} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Efficient Routes</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          value={startInput}
          onChangeText={(text) => {
            setStartInput(text);
            fetchSuggestions(text, true);
          }}
          placeholder="Start Location"
          style={styles.input}
        />
        {startSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={startSuggestions}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestion}
                  onPress={() => handleSelectSuggestion(item, true)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          </View>
        )}

        <TextInput
          value={endInput}
          onChangeText={(text) => {
            setEndInput(text);
            fetchSuggestions(text, false);
          }}
          placeholder="End Location"
          style={styles.input}
        />
        {endSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={endSuggestions}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestion}
                  onPress={() => handleSelectSuggestion(item, false)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          </View>
        )}

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMode}
            onValueChange={(itemValue) => setSelectedMode(itemValue)}
          >
            {transportOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={fetchRoutes}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Get Route</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Map Section */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          region={{
            latitude: startCoords?.[0] || 53.3498,
            longitude: startCoords?.[1] || -6.2603,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {startCoords && (
            <Marker
              coordinate={{
                latitude: startCoords[0],
                longitude: startCoords[1],
              }}
              title="Start"
              pinColor="green"
            />
          )}
          {endCoords && (
            <Marker
              coordinate={{
                latitude: endCoords[0],
                longitude: endCoords[1],
              }}
              title="End"
              pinColor="red"
            />
          )}
          {routes[selectedRouteIndex] && (
            <Polyline
              coordinates={routes[selectedRouteIndex].map(([lat, lng]) => ({
                latitude: lat,
                longitude: lng,
              }))}
              strokeColor="blue"
              strokeWidth={4}
            />
          )}
        </MapView>

        {/* Route Overlay on top of Map */}
        {routes.length > 0 && (
          <View style={styles.routeOverlay}>
            <FlatList
              horizontal
              data={routes}
              keyExtractor={(_, idx) => `route-${idx}`}
              renderItem={({ _, index }) => (
                <TouchableOpacity
                  onPress={() => setSelectedRouteIndex(index)}
                  style={[
                    styles.routeBtn,
                    selectedRouteIndex === index && styles.activeRouteBtn,
                  ]}
                >
                  <Text
                    style={[
                      styles.routeBtnText,
                      selectedRouteIndex === index && styles.activeRouteBtnText,
                    ]}
                  >
                    Route {index + 1}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.routeListContent}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff", 
    paddingTop: 40 
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#009688",
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: "#f8f8f8",
    marginBottom: 6,
  },
  suggestionsContainer: {
    maxHeight: 150,
    marginBottom: 10,
  },
  suggestionsList: {
    flexGrow: 0,
  },
  suggestion: {
    padding: 10,
    backgroundColor: "#eee",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#009688",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  mapWrapper: {
    width: "100%",
    height: height * 0.45,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  routeOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  routeListContent: {
    paddingRight: 10,
  },
  routeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  activeRouteBtn: {
    backgroundColor: "#009688",
  },
  routeBtnText: {
    fontWeight: "600",
    color: "#333",
  },
  activeRouteBtnText: {
    color: "white",
  },
});

export default EfficientRoutes;