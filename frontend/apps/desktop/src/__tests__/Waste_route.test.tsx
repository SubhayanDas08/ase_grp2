import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Waste_route from "../pages/Waste_route"; // Singular, matching the intended file name

// Mock useLocation to provide the required nested state.data.data structure
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      data: {
        data: { // Nested data to match component's expectation
          route_name: "Route 1",
          county: "County A",
          place_pickup_times: [
            { place: "Place 1", pickup_time: "08:00" },
            { place: "Place 2", pickup_time: "09:00" },
          ],
          pickup_duration_min: 60
        }
      }
    }
  }),
}));

describe('Waste_route', () => {
  test('renders route details correctly', () => {
    render(
      <Router>
        <Waste_route />
      </Router>
    );
    expect(screen.getByText(/Route 1/i)).toBeInTheDocument();
    expect(screen.getByText(/County A/i)).toBeInTheDocument();
  });

  test('renders list of stops with correct details', () => {
    render(
      <Router>
        <Waste_route />
      </Router>
    );
    expect(screen.getByText(/Place 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Pickup time: 08:00/i)).toBeInTheDocument();
    expect(screen.getByText(/Place 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Pickup time: 09:00/i)).toBeInTheDocument();
  });

  test('calculates estimated time per stop correctly', () => {
    render(
      <Router>
        <Waste_route />
      </Router>
    );
    const timeElements = screen.getAllByText(/est. time: ~30 mins/i);
    expect(timeElements.length).toBe(2); // One for each stop
    expect(timeElements[0]).toBeInTheDocument(); // Verify at least one exists
  });

  test('toggles recommendations box when button is clicked', async () => {
    render(
      <Router>
        <Waste_route />
      </Router>
    );
    const recommendationsButton = screen.getByRole('button', { name: /View Recommendations/i });
    expect(recommendationsButton).toBeInTheDocument();

    // Initially, the recommendations box should not be visible
    expect(screen.queryByRole('heading', { name: /Recommendations/i })).not.toBeInTheDocument();

    // Click to show the box
    fireEvent.click(recommendationsButton);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Recommendations/i })).toBeInTheDocument();
    });

    // Click again to hide the box
    fireEvent.click(recommendationsButton);
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Recommendations/i })).not.toBeInTheDocument();
    });
  });

  test('renders icons correctly', () => {
    render(
      <Router>
        <Waste_route />
      </Router>
    );
    // Use getByDisplayValue with a regex to match SVG content since id is used in the component
    const cloudLightningIcon = screen.getByText((_, element) => {
      return element?.id === 'routes_waste_logo2' && element?.innerHTML.includes('<svg');
    });
    const lightningBoltIcons = screen.getAllByText((_, element) => {
      return element?.id === 'routes_waste_logo' && element?.innerHTML.includes('<svg');
    });

    expect(cloudLightningIcon).toBeInTheDocument();
    expect(lightningBoltIcons.length).toBe(2); // One for each stop
    expect(cloudLightningIcon.innerHTML).toContain('<svg');
    expect(lightningBoltIcons[0].innerHTML).toContain('<svg');
  });
});