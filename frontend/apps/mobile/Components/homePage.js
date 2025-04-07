import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView from "react-native-maps";

const homePage = ({ navigation }) => {
  // Navigate to the Menu screen
  const handleMenuPress = () => {
    navigation.navigate("Menu");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Ionicons name="menu" size={28} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <Image
          source={require("../assets/icon.png")} // Replace with your avatar/profile image
          style={styles.profileIcon}
        />
      </View>

      {/* Welcome Section */}
      <Text style={styles.welcome}>Welcome Username!</Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={16} color="black" />
        <Text style={styles.location}>Dublin 1</Text>
      </View>

      {/* Weather Info Grid */}
      <View style={styles.weatherContainer}>
        <View style={styles.weatherBox}>
          <Text style={styles.weatherTitle}>Temperature</Text>
          <Text style={styles.weatherValue}>6°C</Text>
          <Text style={styles.weatherSub}>Mostly Cloudy</Text>
          <Text style={styles.weatherSub}>H: 9°C  L: 5°C</Text>
        </View>
        <View style={styles.weatherBox}>
          <Text style={styles.weatherTitle}>Precipitation</Text>
          <Text style={styles.weatherValue}>0 mm</Text>
          <Text style={styles.weatherSub}>In last 24 hours</Text>
        </View>
        <View style={styles.weatherBox}>
          <Text style={styles.weatherTitle}>UV Index</Text>
          <Text style={styles.weatherValue}>1</Text>
          <Text style={styles.weatherSub}>Low for the rest of the day.</Text>
        </View>
        <View style={styles.weatherBox}>
          <Text style={styles.weatherTitle}>Humidity</Text>
          <Text style={styles.weatherValue}>88%</Text>
          <Text style={styles.weatherSub}>The dew point is 4°C</Text>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 53.3498,
            longitude: -6.2603,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        />
      </View>

      {/* Events */}
      <View style={styles.eventsContainer}>
        <Text style={styles.eventHeader}>Events</Text>
        <View style={styles.eventBox}>
          <Ionicons name="flash" size={20} color="#009688" />
          <Text style={styles.eventText}>
            Chain Reaction Collision{"\n"}Approx. 100 cars and 3 buses involved
          </Text>
        </View>
        <View style={styles.eventBox}>
          <Ionicons name="flash" size={20} color="#009688" />
          <Text style={styles.eventText}>
            Chain Reaction Collision{"\n"}Approx. 100 cars and 3 buses involved
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009688",
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "600",
    color: "#009688",
    marginTop: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
  },
  weatherContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  weatherBox: {
    width: "48%",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  weatherTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  weatherSub: {
    fontSize: 12,
    color: "#555",
  },
  mapContainer: {
    borderRadius: 15,
    overflow: "hidden",
    height: 200,
    marginBottom: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  eventsContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 15,
  },
  eventHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  eventText: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
});

export default homePage;
