import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Modal,
  Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Settings = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="menu" size={28} color="#007b8f" />
        </TouchableOpacity>
        <Text style={styles.header}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Profile Section */}
      <View style={styles.profileRow}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.name}>Mr. John Doe</Text>
        </View>
        <TouchableOpacity style={{ marginLeft: "auto" }}>
          <Ionicons name="log-out-outline" size={24} color="#007b8f" />
        </TouchableOpacity>
      </View>

      {/* Option List */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("UserProfile")}
      >
        <Ionicons name="person-outline" size={24} color="#007b8f" />
        <Text style={styles.optionText}>User Profile</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#555" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="lock-closed-outline" size={24} color="#007b8f" />
        <Text style={styles.optionText}>Change Password</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#555" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("ReportIssue")}
      >
        <Ionicons name="help-circle-outline" size={24} color="#007b8f" />
        <Text style={styles.optionText}>Report an Issue</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#555" />
      </TouchableOpacity>

      {/* Push Notification */}
      <View style={styles.option}>
        <Ionicons name="notifications-outline" size={24} color="#007b8f" />
        <Text style={styles.optionText}>Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ true: "#00c853", false: "#ccc" }}
          thumbColor={notificationsEnabled ? "#ffffff" : "#f4f3f4"}
        />
      </View>

      {/* Modal for Changing Password */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <View style={styles.passwordField}>
              <TextInput
                placeholder="New Password"
                secureTextEntry={!passwordVisible}
                style={styles.modalInput}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordField}>
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry={!confirmVisible}
                style={styles.modalInput}
              />
              <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)}>
                <Ionicons
                  name={confirmVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveText}>Change Password</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: "#888", textAlign: "center" }}>Cancel</Text>
            </Pressable>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#007b8f",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 25,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 15,
  },
  welcome: {
    fontSize: 14,
    color: "gray",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007b8f",
    marginBottom: 20,
    textAlign: "center",
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 45,
  },
  modalInput: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#00b8b8",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Settings;
