import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import homePage from './Components/homePage';
import Menu from './Components/Menu';
import MapVisual from './Components/MapVisual';
import Traffic from './Components/Traffic';
import EfficientRoutes from './Components/EfficientRoutes';
import Events from './Components/Events';
import Weather from './Components/Weather';

export default function App() {
 
  const Stack=createStackNavigator();
 
  return (
    <View style={styles.container}>
     
     <NavigationContainer initialRouteName="HomePage">
       <Stack.Navigator>
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
         <Stack.Screen
          name="EfficientRoutes"
          component={EfficientRoutes}
          options={{
            headerShown: false, // Hide the header for Signup
          }}
        />
         <Stack.Screen
          name="Events"
          component={Events}
          options={{
            headerShown: false, // Hide the header for Signup
          }}
        />
        <Stack.Screen
          name="Weather"
          component={Weather}
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
