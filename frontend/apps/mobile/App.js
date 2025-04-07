import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './Components/Signup';
import Login from './Components/Login';
import homePage from './Components/homePage';
import Menu from './Components/Menu';
import MapVisual from './Components/MapVisual';
import Traffic from './Components/Traffic';

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
        <Stack.Screen
          name="homePage"
          component={homePage}
          options={{
            headerShown: false, // Hide the header for Signup
          }}
        />
            <Stack.Screen
          name="Menu"
          component={Menu}
          options={{
            headerShown: false, // Hide the header for Signup
          }}
        />
        <Stack.Screen
          name="MapVisual"
          component={MapVisual}
          options={{
            headerShown: false, // Hide the header for Signup
          }}
        />
        <Stack.Screen
          name="Traffic"
          component={Traffic}
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
