import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import ViewEvent from "../pages/ViewEvent";

// Mock the axios calls
jest.mock("axios");

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

  test("renders event details correctly", async () => {
    // Mock axios response for the GET request
    axios.get.mockResolvedValueOnce({ data: mockEvent });

    render(
      <Router>
        <ViewEvent permissions={permissions} />
      </Router>
    );

    // Wait for event data to load
    await waitFor(() => screen.getByText(/Sample Event/i));

    // Check if event details are displayed correctly
    expect(screen.getByText(/Sample Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample Area/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample event description/i)).toBeInTheDocument();
  });

  test("handles delete event button click", async () => {
    // Mock axios response for the GET request and DELETE request
    axios.get.mockResolvedValueOnce({ data: mockEvent });
    axios.delete.mockResolvedValueOnce({});

    render(
      <Router>
        <ViewEvent permissions={permissions} />
      </Router>
    );

    // Wait for event data to load
    await waitFor(() => screen.getByText(/Sample Event/i));

    // Simulate clicking the "Delete Event" button
    const deleteButton = screen.getByText(/Delete Event/i);
    fireEvent.click(deleteButton);

    // Ensure axios.delete was called with the correct URL
    expect(axios.delete).toHaveBeenCalledWith("/events/delete/undefined"); // Make sure the URL is correct
  });

  test("does not display delete button if user does not have permissions", async () => {
    // Mock axios response for the GET request
    axios.get.mockResolvedValueOnce({ data: mockEvent });

    const noPermissions = [];

    render(
      <Router>
        <ViewEvent permissions={noPermissions} />
      </Router>
    );

    // Wait for event data to load
    await waitFor(() => screen.getByText(/Sample Event/i));

    // Check that the "Delete Event" button is not rendered
    const deleteButton = screen.queryByText(/Delete Event/i);
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("displays an alert if deleting the event fails", async () => {
    // Mock axios response for the GET request
    axios.get.mockResolvedValueOnce({ data: mockEvent });
    axios.delete.mockRejectedValueOnce(new Error("Failed to delete"));

    render(
      <Router>
        <ViewEvent permissions={permissions} />
      </Router>
    );

    // Wait for event data to load
    await waitFor(() => screen.getByText(/Sample Event/i));

    // Simulate clicking the "Delete Event" button
    const deleteButton = screen.getByText(/Delete Event/i);
    fireEvent.click(deleteButton);

    // Check if an alert is displayed
    expect(window.alert).toHaveBeenCalledWith("Failed to delete event. Please try again.");
  });
});
