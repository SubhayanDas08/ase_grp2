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
  Link: ({ children, to, ...props }: { children: React.ReactNode, to: string, [key: string]: any }) => <a href={to} {...props}>{children}</a>,
}));

describe("Waste Component", () => {
  beforeEach(() => {
    // Reset mock before each test
    (authenticatedPost as jest.Mock).mockReset();
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
    (authenticatedPost as jest.Mock).mockResolvedValue(mockData);

    render(
      <Router>
        <Waste />
      </Router>
    );

    // Select day and county using getByRole('combobox')
    const daySelect = screen.getAllByRole("combobox")[0];
    const countySelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(daySelect, { target: { value: "Monday" } });
    fireEvent.change(countySelect, { target: { value: "Dublin" } });

    // Click the search button
    fireEvent.click(screen.getByText(/Search/i));

    // Wait for the API call to finish
    await waitFor(() => {
      expect(authenticatedPost).toHaveBeenCalledWith(
        "/trashPickup/getRouteDetails",
        {
          county: "Dublin",
          pickup_day: "Monday",
        }
      );
    });
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

    (authenticatedPost as jest.Mock).mockResolvedValue(mockData);

    render(
      <Router>
        <Waste />
      </Router>
    );

    // Select day and county using getByRole('combobox')
    const daySelect = screen.getAllByRole("combobox")[0];
    const countySelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(daySelect, { target: { value: "Monday" } });
    fireEvent.change(countySelect, { target: { value: "Dublin" } });

    fireEvent.click(screen.getByText(/Search/i));

    // Wait for the link to be fully rendered
    await waitFor(() => {
      const routeLink = screen.getByRole("link", { name: /Route 1/i });
      expect(routeLink).toBeInTheDocument();
    });

    // Check if the Link component is rendered correctly
    const routeLink = screen.getByRole("link", { name: /Route 1/i });
    expect(routeLink).toHaveAttribute("href", "/wasteroutes/Route 1");
  });
});