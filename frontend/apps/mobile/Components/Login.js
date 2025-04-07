import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

const Login = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Navigate to homePage without validation
  const handleLogin = () => {
    navigation.navigate("homePage");
  };

  return (
    <View style={styles.div1}>
      <Text style={styles.text1}>Log In to your Account</Text>
      <Text style={styles.text2}>Welcome back! Please enter your details</Text>

      <View style={styles.loginform}>
        <TextInput
          style={styles.email}
          placeholder='Email or Phone Number'
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.pwd}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
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

        <TouchableOpacity style={styles.btnlogin} onPress={handleLogin}>
          <Text style={styles.logintext}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.ortext}>Or</Text>

        <TouchableOpacity style={styles.btngooglelogin}>
          <Image
            source={require("../assets/icons8-google-30.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.googlelogintext}>Log In with Google</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.already}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signuptxt}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  div1: {
    marginTop: 160,
    marginLeft: 20,
  },
  text1: {
    fontSize: 26,
    marginLeft: 50,
    color: "#009688",
    marginTop: 35,
  },
  text2: {
    fontSize: 16,
    marginLeft: 50,
    marginTop: 8,
    fontWeight: "500",
  },
  loginform: {
    marginTop: 70,
    marginLeft: 50,
  },
  email: {
    borderStyle: 'solid',
    borderWidth: 1,
    width: 280,
    borderRadius: 15,
    paddingLeft: 10,
    height: 39,
    backgroundColor: "#F8F8FF",
  },
  pwd: {
    flex: 1,
    height: 39,
    backgroundColor: "#F8F8FF",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 35,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    width: 280,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  btnlogin: {
    marginTop: 35,
    width: 280,
    height: 40,
    backgroundColor: "#009688",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  logintext: {
    color: 'white',
    fontWeight: "600",
    fontSize: 16,
  },
  ortext: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
    color: "grey",
    marginRight: 80,
  },
  btngooglelogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    marginTop: 24,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 15,
    height: 40,
    backgroundColor: "#fff",
  },
  googleIcon: {
    marginRight: 10,
  },
  googlelogintext: {
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    marginRight: 46,
  },
  already: {
    fontSize: 16,
    color: "#000",
  },
  signuptxt: {
    color: "#009688",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Login;
