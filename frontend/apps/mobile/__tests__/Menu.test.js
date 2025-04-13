import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Menu from '../Components/Menu';

const mockNavigation = { navigate: jest.fn() };

describe('<Menu />', () => {
  it('navigates to correct screens on press', () => {
    const { getByText } = render(<Menu navigation={mockNavigation} />);

    fireEvent.press(getByText('Home'));
    fireEvent.press(getByText('Weather'));
    fireEvent.press(getByText('Traffic'));
    fireEvent.press(getByText('Efficient Routes'));
    fireEvent.press(getByText('Events'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('homePage');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Weather');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Traffic');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EfficientRoutes');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Events');
  });
});
