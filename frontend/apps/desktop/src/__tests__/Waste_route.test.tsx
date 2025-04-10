import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Waste_routes from "../pages/Waste_routes"; // Adjust the import path
import { FiCloudLightning } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";

// Mocking react-router's useLocation to simulate the location state
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      data: {
        route_name: "Route 1",
        county: "County A",
        place_pickup_times: [
          { place: "Place 1", pickup_time: "08:00" },
          { place: "Place 2", pickup_time: "09:00" },
        ],
        pickup_duration_min: 60,
        place_pickup_times: [{ place: "Place 1", pickup_time: "08:00" }],
      }
    }
  }),
}));

describe('Waste_routes', () => {
  test('renders route details correctly', () => {
    render(
      <Router>
        <Waste_routes />
      </Router>
    );

    // Check that route name and county are rendered
    expect(screen.getByText(/Route 1/i)).toBeInTheDocument();
    expect(screen.getByText(/County A/i)).toBeInTheDocument();
  });

  test('renders list of stops with correct details', () => {
    render(
      <Router>
        <Waste_routes />
      </Router>
    );

    // Check that the stops are rendered with correct details
    expect(screen.getByText(/Place 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Pickup time: 08:00/i)).toBeInTheDocument();
  });

  test('calculates estimated time per stop correctly', () => {
    render(
      <Router>
        <Waste_routes />
      </Router>
    );

    // Check if estimated time per stop is rendered correctly
    expect(screen.getByText(/est. time: ~60 mins/i)).toBeInTheDocument();
  });

  test('toggles recommendations box when button is clicked', async () => {
    render(
      <Router>
        <Waste_routes />
      </Router>
    );

    // Check if "View Recommendations" button is present
    const recommendationsButton = screen.getByText(/View Recommendations/i);
    expect(recommendationsButton).toBeInTheDocument();

    // Simulate button click to toggle recommendations box
    fireEvent.click(recommendationsButton);

    // Wait for the recommendations box to be visible
    await waitFor(() => screen.getByText(/Recommendations/i));
    expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();

    // Simulate button click again to hide recommendations box
    fireEvent.click(recommendationsButton);
    await waitFor(() => expect(screen.queryByText(/Recommendations/i)).not.toBeInTheDocument());
  });

  test('renders icons correctly', () => {
    render(
      <Router>
        <Waste_routes />
      </Router>
    );

    // Check if the icons are rendered
    expect(screen.getByTestId('routes_waste_logo2')).toContainHTML('<svg');
    expect(screen.getByTestId('routes_waste_logo')).toContainHTML('<svg');
  });
});
