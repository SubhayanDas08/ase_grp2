// __tests__/App.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

test('renders the welcome message', () => {
  const { getByText } = render(<App />);
  expect(getByText('Welcome')).toBeTruthy(); // Replace with actual text in your App
});
