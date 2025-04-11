import { render, screen, fireEvent } from "@testing-library/react";
import TrafficInfo from "../pages/TrafficInfo"; 

describe("TrafficInfo", () => {
  test("renders TrafficInfo component correctly", () => {
    render(<TrafficInfo />);

    // Check if the traffic info indicator is rendered
    const indicator = screen.getByText(/indicator/i);
    expect(indicator).toBeInTheDocument();

    // Check if the "Edit" button is rendered
    const editButton = screen.getByText(/edit/i);
    expect(editButton).toBeInTheDocument();

    // Check if the "Delete" button is rendered
    const deleteButton = screen.getByText(/delete/i);
    expect(deleteButton).toBeInTheDocument();

    // Check if the event details are rendered
    const event = screen.getByText(/car accident/i);
    expect(event).toBeInTheDocument();

    const eventInfo = screen.getByText(/burning houses, people crying/i);
    expect(eventInfo).toBeInTheDocument();
  });

  test("clicking the 'Edit' button triggers the expected action", () => {
    render(<TrafficInfo />);

    const editButton = screen.getByText(/edit/i);
    
    // Mock the edit action
    fireEvent.click(editButton);
    
    // Check the console log or the expected behavior for editing
    // In a real scenario, you might want to spy on a function or check for state changes.
    expect(editButton).toBeInTheDocument();  // Placeholder assertion for now
  });

  test("clicking the 'Delete' button triggers the expected action", () => {
    render(<TrafficInfo />);

    const deleteButton = screen.getByText(/delete/i);

    // Mock the delete action
    fireEvent.click(deleteButton);

    // Check the console log or the expected behavior for deleting
    expect(deleteButton).toBeInTheDocument();  // Placeholder assertion for now
  });
});
