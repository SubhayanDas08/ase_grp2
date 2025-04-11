import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Waste_route from '../pages/Waste_route';
import { authenticatedPost } from '../utils/auth';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock the authenticatedPost utility
jest.mock('../utils/auth', () => ({
  authenticatedPost: jest.fn(),
}));

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  // Preserve any other functionalities from react-router-dom
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('Waste_route Component', () => {
  beforeEach(() => {
    // Provide a custom location state with test data.
    // Note the extra "data" nesting needed by the component:
    // location.state.data.data.pickup_duration_min etc.
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        data: {
          data: {
            pickup_duration_min: 30,
            place_pickup_times: [
              { place: 'Stop1', pickup_time: '10:00' },
              { place: 'Stop2', pickup_time: '10:15' },
            ],
            route_id: 'route1',
            route_name: 'Test Route',
            county: 'Test County',
          },
        },
      },
    });
    jest.clearAllMocks();
  });

  test('renders initial elements correctly', async () => {
    // Mock API responses for both endpoints
    (authenticatedPost as jest.Mock).mockImplementation((endpoint: string) => {
      if (endpoint === '/predict/AQI_TC') {
        return Promise.resolve([
          { place: 'Stop1', aqi: 100, tc: 4 },
          { place: 'Stop2', aqi: 150, tc: 5 },
        ]);
      } else if (endpoint === '/recommend/trashpickup') {
        return Promise.resolve({ recommendations: 'Test recommendation' });
      }
      return Promise.resolve(null);
    });

    // Wrap render inside act to flush useEffect async updates
    await act(async () => {
      render(<Waste_route />);
    });

    // Check header elements and route information
    expect(screen.getByText('Waste Route')).toBeInTheDocument();
    expect(screen.getByText('Test Route')).toBeInTheDocument();
    expect(screen.getByText('Test County')).toBeInTheDocument();

    // Verify that the stops and their pickup times are rendered
    expect(screen.getByText('Stop1')).toBeInTheDocument();
    expect(screen.getByText('Pickup time: 10:00')).toBeInTheDocument();
    expect(screen.getByText('Stop2')).toBeInTheDocument();
    expect(screen.getByText('Pickup time: 10:15')).toBeInTheDocument();

    // Now use getAllByText to check there are 2 instances of "est. time: ~15 mins"
    expect(screen.getAllByText(/est\. time: ~15 mins/)).toHaveLength(2);

    // Wait for the asynchronous API calls to update the AQI and Traffic Index
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  test('navigates to /waste/ when clicking on the breadcrumb', async () => {
    (authenticatedPost as jest.Mock).mockResolvedValue([]);
    await act(async () => {
      render(<Waste_route />);
    });
    
    const breadcrumb = screen.getByText('Waste');
    fireEvent.click(breadcrumb);
    expect(mockNavigate).toHaveBeenCalledWith('/waste/');
  });

  test('toggles recommendations box and displays fetched recommendation', async () => {
    (authenticatedPost as jest.Mock).mockImplementation((endpoint: string) => {
      if (endpoint === '/predict/AQI_TC') {
        return Promise.resolve([
          { place: 'Stop1', aqi: 100, tc: 4 },
          { place: 'Stop2', aqi: 150, tc: 5 },
        ]);
      } else if (endpoint === '/recommend/trashpickup') {
        return Promise.resolve({ recommendations: 'Test recommendation' });
      }
      return Promise.resolve(null);
    });
    
    await act(async () => {
      render(<Waste_route />);
    });
    
    // Initially, the recommendations box should not be visible
    expect(screen.queryByText('Recommendations')).not.toBeInTheDocument();
    
    const viewButton = screen.getByText('View Recommendations');
    fireEvent.click(viewButton);
    
    // Wait for the recommendation to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Test recommendation')).toBeInTheDocument();
    });
  });

  test('displays error message when fetching recommendation fails', async () => {
    (authenticatedPost as jest.Mock).mockImplementation((endpoint: string) => {
      if (endpoint === '/predict/AQI_TC') {
        return Promise.resolve([
          { place: 'Stop1', aqi: 100, tc: 4 },
          { place: 'Stop2', aqi: 150, tc: 5 },
        ]);
      } else if (endpoint === '/recommend/trashpickup') {
        return Promise.reject(new Error('Error fetching recommendation'));
      }
      return Promise.resolve(null);
    });
    
    await act(async () => {
      render(<Waste_route />);
    });
    
    const viewButton = screen.getByText('View Recommendations');
    fireEvent.click(viewButton);
    
    await waitFor(() => {
      expect(screen.getByText('Unable to fetch recommendation')).toBeInTheDocument();
    });
  });
});