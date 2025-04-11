import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const Events = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState("12:00");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        name: "Marathon 2025",
        event_date: "2025-04-20",
        event_time: "08:00",
        location: "Dublin City Center",
        area: "Dublin 2",
        description: "Annual city marathon",
      },
      {
        id: 2,
        name: "Community Cleanup",
        event_date: "2025-04-25",
        event_time: "10:00",
        location: "Phoenix Park",
        area: "Dublin 8",
        description: "Join us to clean up the park!",
      },
    ];
    setEvents(mockEvents);
  }, []);

  const handleAddEvent = () => {
    if (!eventName || !eventDate || !eventTime || !location || !area || !description) {
      alert("Please fill all details.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      name: eventName,
      event_date: eventDate.toISOString().split("T")[0],
      event_time: eventTime,
      location,
      area,
      description,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setModalVisible(false);
    setEventName("");
    setLocation("");
    setArea("");
    setDescription("");
  };

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="menu" size={28} color="#009688" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Ionicons name="flash" size={24} color="#007b8f" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <View style={styles.cardMeta}>
                <Ionicons name="location" size={14} />
                <Text style={styles.cardMetaText}>{item.location}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.cardDate}>{formatDate(item.event_date)}</Text>
              <Text style={styles.cardTime}>{item.event_time}</Text>
            </View>
          </View>
        )}
      />

      {/* Modal for Add Event */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Event</Text>

          <TextInput
            placeholder="Event Name"
            value={eventName}
            onChangeText={setEventName}
            style={styles.input}
          />
          <TextInput
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
          <TextInput
            placeholder="Area"
            value={area}
            onChangeText={setArea}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>Select Date: {eventDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, date) => {
                setShowDatePicker(false);
                if (date) setEventDate(date);
              }}
            />
          )}
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
            <Text>Select Time: {eventTime}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, date) => {
                setShowTimePicker(false);
                if (date) {
                  const timeString = `${date.getHours().toString().padStart(2, "0")}:${date
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`;
                  setEventTime(timeString);
                }
              }}
            />
          )}
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: 100 }]}
            multiline
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleAddEvent}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff", marginTop: 40 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#007b8f" },
  addButton: {
    backgroundColor: "#009688",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addButtonText: { color: "white", marginLeft: 6, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2f1",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  cardLeft: {
    marginRight: 10,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardDesc: { fontSize: 14, color: "#555" },
  cardMeta: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  cardMetaText: { marginLeft: 4, fontSize: 13 },
  cardRight: { alignItems: "flex-end" },
  cardDate: { fontSize: 13, fontStyle: "italic" },
  cardTime: { fontSize: 14, fontWeight: "bold" },

  modalContent: { padding: 20, marginTop: 50 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#009688" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  submitBtn: {
    backgroundColor: "#009688",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  submitBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelBtnText: { fontWeight: "bold" },
});

export default Events;
