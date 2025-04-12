import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const Events = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://city-management.walter-wm.de/events/");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      Alert.alert("Error", "Failed to fetch events");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
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

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate("EventDetails", { event: item })}
    >
      <View style={styles.cardLeft}>
        <Ionicons 
          name={item.description.toLowerCase().includes("accident") ? "warning" : "calendar"} 
          size={24} 
          color={item.description.toLowerCase().includes("accident") ? "#ff3b30" : "#009688"} 
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="location" size={14} color="#555" />
          <Text style={styles.cardMetaText}>
            {item.area} • {item.location.split(",")[0]}
          </Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardDate}>{formatDate(item.event_date)}</Text>
        <Text style={styles.cardTime}>{formatTime(item.event_time)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && events.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#009688" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Events</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Event List */}
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#009688"]}
              tintColor="#009688"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar" size={48} color="#009688" />
              <Text style={styles.emptyText}>No events available</Text>
              <TouchableOpacity 
                style={styles.refreshButton} 
                onPress={fetchEvents}
              >
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#009688",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 16,
    marginBottom: 8,
  },
  refreshButton: {
    backgroundColor: "#009688",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  refreshButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    marginRight: 12,
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardDesc: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  cardMetaText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#555",
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  cardDate: {
    fontSize: 13,
    color: "#009688",
    fontStyle: "italic",
  },
  cardTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#009688",
    marginTop: 4,
  },
});

export default Events;