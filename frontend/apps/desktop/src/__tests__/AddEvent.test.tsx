import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddEvent from "../pages/AddEvent"; // Adjust the path as needed
import { authenticatedPost } from "../utils/auth";

// Mock external dependencies
jest.mock("../utils/auth", () => ({
  authenticatedPost: jest.fn(),
}));

jest.mock("react-datepicker", () => {
  const MockDatePicker = ({ onChange, selected, placeholderText, className }: any) => (
    <input
      type="text"
      value={selected ? selected.toISOString().split("T")[0] : ""}
      onChange={(e) => onChange(new Date(e.target.value))}
      placeholder={placeholderText}
      className={className}
      data-testid="datepicker"
    />
  );
  return MockDatePicker;
});

jest.mock("@react-google-maps/api", () => ({
  LoadScript: ({ children }: any) => <div>{children}</div>,
  Autocomplete: ({ onLoad, onPlaceChanged, children }: any) => {
    return (
      <div>
        {children}
        <button
          data-testid="mock-autocomplete"
          onClick={() => {
            onLoad({
              getPlace: () => ({
                formatted_address: "123 Main St, Dublin, IE",
                address_components: [
                  { types: ["neighborhood"], long_name: "Downtown" },
                ],
              }),
            });
            onPlaceChanged();
          }}
        >
          Mock Place Select
        </button>
      </div>
    );
  },
}));

// Helper to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("AddEvent Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(<AddEvent />);
  });

  // Test 1: Renders all input fields and UI elements
  it("renders all input fields and UI elements", () => {
    expect(screen.getByPlaceholderText("Add Name of the Event")).toBeInTheDocument();
    expect(screen.getByTestId("datepicker")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Select Date of the Event")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10:00")).toBeInTheDocument(); // Default time
    expect(screen.getByPlaceholderText("Search Location")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Area")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add Description")).toBeInTheDocument();
    expect(screen.getByText("Add Event")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  // Test 2: Shows alert when submitting with empty fields
  it("shows an alert when submitting with empty fields", () => {
    window.alert = jest.fn();
    fireEvent.click(screen.getByText("Add Event"));

    expect(window.alert).toHaveBeenCalledWith("Fill all the details!");
    expect(authenticatedPost).not.toHaveBeenCalled();
  });

  // Test 3: Submits successfully when all fields are filled
  it("submits the form successfully when all fields are filled", async () => {
    (authenticatedPost as jest.Mock).mockResolvedValueOnce({ success: true });

    // Fill in all fields
    fireEvent.change(screen.getByPlaceholderText("Add Name of the Event"), {
      target: { value: "Community Cleanup" },
    });
    fireEvent.change(screen.getByTestId("datepicker"), {
      target: { value: "2025-04-15" },
    });
    fireEvent.change(screen.getByDisplayValue("10:00"), {
      target: { value: "14:00" },
    });
    fireEvent.change(screen.getByPlaceholderText("Search Location"), {
      target: { value: "123 Main St, Dublin, IE" },
    });
    fireEvent.click(screen.getByTestId("mock-autocomplete")); // Simulate place selection
    fireEvent.change(screen.getByPlaceholderText("Add Description"), {
      target: { value: "A community cleanup event." },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Event"));

    // Wait for async operations
    await waitFor(() => {
      expect(authenticatedPost).toHaveBeenCalledWith("/events/create", {
        name: "Community Cleanup",
        event_date: expect.any(Date), // Date object from "2025-04-15"
        event_time: "14:00",
        location: "123 Main St, Dublin, IE",
        area: "Downtown",
        description: "A community cleanup event.",
      });
    });
  });

  // Test 4: Handles error during submission
  it("shows an alert when submission fails", async () => {
    (authenticatedPost as jest.Mock).mockRejectedValueOnce(new Error("Server error"));
    window.alert = jest.fn();

    // Fill in all fields
    fireEvent.change(screen.getByPlaceholderText("Add Name of the Event"), {
      target: { value: "Community Cleanup" },
    });
    fireEvent.change(screen.getByTestId("datepicker"), {
      target: { value: "2025-04-15" },
    });
    fireEvent.change(screen.getByDisplayValue("10:00"), {
      target: { value: "14:00" },
    });
    fireEvent.change(screen.getByPlaceholderText("Search Location"), {
      target: { value: "123 Main St, Dublin, IE" },
    });
    fireEvent.click(screen.getByTestId("mock-autocomplete")); // Simulate place selection
    fireEvent.change(screen.getByPlaceholderText("Add Description"), {
      target: { value: "A community cleanup event." },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Event"));

    // Wait for async operations
    await waitFor(() => {
      expect(authenticatedPost).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        "Something went wrong while saving the event."
      );
    });
  });

  // Test 5: Updates location and area with Autocomplete
  it("updates location and area when a place is selected via Autocomplete", () => {
    const locationInput = screen.getByPlaceholderText("Search Location");
    const areaInput = screen.getByPlaceholderText("Area");

    // Initially empty
    expect(locationInput).toHaveValue("");
    expect(areaInput).toHaveValue("");

    // Simulate selecting a place
    fireEvent.click(screen.getByTestId("mock-autocomplete"));

    // Check if fields are updated
    expect(locationInput).toHaveValue("123 Main St, Dublin, IE");
    expect(areaInput).toHaveValue("Downtown");
  });

  // Test 6: Navigates back to /events when clicking 'Events'
  it("navigates to /events when clicking the Events link", () => {
    const eventsLink = screen.getByText("Events");
    fireEvent.click(eventsLink);

    // Check navigation (you'd typically mock useNavigate for this)
    // Since we're using BrowserRouter, we can check the window location with a mock
    expect(window.location.pathname).toBe("/events/");
  });
});