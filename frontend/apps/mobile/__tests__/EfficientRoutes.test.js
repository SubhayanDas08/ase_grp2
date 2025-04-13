import React from 'react';
import { render } from '@testing-library/react-native';
import EfficientRoutes from '../Components/EfficientRoutes';

describe('<EfficientRoutes />', () => {
  it('renders without crashing', () => {
    render(<EfficientRoutes />);
  });
});
