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
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePage = ({ navigation }) => {
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [availableWidgets, setAvailableWidgets] = useState([]);

  // Load saved widgets on component mount
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const savedWidgets = await AsyncStorage.getItem('@widgets');
        const savedAvailable = await AsyncStorage.getItem('@availableWidgets');
        
        if (savedWidgets !== null) {
          setWidgets(JSON.parse(savedWidgets));
        } else {
          // Initial setup
          const initialWidgets = [
            { id: "1", type: "weather" },
            { id: "2", type: "events" },
            { id: "3", type: "map" },
          ];
          setWidgets(initialWidgets);
          await AsyncStorage.setItem('@widgets', JSON.stringify(initialWidgets));
        }

        if (savedAvailable !== null) {
          setAvailableWidgets(JSON.parse(savedAvailable));
        } else {
          // Initial setup
          const initialAvailable = ["efficientRoutes"];
          setAvailableWidgets(initialAvailable);
          await AsyncStorage.setItem('@availableWidgets', JSON.stringify(initialAvailable));
        }
      } catch (e) {
        console.error('Failed to load widgets', e);
      }
    };

    loadWidgets();
  }, []);

  const handleMenuPress = () => {
    navigation.navigate("Menu");
  };

  const toggleEditMode = async () => {
    if (editMode) {
      // When exiting edit mode, save the current state
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

  const renderWidget = (widget, isPreview = false) => {
    const widgetContent = (type) => {
      switch (type) {
        case "weather":
          return (
            <>
              <View style={styles.widgetHeader}>
                <Ionicons name="location-sharp" size={16} color="#009688" />
                <Text style={styles.widgetTitle}>Dublin 1</Text>
                <Text style={styles.widgetTime}>2 min ago</Text>
              </View>
              <View style={styles.weatherGrid}>
                <View style={styles.weatherBox}>
                  <Feather name="cloud" size={24} color="#009688" />
                  <Text style={styles.weatherTitle}>Temperature</Text>
                  <Text style={styles.weatherValue}>6°C</Text>
                  <Text style={styles.weatherSub}>Mostly Cloudy</Text>
                  <Text style={styles.weatherSub}>H:9° L:5°</Text>
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
                  <Text style={styles.weatherValue}>88%</Text>
                  <Text style={styles.weatherSub}>Dew point: 4°C</Text>
                </View>
              </View>
            </>
          );
        case "events":
          return (
            <>
              <Text style={[styles.widgetTitle, { marginBottom: 15 }]}>Events</Text>
              <View style={styles.eventItem}>
                <Ionicons name="flash" size={20} color="#009688" />
                <View style={styles.eventTextContainer}>
                  <Text style={styles.eventTitle}>Lightning strikes in Hamilton Gardens</Text>
                  <Text style={styles.eventSubtitle}>Burning house, people crying</Text>
                </View>
                <Text style={styles.eventTime}>20 mins ago</Text>
              </View>
              <View style={styles.eventItem}>
                <Ionicons name="sunny" size={20} color="#009688" />
                <View style={styles.eventTextContainer}>
                  <Text style={styles.eventTitle}>Chain Reaction Collision</Text>
                  <Text style={styles.eventSubtitle}>Approx. 100 cars and 3 buses involved</Text>
                </View>
                <Text style={styles.eventTime}>15:45</Text>
              </View>
            </>
          );
        case "map":
          return (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 53.3498,
                longitude: -6.2603,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{ latitude: 53.3498, longitude: -6.2603 }}
                title="Dublin City Center"
              />
            </MapView>
          );
        case "efficientRoutes":
          return (
            <>
              <Text style={[styles.widgetTitle, { marginBottom: 15 }]}>Efficient Routes</Text>
              
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
              
              <TouchableOpacity style={styles.routeButton}>
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
              
              <View style={styles.mapLinkContainer}>
                <Text style={styles.mapLink}>Maps</Text>
                <Text style={styles.mapLink}>Maputo's</Text>
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
        onPress={() => navigation.navigate(widget.type === "map" ? "MapVisual" : widget.type === "efficientRoutes" ? "EfficientRoutes" : widget.type)}
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
            <Text style={styles.location}>Dublin 1</Text>
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
    position: 'absolute',
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
  mapLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  mapLink: {
    fontSize: 12,
    color: '#009688',
    textDecorationLine: 'underline',
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
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
    flex: 1,
  },
  previewTime: {
    fontSize: 10,
    color: "#777",
  },
  previewWeather: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  previewWeatherGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  previewWeatherBox: {
    width: "48%",
    alignItems: "center",
    padding: 5,
  },
  previewWeatherValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  previewEvents: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  previewEventItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  previewEventText: {
    fontSize: 12,
    marginLeft: 5,
  },
  previewMap: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  previewMapPlaceholder: {
    alignItems: "center",
  },
  previewRoutes: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  previewRouteContent: {
    marginTop: 8,
  },
  previewRouteLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  previewRouteText: {
    fontSize: 12,
    color: "#555",
  },
  previewTransportOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  previewTransportText: {
    fontSize: 12,
    color: "#555",
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