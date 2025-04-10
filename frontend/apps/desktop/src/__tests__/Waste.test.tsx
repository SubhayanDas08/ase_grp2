import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Waste from "../pages/Waste"; // Adjust import based on the correct file path
import { authenticatedPost } from "../utils/auth";

// Mocking the authenticatedPost function
jest.mock("../utils/auth", () => ({
  authenticatedPost: jest.fn(),
}));

// Mocking react-router's Link component to simulate navigation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe("Waste Component", () => {
  beforeEach(() => {
    // Reset mock before each test
    authenticatedPost.mockReset();
  });

  test("renders day and county selectors correctly", () => {
    render(
      <Router>
        <Waste />
      </Router>
    );

    // Check if day and county dropdowns are rendered
    expect(screen.getByText(/Select day/i)).toBeInTheDocument();
    expect(screen.getByText(/Select county/i)).toBeInTheDocument();
  });

  test("fetches and renders routes after search", async () => {
    const mockData = [
      {
        route_name: "Route 1",
        county: "Dublin",
        place_pickup_times: [
          { place: "Place 1", pickup_time: "08:00" },
          { place: "Place 2", pickup_time: "09:00" },
        ],
        num_stops: 2,
      },
    ];

    // Mock the API call to return mock data
    authenticatedPost.mockResolvedValue(mockData);

    render(
      <Router>
        <Waste />
      </Router>
    );

    // Select a day and county
    fireEvent.change(screen.getByLabelText(/Select day/i), { target: { value: "Monday" } });
    fireEvent.change(screen.getByLabelText(/Select county/i), { target: { value: "Dublin" } });

    // Click the search button
    fireEvent.click(screen.getByText(/Search/i));

    // Wait for the data to be rendered
    await waitFor(() => screen.getByText(/Route 1/i));

    // Check if the route name and details are displayed
    expect(screen.getByText(/Route 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Dublin/i)).toBeInTheDocument();
    expect(screen.getByText(/Place 1 at 08:00, Place 2 at 09:00/i)).toBeInTheDocument();
    expect(screen.getByText(/2 stops/i)).toBeInTheDocument();
  });

  test("does not render routes before search", () => {
    render(
      <Router>
        <Waste />
      </Router>
    );

    // Ensure no routes are displayed before search
    expect(screen.queryByText(/Route 1/i)).not.toBeInTheDocument();
  });

  test("calls authenticatedPost with correct parameters", async () => {
    const mockData = [
      {
        route_name: "Route 1",
        county: "Dublin",
        place_pickup_times: [
          { place: "Place 1", pickup_time: "08:00" },
          { place: "Place 2", pickup_time: "09:00" },
        ],
        num_stops: 2,
      },
    ];

    // Mock the API call to return mock data
    authenticatedPost.mockResolvedValue(mockData);

    render(
      <Router>
        <Waste />
      </Router>
    );

    // Select day and county
    fireEvent.change(screen.getByLabelText(/Select day/i), { target: { value: "Monday" } });
    fireEvent.change(screen.getByLabelText(/Select county/i), { target: { value: "Dublin" } });

    // Click the search button
    fireEvent.click(screen.getByText(/Search/i));

    // Wait for the API call to finish
    await waitFor(() => expect(authenticatedPost).toHaveBeenCalledWith(
      "/trashPickup/getRouteDetails",
      {
        county: "Dublin",
        pickup_day: "Monday",
      }
    ));
  });

  test("renders the route links correctly", async () => {
    const mockData = [
      {
        route_name: "Route 1",
        county: "Dublin",
        place_pickup_times: [
          { place: "Place 1", pickup_time: "08:00" },
          { place: "Place 2", pickup_time: "09:00" },
        ],
        num_stops: 2,
      },
    ];

    authenticatedPost.mockResolvedValue(mockData);

    render(
      <Router>
        <Waste />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Select day/i), { target: { value: "Monday" } });
    fireEvent.change(screen.getByLabelText(/Select county/i), { target: { value: "Dublin" } });

    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => screen.getByText(/Route 1/i));

    // Check if the Link component is rendered correctly
    expect(screen.getByText(/Route 1/i)).toHaveAttribute(
      "href",
      "/wasteroutes/Route 1"
    );
  });
});

