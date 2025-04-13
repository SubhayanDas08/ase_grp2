import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './Components/homePage';
import Menu from './Components/Menu';
import MapVisual from './Components/MapVisual';
import Traffic from './Components/Traffic';
import EfficientRoutes from './Components/EfficientRoutes';
import Events from './Components/Events';
import EventDetails from './Components/EventDetails';
import Weather from './Components/Weather';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const Stack = createStackNavigator();
 
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="homePage"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="homePage" component={HomePage} />
              <Stack.Screen name="Menu" component={Menu} />       
              <Stack.Screen name="MapVisual" component={MapVisual} />
              <Stack.Screen name="Traffic" component={Traffic} />
              <Stack.Screen name="EfficientRoutes" component={EfficientRoutes} />
              <Stack.Screen name="Events" component={Events} />
              <Stack.Screen name="EventDetails" component={EventDetails} />
              <Stack.Screen name="Weather" component={Weather} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
