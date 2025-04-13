import React from 'react';
import { render } from '@testing-library/react-native';
import Events from '../Components/Events';
import { NavigationContainer } from '@react-navigation/native';

describe('<Events />', () => {
  it('renders without crashing', () => {
    render(
      <NavigationContainer>
        <Events />
      </NavigationContainer>
    );
  });
});
