import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UserProfile = ({ navigation }) => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");

  return (
    <View style={styles.container}>
      {/* Header Row with Menu & Back */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="menu" size={28} color="#009688" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Ionicons name="arrow-back-outline" size={26} color="#009688" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>User Profile</Text>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.profileImage}
        />
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={18} color="#666" />
        </View>
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value="johndoe@gmail.com"
          editable={false}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value="+353 899739832"
          editable={false}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009688",
    marginTop: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 110,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  form: {
    marginTop: 20,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  disabledInput: {
    backgroundColor: "#f1f1f1",
    color: "#555",
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#00b8b8",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default UserProfile;
