import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Weather from '../Components/Weather';
import { NavigationContainer } from '@react-navigation/native';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

const renderWithNavigation = (component) => {
  return render(
    <NavigationContainer>{component}</NavigationContainer>
  );
};

beforeEach(() => {
  fetch.resetMocks();
  mockNavigation.navigate.mockClear();
  mockNavigation.goBack.mockClear();
});

describe('Weather Screen', () => {
  it('renders search input and button', () => {
    const { getByPlaceholderText, getByText } = renderWithNavigation(<Weather navigation={mockNavigation} />);
    expect(getByPlaceholderText('Search for a location')).toBeTruthy();
    expect(getByText('Get Weather')).toBeTruthy();
  });

  it('searches, selects a prediction, and fetches weather data', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      predictions: [{ place_id: 'abc123', description: 'Dublin, Ireland' }],
    }));
    fetch.mockResponseOnce(JSON.stringify({
      result: {
        geometry: { location: { lat: 53.3498, lng: -6.2603 } },
        name: 'Dublin',
      },
    }));
    fetch.mockResponseOnce(JSON.stringify({
      weather: [{ description: 'clear sky', icon: '01d' }],
      main: { temp: 15, humidity: 40 },
      name: 'Dublin',
      coord: { lat: 53.3498, lon: -6.2603 },
    }));
    fetch.mockResponseOnce(JSON.stringify({
      list: [{ main: { aqi: 2 }, components: { pm2_5: 30 } }],
    }));

    const { getByPlaceholderText, findByText, getByText } = renderWithNavigation(
      <Weather navigation={mockNavigation} />
    );

    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Search for a location'), 'Dublin');
    });

    const prediction = await findByText('Dublin, Ireland');
    await act(async () => {
      fireEvent.press(prediction);
    });

    await act(async () => {
      fireEvent.press(getByText('Get Weather'));
    });

    await waitFor(() => {
      expect(getByText(/Temp: 15/)).toBeTruthy();
      expect(getByText(/Air Pollution/)).toBeTruthy();
      expect(getByText(/AQI: 2/)).toBeTruthy();
    });
  });

  it('navigates back when back arrow is pressed', () => {
    const { getByText } = renderWithNavigation(<Weather navigation={mockNavigation} />);
    fireEvent.press(getByText('Ionicons arrow-back'));
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('navigates to Menu when menu icon is pressed', () => {
    const { getByText } = renderWithNavigation(<Weather navigation={mockNavigation} />);
    // Using the mocked icon name from jest/setup.js for the 'menu' icon
    fireEvent.press(getByText('Ionicons menu'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Menu');
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1); // Ensure it was called once
  });
});
