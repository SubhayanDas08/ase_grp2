import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './Components/Signup';
import Login from './Components/Login';

export default function App() {
 
  const Stack=createStackNavigator();
 
  return (
    <View style={styles.container}>
     
     <NavigationContainer initialRouteName="Login">
       <Stack.Navigator>
       <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false, // Hide the header for Signup
          }}
        />
         <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false, // Hide the header for Signup
          }}
        />
       </Stack.Navigator>
     </NavigationContainer>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
});
