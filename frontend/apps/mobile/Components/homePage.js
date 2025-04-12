import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import DataConfig from "./utils/DataConfig";

const HomePage = ({ navigation }) => {
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [availableWidgets, setAvailableWidgets] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("Loading location...");
  const [weather, setWeather] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const OPENWEATHER_API_KEY = DataConfig.WEATHER_API_KEY;

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (response.length > 0) {
        const { city, district, subregion } = response[0];
        return district || city || subregion || "Current Location";
      }
      return "Current Location";
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return "Current Location";
    }
  };

  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const savedWidgets = await AsyncStorage.getItem('@widgets');
        const savedAvailable = await AsyncStorage.getItem('@availableWidgets');
        
        if (savedWidgets !== null) {
          setWidgets(JSON.parse(savedWidgets));
        } else {
          const initialWidgets = [
            { id: "1", type: "weather" },
            { id: "2", type: "events" },
          ];
          setWidgets(initialWidgets);
          await AsyncStorage.setItem('@widgets', JSON.stringify(initialWidgets));
        }

        if (savedAvailable !== null) {
          setAvailableWidgets(JSON.parse(savedAvailable));
        } else {
          const initialAvailable = ["efficientRoutes"];
          setAvailableWidgets(initialAvailable);
          await AsyncStorage.setItem('@availableWidgets', JSON.stringify(initialAvailable));
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          setLocationName("Location permission denied");
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
        const name = await reverseGeocode(coords.latitude, coords.longitude);
        setLocationName(name);
        fetchWeather(coords.latitude, coords.longitude);

      } catch (e) {
        console.error('Failed to load widgets or get location/weather', e);
        setLocationName("Error getting location");
      }
    };

    loadWidgets();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await axios.get("https://city-management.walter-wm.de/events/");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchWeather = async (latitude, longitude) => {
    try {
      setLoadingWeather(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleMenuPress = () => {
    navigation.navigate("Menu");
  };

  const toggleEditMode = async () => {
    if (editMode) {
      try {
        await AsyncStorage.setItem('@widgets', JSON.stringify(widgets));
        await AsyncStorage.setItem('@availableWidgets', JSON.stringify(availableWidgets));
      } catch (e) {
        console.error('Failed to save widgets', e);
      }
      setShowAddWidget(false);
    }
    setEditMode(!editMode);
  };

  const refreshLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      const name = await reverseGeocode(coords.latitude, coords.longitude);
      setLocationName(name);
      fetchWeather(coords.latitude, coords.longitude);
    } catch (error) {
      console.error("Error refreshing location:", error);
    }
  };

  const handleAddWidget = async (type) => {
    const newWidgets = [...widgets, { id: Date.now().toString(), type }];
    const newAvailable = availableWidgets.filter((t) => t !== type);
    
    setWidgets(newWidgets);
    setAvailableWidgets(newAvailable);
    setShowAddWidget(false);
    
    try {
      await AsyncStorage.setItem('@widgets', JSON.stringify(newWidgets));
      await AsyncStorage.setItem('@availableWidgets', JSON.stringify(newAvailable));
    } catch (e) {
      console.error('Failed to save widgets', e);
    }
  };

  const removeWidget = async (id, type) => {
    const newWidgets = widgets.filter((widget) => widget.id !== id);
    const newAvailable = [...availableWidgets, type];
    
    setWidgets(newWidgets);
    setAvailableWidgets(newAvailable);
    
    try {
      await AsyncStorage.setItem('@widgets', JSON.stringify(newWidgets));
      await AsyncStorage.setItem('@availableWidgets', JSON.stringify(newAvailable));
    } catch (e) {
      console.error('Failed to save widgets', e);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString.split(":").slice(0, 2).join(":");
  };

  const renderWidget = (widget, isPreview = false) => {
    const widgetContent = (type) => {
      switch (type) {
        case "weather":
          if (loadingWeather || !weather) {
            return (
              <View style={styles.weatherLoading}>
                <ActivityIndicator size="small" color="#009688" />
                <Text style={styles.loadingText}>Loading weather data...</Text>
              </View>
            );
          }
          const temperature = weather.main.temp;
          const weatherDescription = weather.weather[0].description;
          const humidity = weather.main.humidity;
          const highTemp = weather.main.temp_max;
          const lowTemp = weather.main.temp_min;
  
          return (
            <>
              <View style={styles.widgetHeader}>
                <Ionicons style={styles.locicon} name="location-sharp" size={16} color="#009688" />
                <Text style={styles.widgetTitle}>{locationName}</Text>
                <Text style={styles.widgetTime}>Updated just now</Text>
              </View>
              <View style={styles.weatherGrid}>
                <View style={styles.weatherBox}>
                  <Feather name="cloud" size={24} color="#009688" />
                  <Text style={styles.weatherTitle}>Temperature</Text>
                  <Text style={styles.weatherValue}>{temperature}°C</Text>
                  <Text style={styles.weatherSub}>{weatherDescription}</Text>
                  <Text style={styles.weatherSub}>H:{highTemp}° L:{lowTemp}°</Text>
                </View>
                <View style={styles.weatherBox}>
                  <FontAwesome name="tint" size={24} color="#009688" />
                  <Text style={styles.weatherTitle}>Precipitation</Text>
                  <Text style={styles.weatherValue}>0 mm</Text>
                  <Text style={styles.weatherSub}>In last 24 hours</Text>
                </View>
                <View style={styles.weatherBox}>
                  <Ionicons name="sunny" size={24} color="#009688" />
                  <Text style={styles.weatherTitle}>UV Index</Text>
                  <Text style={styles.weatherValue}>1</Text>
                  <Text style={styles.weatherSub}>Low for the day</Text>
                </View>
                <View style={styles.weatherBox}>
                  <Ionicons name="rainy" size={24} color="#009688" />
                  <Text style={styles.weatherTitle}>Humidity</Text>
                  <Text style={styles.weatherValue}>{humidity}%</Text>
                  <Text style={styles.weatherSub}>Dew point: 4°C</Text>
                </View>
              </View>
            </>
          );
        case "events":
          if (loadingEvents) {
            return (
              <View style={styles.eventsLoading}>
                <ActivityIndicator size="small" color="#009688" />
                <Text style={styles.loadingText}>Loading events...</Text>
              </View>
            );
          }
          return (
            <>
              <Text style={[styles.widgetTitle, { marginBottom: 15, marginLeft: 20 }]}>Recent Events</Text>
              {events.slice(0, 2).map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <Ionicons 
                    name={event.description.toLowerCase().includes("accident") ? "warning" : "calendar"} 
                    size={20} 
                    color={event.description.toLowerCase().includes("accident") ? "#ff3b30" : "#009688"} 
                  />
                  <View style={styles.eventTextContainer}>
                    <Text style={styles.eventTitle}>{event.name}</Text>
                    <Text style={styles.eventSubtitle}>{event.description}</Text>
                  </View>
                  <Text style={styles.eventTime}>{formatTime(event.event_time)}</Text>
                </View>
              ))}
              {events.length > 2 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => navigation.navigate("Events")}
                >
                  <Text style={styles.viewAllText}>View All Events</Text>
                </TouchableOpacity>
              )}
            </>
          );
        case "efficientRoutes":
          return (
            <>
              <Text style={[styles.widgetTitle, { marginBottom: 15, marginLeft:18 }]}>Efficient Routes</Text>
              <View style={styles.routeSection}>
                <Text style={styles.routeHeader}>Start Location</Text>
                <Text style={styles.routeSubheader}>End Location</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transportOptions}>
                <Text style={styles.transportOption}>Car</Text>
                <Text style={styles.transportOption}>Bike</Text>
                <Text style={styles.transportOption}>Walking</Text>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity 
                style={styles.routeButton}
                onPress={() => navigation.navigate("EfficientRoutes")}
              >
                <Text style={styles.routeButtonText}>Get Route</Text>
              </TouchableOpacity>
              <View style={styles.locationsContainer}>
                <Text style={styles.locationTag}>DIGUNCOROSA</Text>
                <Text style={styles.locationTag}>NORTHSIDE</Text>
                <Text style={styles.locationTag}>Dublin</Text>
                <Text style={styles.locationTag}>St James's Hodges</Text>
                <Text style={styles.locationTag}>SOUTH GERGIAN CORE</Text>
                <Text style={styles.locationTag}>BALLSBRIDGE</Text>
              </View>
            </>
          );
        default:
          return null;
      }
    };
  
    if (isPreview) {
      return (
        <View style={styles.widgetContainer}>
          {widgetContent(widget.type)}
        </View>
      );
    }
  
    return (
      <TouchableOpacity
        onPress={() => {
          if (widget.type === "weather") {
            navigation.navigate("Weather", { weatherData: weather });
          } else if (widget.type === "efficientRoutes") {
            navigation.navigate("EfficientRoutes");
          } else if (widget.type === "events") {
            navigation.navigate("Events");
          }
        }}
        activeOpacity={0.8}
      >
        <View style={styles.widgetContainer}>
          {editMode && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={(e) => {
                e.stopPropagation();
                removeWidget(widget.id, widget.type);
              }}
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          )}
          {widgetContent(widget.type)}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Ionicons name="menu" size={28} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleEditMode}>
            <Text style={styles.editButton}>
              {editMode ? "Done" : "Edit"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={refreshLocation} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#009688" />
          </TouchableOpacity>
          <Image
            source={require("../assets/icon.png")}
            style={styles.profileIcon}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcome}>Welcome!</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color="#009688" />
            <Text style={styles.location}>{locationName}</Text>
          </View>
        </View>

        {/* Widgets */}
        {widgets.map((widget) => (
          <View key={widget.id} style={styles.widgetWrapper}>
            {renderWidget(widget)}
          </View>
        ))}

        {/* Add Widget Button */}
        {editMode && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddWidget(true)}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Widget</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Add Widget Modal */}
      <Modal
        visible={showAddWidget}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddWidget(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Widgets</Text>
              <TouchableOpacity onPress={() => setShowAddWidget(false)}>
                <Ionicons name="close" size={24} color="#009688" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {availableWidgets.map((type) => (
                <Pressable
                  key={type}
                  style={styles.widgetOption}
                  onPress={() => handleAddWidget(type)}
                >
                  <View style={styles.widgetPreview}>
                    {renderWidget({ type, id: 'preview' }, true)}
                  </View>
                  <View style={styles.addWidgetButton}>
                    <Ionicons name="add" size={20} color="#009688" />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get("window");
const widgetWidth = width - 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  locicon:{
    marginLeft:14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#009688",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    color: "#009688",
    fontWeight: "600",
    marginRight: 15,
  },
  refreshButton: {
    marginRight: 15,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  content: {
    padding: 20,
  },
  welcomeContainer: {
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "600",
    color: "#009688",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: "#555",
  },
  widgetWrapper: {
    marginBottom: 20,
  },
  widgetContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  removeButton: {
    position: 'relative',
    top: 10,
    right: 10,
    backgroundColor: "#009688",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  widgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    flex: 1,
  },
  widgetTime: {
    fontSize: 12,
    color: "#777",
  },
  weatherGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  weatherBox: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  weatherTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 4,
    color: "#555",
  },
  weatherValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 5,
  },
  weatherSub: {
    fontSize: 10,
    color: "#777",
    textAlign: "center",
  },
  weatherLoading: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  eventsLoading: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#009688",
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  eventTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  eventSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  eventTime: {
    fontSize: 10,
    color: "#999",
    marginLeft: 10,
  },
  viewAllButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  viewAllText: {
    color: "#009688",
    fontWeight: "bold",
    fontSize: 12,
  },
  routeSection: {
    marginBottom: 10,
  },
  routeHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#009688',
  },
  routeSubheader: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  transportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transportOption: {
    fontSize: 14,
    color: '#555',
  },
  routeButton: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  routeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  locationsContainer: {
    marginTop: 10,
  },
  locationTag: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#009688",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
  },
  widgetOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  widgetPreview: {
    flex: 1,
  },
  addWidgetButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0f2f1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default HomePage;