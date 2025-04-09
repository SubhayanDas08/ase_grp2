import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ReportIssue = ({ navigation }) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isReported, setIsReported] = useState(false);

  const handleReport = () => {
    setIsReported(true);
    setTimeout(() => setIsReported(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Menu + Back Icon */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="menu" size={28} color="#007b8f" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="arrow-back" size={26} color="#007b8f" />
        </TouchableOpacity>
      </View>

      {/* Header and Avatar */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Report an Issue</Text>
        <Image source={require("../assets/icon.png")} style={styles.avatar} />
      </View>

      {/* Form */}
      <TextInput
        placeholder="Subject"
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.description}
        multiline
        numberOfLines={6}
        placeholder="Enter your issue details..."
        value={description}
        onChangeText={setDescription}
      />

      {/* Report Button */}
      <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
        <Text style={styles.reportText}>Report</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal visible={isReported} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.indicator} />
            <Text style={styles.sheetTitle}>Issue Reported</Text>
            <Text style={styles.sheetDesc}>
              Our management team will look into the issue reported
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007b8f",
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 44,
    marginBottom: 20,
    elevation: 4,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  description: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 15,
    textAlignVertical: "top",
    height: 180,
    elevation: 2,
  },
  reportButton: {
    marginTop: 30,
    backgroundColor: "#00b8b8",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    elevation: 4,
  },
  reportText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: "#333",
    borderRadius: 3,
    marginBottom: 15,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007b8f",
    marginBottom: 8,
  },
  sheetDesc: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
  },
});

export default ReportIssue;
