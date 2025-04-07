import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // For Eye icon

const Signup = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.div1}>
      <Text style={styles.text1}>Create an Account</Text>
      <Text style={styles.text2}>Welcome!</Text>
      <Text style={styles.text3}>Please login or signup to our page</Text>

      <View style={styles.nameform}>
        <TextInput style={styles.fname} placeholder="firstname" />
        <TextInput style={styles.lname} placeholder="lastname" />
      </View>

      <TextInput style={styles.email} placeholder="email" />
      <TextInput style={styles.phno} placeholder="Phone number" />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.pwd}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={passwordVisible ? "eye" : "eye-off"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btnsignup}>
        <Text style={styles.signuptext}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.ortext}>Or</Text>

      <TouchableOpacity style={styles.btngooglesignup}>
        <Image
          source={require("../assets/icons8-google-30.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googlesignuptext}>Sign Up with Google</Text>
      </TouchableOpacity>

      {/* Fixed layout for login link */}
      <View style={styles.loginContainer}>
        <Text style={styles.already}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.logintxt}> Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  div1: {
    marginTop: 160,
  },
  text1: {
    fontSize: 30,
    marginLeft: 65,
    color: "#009688",
    marginTop: 35,
  },
  text2: {
    fontSize: 28,
    marginLeft: 65,
    marginTop: 8,
    color: "#009688",
  },
  text3: {
    fontSize: 17,
    marginLeft: 65,
    marginTop: 5,
  },
  nameform: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginHorizontal: 60,
  },
  fname: {
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    borderWidth: 1,
    width: 120,
    height: 39,
    paddingLeft: 10,
  },
  lname: {
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    borderWidth: 1,
    width: 120,
    height: 39,
    paddingLeft: 10,
    marginRight:30
  },
  email: {
    marginLeft: 60,
    borderRadius: 15,
    borderWidth: 1,
    width: 280,
    height: 39,
    marginTop: 10,
    paddingLeft: 10,
    backgroundColor: "#F8F8FF",
  },
  phno: {
    marginLeft: 60,
    borderRadius: 15,
    borderWidth: 1,
    width: 280,
    height: 39,
    marginTop: 10,
    paddingLeft: 10,
    backgroundColor: "#F8F8FF",
  },
  pwd: {
    flex: 1,
    height: 39,
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 35,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 60,
    width: 280,
    marginTop: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  btnsignup: {
    backgroundColor: "#009688",
    width: 280,
    marginLeft: 60,
    marginTop: 24,
    borderRadius: 15,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  signuptext: {
    color: "white",
    fontWeight: "600",
  },
  ortext: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
    color: "gray",
  },
  btngooglesignup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    marginLeft: 60,
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 15,
    height: 40,
    backgroundColor: "#fff",
  },
  googleIcon: {
    marginRight: 10,
  },
  googlesignuptext: {
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  already: {
    fontSize: 16,
    color: "#000",
  },
  logintxt: {
    color: "#009688",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Signup;
