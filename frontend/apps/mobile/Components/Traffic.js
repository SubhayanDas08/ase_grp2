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
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import DataConfig from "./utils/DataConfig";

const GOOGLE_API_KEY = DataConfig.GOOGLE_API_KEY;
const API_URL = DataConfig.TRAFFIC_API_URL;

const { height } = Dimensions.get("window");

const monthNameToNumber = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

const monthNumberToName = Object.entries(monthNameToNumber).reduce((acc, [name, num]) => {
  acc[num] = name;
  return acc;
}, {});

const Traffic = ({ navigation }) => {
  const today = new Date();
  const defaultDate = `${today.getDate()}`;
  const defaultMonth = monthNumberToName[today.getMonth() + 1]; // getMonth() is 0-indexed

  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 53.3498,
    longitude: -6.2603,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [trafficPoint, setTrafficPoint] = useState(null);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [loading, setLoading] = useState(false);

  const getColorForIndex = (index) => {
    switch (index) {
      case 0: return "lightgreen";
      case 1: return "green";
      case 2: return "yellow";
      case 3: return "orange";
      case 4: return "red";
      default: return "gray";
    }
  };

  const getDescriptionForIndex = (index) => {
    switch (index) {
      case 0: return "Very Light Congestion";
      case 1: return "Light Congestion";
      case 2: return "Moderate Traffic";
      case 3: return "Heavy Traffic";
      case 4: return "Very Heavy Traffic";
      default: return "Unknown";
    }
  };

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
    setTrafficPoint(null);
  };

  const fetchTrafficData = async () => {
    if (!selectedCoords) return;

    const [lat, lng] = selectedCoords;
    const payload = {
      latitude: lat,
      longitude: lng,
      hour: parseInt(selectedTime.split(":")[0]),
      month: monthNameToNumber[selectedMonth],
      day: parseInt(selectedDate),
    };

    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const index = data.congestion_index?.[0] ?? 0;
      setTrafficPoint({ lat, lng, index });
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="menu" size={28} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.header}>Traffic</Text>
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

      <View style={styles.dropdownRow}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedDate}
            onValueChange={(itemValue) => setSelectedDate(itemValue)}
          >
            {[...Array(31)].map((_, i) => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
          >
            {Object.keys(monthNameToNumber).map((month) => (
              <Picker.Item key={month} label={month} value={month} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedTime}
            onValueChange={(itemValue) => setSelectedTime(itemValue)}
          >
            {[...Array(24)].map((_, h) => {
              const time = `${String(h).padStart(2, "0")}:00`;
              return <Picker.Item key={time} label={time} value={time} />;
            })}
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={fetchTrafficData}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Go</Text>}
      </TouchableOpacity>

      <MapView region={mapRegion} style={styles.map}>
        {trafficPoint && (
          <>
            <Circle
              center={{ latitude: trafficPoint.lat, longitude: trafficPoint.lng }}
              radius={300}
              strokeColor={getColorForIndex(trafficPoint.index)}
              fillColor={getColorForIndex(trafficPoint.index)}
            />
            <Marker
              coordinate={{ latitude: trafficPoint.lat, longitude: trafficPoint.lng }}
              pinColor={getColorForIndex(trafficPoint.index)}
              title={getDescriptionForIndex(trafficPoint.index)}
              description={`${selectedDate} ${selectedMonth}, 2025 @ ${selectedTime}`}
            />
          </>
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
    backgroundColor: "#007bff",
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
  map: {
    marginTop: 15,
    borderRadius: 20,
    height: height * 0.45,
    width: "100%",
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default Traffic;
