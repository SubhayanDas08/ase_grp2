import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EventDetails = ({ route, navigation }) => {
  const { event } = route.params;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#009688" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Event Type Icon */}
          <View style={styles.iconContainer}>
            <Ionicons 
              name={event.description.toLowerCase().includes("accident") ? "warning" : "calendar"} 
              size={48} 
              color={event.description.toLowerCase().includes("accident") ? "#ff3b30" : "#009688"} 
            />
          </View>

          {/* Event Name */}
          <Text style={styles.eventName}>{event.name}</Text>

          {/* Event Date & Time */}
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#555" />
            <Text style={styles.detailText}>
              {formatDate(event.event_date)} at {formatTime(event.event_time)}
            </Text>
          </View>

          {/* Event Location */}
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#555" />
            <Text style={styles.detailText}>
              {event.location}
            </Text>
          </View>

          {/* Event Area */}
          <View style={styles.detailRow}>
            <Ionicons name="map-outline" size={20} color="#555" />
            <Text style={styles.detailText}>
              {event.area}
            </Text>
          </View>

          {/* Event Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#009688",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 24,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
});

export default EventDetails; 