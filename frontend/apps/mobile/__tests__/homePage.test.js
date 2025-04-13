import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomePage from '../Components/homePage';

describe('<HomePage />', () => {
  it('fetches and displays homepage data', async () => {
    await waitFor(() => {
      render(<HomePage />);
    });
  });
});
