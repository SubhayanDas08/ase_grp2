import react, {useState} from 'react';
import {View, Text,Image,TouchableOpacity} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Ionicons from "react-native-vector-icons/Ionicons"; // For Eye icon

const Login=({navigation})=>{

   const [passwordVisible, setPasswordVisible] = useState(false);

return (
    <>
    <View style={styles.div1}>
        <Text style={styles.text1}>Log In to your Account</Text>
        <Text style={styles.text2}>Welcome back! Please enter your details</Text>
        <View style={styles.loginform}>
        <TextInput style={styles.email} placeholder='Email or Phone Number'></TextInput>
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
              <TouchableOpacity style={styles.btnlogin}>
                        <Text style={styles.logintext}>Login In</Text>
                      </TouchableOpacity>

                    <Text style={styles.ortext}>Or</Text>  
              
                    <TouchableOpacity style={styles.btngooglelogin}>
                          <Image
                              source={require("../assets/icons8-google-30.png")} // Replace with your Google logo file
                              style={styles.googleIcon}
                            />
                            <Text style={styles.googleslogintext}>Log In with Google</Text>
                          </TouchableOpacity>
        </View>
        <Text style={styles.already}>Already have an account?<TouchableOpacity style={styles.btnsignup} onPress={()=>navigation.navigate("Signup")}><Text style={styles.signuptxt}>Sign Up</Text></TouchableOpacity></Text> 
    </View>
    
    </>
)

}

const styles={
    div1:{
      marginTop:200
    },
    text1:{
        fontSize: 26,
        marginLeft: 50,
        color: "#009688",
        marginTop:35
    },
    text2:{
        fontSize: 16,
        marginLeft: 50,
        marginTop: 8,
        fontWeight:500
    },
    loginform:{
        marginTop:70,
        marginLeft:50
    },
    email:{
    borderStyle:'solid',
    borderWidth:1,
    width:280,
    borderRadius:15
    },
    pwd: {
        flex: 1,
        height: 39,
        backgroundColor: "#F8F8FF",
        borderRadius: 15,
        borderStyle: "solid",
        borderWidth: 1,
        paddingHorizontal: 10,
      },
      passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 5,
        width: 270,
        marginTop: 20,
      },
      eyeIcon: {
        marginLeft: -30,
      },
      btnlogin:{
      marginTop:35,
      marginLeft:6,
      width:280,
      height:30,
      backgroundColor:"#009688",
      borderRadius:15
      },
      logintext:{
        color:'white',
        marginLeft: 110,
        marginTop: 5,
        fontWeight: "600",
      },
      ortext:{
        marginLeft: 140,
    marginTop: 20,
    fontWeight: "600",
    color:"grey"
      },
      btngooglelogin: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 280,
        marginLeft: 10,
        marginTop: 24,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 15,
        height: 40,
      },
      googleIcon: {
        marginRight: 10,
      },
      googlelogintext: {
        fontSize: 16,
        fontWeight: "600",
      },
      already: {
        marginTop: 20,
        marginLeft: 85,
        fontSize:16
      },
      signuptxt:{
        color:"#009688",
      },
      btnsignup:{
    marginTop:8,
    marginLeft:12
      }

}

export default Login;