import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Weather from '../Components/Weather';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const mockNavigation = { navigate: jest.fn() };

beforeEach(() => {
  fetch.resetMocks();
});

describe('Weather Screen', () => {
  it('renders search input and button', () => {
    const { getByPlaceholderText, getByText } = render(<Weather navigation={mockNavigation} />);
    expect(getByPlaceholderText('Search for a location')).toBeTruthy();
    expect(getByText('Get Weather')).toBeTruthy();
  });

  it('searches, selects a prediction, and fetches weather data', async () => {
    // Step 1: Mock predictions API
    fetch
      .mockResponseOnce(
        JSON.stringify({
          predictions: [{ place_id: 'abc123', description: 'Dublin, Ireland' }],
        })
      )
      // Step 2: Mock place details API
      .mockResponseOnce(
        JSON.stringify({
          result: {
            geometry: { location: { lat: 53.3498, lng: -6.2603 } },
            name: 'Dublin',
          },
        })
      )
      // Step 3: Mock weather API
      .mockResponseOnce(
        JSON.stringify({
          weather: [{ description: 'clear sky' }],
          main: { temp: 15, humidity: 40 },
          name: 'Dublin',
        })
      )
      // Step 4: Mock air pollution API
      .mockResponseOnce(
        JSON.stringify({
          list: [{ components: { pm2_5: 30 } }],
        })
      );

    const { getByPlaceholderText, findByText, getByText } = render(
      <Weather navigation={mockNavigation} />
    );

    // Type into search
    await act(async () => {
      fireEvent.changeText(getByPlaceholderText('Search for a location'), 'Dublin');
    });

    const prediction = await findByText('Dublin, Ireland');
    fireEvent.press(prediction);

    // Press "Get Weather"
    await act(async () => {
      fireEvent.press(getByText('Get Weather'));
    });

    // Wait for weather and pollution to show up
    expect(await findByText(/Temp:/)).toBeTruthy();
    expect(await findByText(/Air Pollution/)).toBeTruthy();
  });

  it('navigates to Menu when menu icon is pressed', () => {
    const { getByText } = render(<Weather navigation={mockNavigation} />);
    fireEvent.press(getByText('Ionicons menu'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Menu');
  });
});
