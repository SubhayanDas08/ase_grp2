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

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.div1}>

      <Text style={styles.text1}>Create an Account</Text>
      <Text style={styles.text2}>Welcome!</Text>
      <Text style={styles.text3}>Please login or signup to our page!</Text>
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
          source={require("../assets/icons8-google-30.png")} // Replace with your Google logo file
          style={styles.googleIcon}
        />
        <Text style={styles.googlesignuptext}>Sign Up with Google</Text>
      </TouchableOpacity>
      <Text style={styles.already}>Already have an account? <Text style={styles.logintxt}>Log In</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  div1: {
    marginTop: 200,
  },
  text1: {
    fontSize: 30,
    marginLeft: 65,
    color: "#009688",
    marginTop:35
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
    marginTop: 40,
    marginLeft: 60,
  },
  fname: {
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    width: 100,
    height: 39,
  },
  lname: {
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    marginLeft: 70,
    borderStyle: "solid",
    borderWidth: 2,
    width: 100,
    height: 39,
  },
  email: {
    marginLeft: 60,
    borderStyle: "solid",
    borderRadius: 15,
    borderWidth: 2,
    width: 280,
    height: 39,
    marginTop: 10,
  },
  phno: {
    marginLeft: 60,
    borderStyle: "solid",
    borderRadius: 15,
    borderWidth: 2,
    width: 280,
    height: 39,
    marginTop: 10,
  },
  pwd: {
    flex: 1,
    height: 39,
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 60,
    width: 270,
    marginTop: 10,
  },
  eyeIcon: {
    marginLeft: -30,
  },
  btnsignup: {
    backgroundColor: "#009688",
    width: 280,
    marginLeft: 64,
    marginTop: 24,
    borderRadius: 15,
    height: 30,
  },
  signuptext: {
    color: "white",
    marginLeft: 120,
    marginTop: 5,
    fontWeight: "600",
  },
  ortext: {
    marginLeft: 190,
    marginTop: 20,
    fontWeight: "600",
  },
  btngooglesignup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    marginLeft: 60,
    marginTop: 24,
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 15,
    height: 40,
  },
  googleIcon: {
    marginRight: 10,
  },
  googlesignuptext: {
    fontSize: 16,
    fontWeight: "600",
  },
  already: {
    marginTop: 100,
    marginLeft: 90,
    fontSize:16
  },
  logintxt:{
    color:"#009688"
  }
});

export default Signup;
