import React from 'react';
import { render } from '@testing-library/react-native';
import Traffic from '../Components/Traffic';

describe('<Traffic />', () => {
  it('renders without crashing', () => {
    render(<Traffic />);
  });
});
