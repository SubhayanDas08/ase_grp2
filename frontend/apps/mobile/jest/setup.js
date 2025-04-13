jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { Text } = require('react-native');
  
    return {
      Ionicons: (props) => <Text>{`Ionicons ${props.name}`}</Text>,
      FontAwesome: (props) => <Text>{`FontAwesome ${props.name}`}</Text>,
      Feather: (props) => <Text>{`Feather ${props.name}`}</Text>,
    };
  });
  
// Mock expo-location
jest.mock('expo-location', () => {
  return {
    requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    getCurrentPositionAsync: jest.fn(() => Promise.resolve({
      coords: {
        latitude: 53.3498,
        longitude: -6.2603,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    })),
    reverseGeocodeAsync: jest.fn(() => Promise.resolve([
      {
        city: 'Dublin',
        district: 'Dublin City',
        isoCountryCode: 'IE',
        name: '1 Grafton Street',
        postalCode: 'D02 FH48',
        region: 'Leinster',
        street: 'Grafton Street',
        streetNumber: '1',
        subregion: 'Dublin',
        timezone: 'Europe/Dublin',
      },
    ])),
    Accuracy: {
      Balanced: 'balanced', // Use string or number representation
    },
  };
});

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props) => <View {...props}>{props.children}</View>;
  const MockMarker = (props) => <View {...props} />;
  const MockCircle = (props) => <View {...props} />; // Add mock for Circle

  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Circle: MockCircle, // Export the mocked Circle
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
  