import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ViewEvent from "../pages/ViewEvent";

// Mock the auth utilities instead of axios
jest.mock("../utils/auth", () => ({
  authenticatedGet: jest.fn(),
  authenticatedDelete: jest.fn(),
}));

// Mock useParams and useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }), // Mock event ID
  useNavigate: () => jest.fn(), // Mock navigate function
}));

describe("ViewEvent", () => {
  const mockEvent = {
    name: "Sample Event",
    event_date: "2025-04-01",
    event_time: "14:00",
    location: "Sample Location",
    area: "Sample Area",
    description: "Sample event description",
  };

  const permissions = ["manage_events"];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Mock window.alert
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders event details correctly", async () => {
    // Mock authenticatedGet response
    const { authenticatedGet } = require("../utils/auth");
    authenticatedGet.mockResolvedValueOnce(mockEvent);

    render(
      <Router>
        <ViewEvent permissions={permissions} />
      </Router>
    );

    // Wait for event data to load, targeting the event name specifically
    await waitFor(() => {
      const eventNames = screen.getAllByText(/Sample Event/i);
      expect(eventNames[0]).toBeInTheDocument(); // First match is the event name
    });

    // Check if event details are displayed correctly
    expect(screen.getAllByText(/Sample Event/i)[0]).toBeInTheDocument(); // Event name
    expect(screen.getByText(/Sample Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample Area/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample event description/i)).toBeInTheDocument();
    expect(screen.getByText("4/1/2025")).toBeInTheDocument(); // Date
    expect(screen.getByText("03:00 PM")).toBeInTheDocument(); // Time
  });

  test("handles delete event button click", async () => {
    // Mock authenticatedGet and authenticatedDelete responses
    const { authenticatedGet, authenticatedDelete } = require("../utils/auth");
    authenticatedGet.mockResolvedValueOnce(mockEvent);
    authenticatedDelete.mockResolvedValueOnce({});

    render(
      <Router>
        <ViewEvent permissions={permissions} />
      </Router>
    );

    // Wait for event data to load
    await waitFor(() => {
      const eventNames = screen.getAllByText(/Sample Event/i);
      expect(eventNames[0]).toBeInTheDocument();
    });

    // Simulate clicking the "Delete Event" button
    const deleteButton = screen.getByText(/Delete Event/i);
    fireEvent.click(deleteButton);

    // Ensure authenticatedDelete was called with the correct URL
    await waitFor(() => {
      expect(authenticatedDelete).toHaveBeenCalledWith("/events/delete/1");
    });
  });

  test("does not display delete button if user does not have permissions", async () => {
    // Mock authenticatedGet response
    const { authenticatedGet } = require("../utils/auth");
    authenticatedGet.mockResolvedValueOnce(mockEvent);

    const noPermissions: string[] = [];

    render(
      <Router>
        <ViewEvent permissions={noPermissions} />
      </Router>
    );

    // Wait for event data to load
    await waitFor(() => {
      const eventNames = screen.getAllByText(/Sample Event/i);
      expect(eventNames[0]).toBeInTheDocument();
    });

    // Check that the "Delete Event" button is not rendered
    const deleteButton = screen.queryByText(/Delete Event/i);
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("displays an alert if deleting the event fails", async () => {
    // Mock authenticatedGet and authenticatedDelete responses
    const { authenticatedGet, authenticatedDelete } = require("../utils/auth");
    authenticatedGet.mockResolvedValueOnce(mockEvent);
    authenticatedDelete.mockRejectedValueOnce(new Error("Failed to delete"));

    render(
      <Router>
        <ViewEvent permissions={permissions} />
      </Router>
    );

    // Wait for event data to load
    await waitFor(() => {
      const eventNames = screen.getAllByText(/Sample Event/i);
      expect(eventNames[0]).toBeInTheDocument();
    });

    // Simulate clicking the "Delete Event" button
    const deleteButton = screen.getByText(/Delete Event/i);
    fireEvent.click(deleteButton);

    // Check if an alert is displayed
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to delete event. Please try again.");
    });
  });
});