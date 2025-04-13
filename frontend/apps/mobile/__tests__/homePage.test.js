import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomePage from '../Components/homePage';
import { NavigationContainer } from '@react-navigation/native';

describe('<HomePage />', () => {
  it('fetches and displays homepage data', async () => {
    const mockNavigation = { navigate: jest.fn() };

    await waitFor(() => {
      render(
        <NavigationContainer>
          <HomePage navigation={mockNavigation} />
        </NavigationContainer>
      );
    });

    // Add assertions here to check if the data is displayed correctly
    // e.g., expect(screen.getByText('Expected Data')).toBeTruthy();
  });
});
