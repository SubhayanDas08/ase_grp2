import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Menu = ({ navigation }) => {
  const menuItems = [
    { title: "Home", icon: "home-outline", screen: "homePage" },
    { title: "Map", icon: "map-outline", screen: "MapVisual" },
    { title: "Events", icon: "list-outline", screen: "Events" },
    { title: "Traffic", icon: "bus-outline", screen: "Traffic" },
    { title: "Weather", icon: "partly-sunny-outline", screen: "Weather" },
    { title: "Efficient Routes", icon: "navigate-outline", screen: "EfficientRoutes" }, // ✅ updated
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("homePage")}>
          <Ionicons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Explore App</Text>
      </View>
      <View style={styles.separator} />

      {/* Menu Items */}
      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (item.screen) {
                navigation.navigate(item.screen);
              }
            }}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color="white"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00b8b8",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  separator: {
    height: 1,
    backgroundColor: "white",
    opacity: 0.3,
    marginVertical: 10,
  },
  menuList: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  menuIcon: {
    width: 32,
    textAlign: "center",
  },
  menuText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
});

export default Menu;
