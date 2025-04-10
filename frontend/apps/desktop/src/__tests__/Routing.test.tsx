import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Routing from '../pages/Routing';
import axios from 'axios';
import mockAxios from 'axios-mock-adapter';
import { MapContainer } from 'react-leaflet';

// Mock axios for API calls
const mock = new mockAxios(axios);

// Mock leaflet map components
jest.mock('react-leaflet', () => ({
  ...jest.requireActual('react-leaflet'),
  MapContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
  Marker: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Polyline: () => <div>Polyline</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useMap: () => ({
    flyTo: jest.fn(),
  }),
}));

// Mock other utilities
jest.mock('../utils/fetchUserLocation.ts', () => jest.fn(() => Promise.resolve({ lat: 53.349805, lon: -6.26031 })));
jest.mock('../utils/updateMapView.ts', () => () => <div>UpdateMapView</div>);
jest.mock('../components/locationSearch.tsx', () => () => <div>LocationSearch</div>);
jest.mock('../components/processTFIJourneys.tsx', () => jest.fn(() => ({ stops: [], routes: [], descriptions: [] })));

// Test Routing component
describe('Routing Component', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('renders the component and displays loading state', async () => {
    render(<Routing />);

    // Check if the map is loading
    expect(screen.getByText('Loading map...')).toBeInTheDocument();
  });

  it('fetches user location and renders the map', async () => {
    render(<Routing />);

    await waitFor(() => screen.getByText('TileLayer'));

    // Verify that the map container is rendered
    expect(screen.getByText('TileLayer')).toBeInTheDocument();
  });

  it('fetches routes when a button is clicked', async () => {
    render(<Routing />);

    // Mock the response for fetchRoutes API call
    mock.onPost('https://api-lts.transportforireland.ie/lts/lts/v1/public/planJourney').reply(200, {
      routes: [{ coordinates: [[53.349805, -6.26031], [53.360000, -6.280000]] }],
      descriptions: ['Route description'],
    });

    // Simulate selecting transport mode and clicking the button
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'bus' } });
    fireEvent.click(screen.getByRole('button', { name: /Get Route/i }));

    await waitFor(() => screen.getByText('Route description'));

    // Verify if route details appear
    expect(screen.getByText('Route description')).toBeInTheDocument();
  });

  it('handles errors gracefully', async () => {
    render(<Routing />);

    // Simulate an error in the API response
    mock.onPost('https://api-lts.transportforireland.ie/lts/lts/v1/public/planJourney').reply(500);

    // Simulate clicking the button
    fireEvent.click(screen.getByRole('button', { name: /Get Route/i }));

    await waitFor(() => screen.getByText('Loading map...')); // If the error was handled, loading should still be displayed
  });
});
