import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FleetSize from "../pages/FleetSize"; // Adjust path as needed
import { authenticatedPost } from "../utils/auth";

// Mock external dependencies
jest.mock("../utils/auth", () => ({
  authenticatedPost: jest.fn(),
}));

jest.mock("react-icons/fa", () => ({
  FaBolt: () => <span data-testid="bolt-icon" />,
}));

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Mock Date to ensure consistent test behavior
const mockDate = new Date("2025-04-10T00:00:00Z"); // Matches your current date
jest.useFakeTimers().setSystemTime(mockDate);

describe("FleetSize Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Renders the component with title and initial state
  it("renders the title and initial state", () => {
    renderWithRouter(<FleetSize />);
    expect(screen.getByText("Fleet Size Recommendation")).toBeInTheDocument();
    expect(screen.getByText("Select Month")).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument(); // Empty year input
    expect(screen.getByText("View Recommendation")).toBeInTheDocument();
    expect(screen.queryByText("Dublin Bus")).not.toBeInTheDocument(); // No recommendations yet
  });

  // Test 2: Updates year and days when month is selected
  it("updates year and days when month is selected", () => {
    renderWithRouter(<FleetSize />);
    const monthSelect = screen.getByRole("combobox");
    
    // Select a month before current (should set next year)
    fireEvent.change(monthSelect, { target: { value: "January" } });
    expect(screen.getByDisplayValue("2026")).toBeInTheDocument(); // Next year
    
    // Select a month after current (should set current year)
    fireEvent.change(monthSelect, { target: { value: "May" } });
    expect(screen.getByDisplayValue("2025")).toBeInTheDocument(); // Current year
  });

  // Test 3: Shows alert when fetching recommendations without month
  it("shows alert when fetching recommendations without month", () => {
    window.alert = jest.fn();
    renderWithRouter(<FleetSize />);
    const viewButton = screen.getByText("View Recommendation");
    fireEvent.click(viewButton);
    expect(window.alert).toHaveBeenCalledWith("Please select a month to view recommendations.");
    expect(authenticatedPost).not.toHaveBeenCalled();
  });

  // Test 4: Fetches and displays recommendations successfully
  it("fetches and displays recommendations successfully", async () => {
    const mockResponse = {
      recommendations: [
        { "Bus City Services": "Dublin Bus", "Recommended Buses": 550 },
        { "Bus City Services": "Cork city", "Recommended Buses": 120 },
      ],
      dialogue: "Based on projected demand, adjust fleet sizes accordingly.",
    };

    (authenticatedPost as jest.Mock).mockResolvedValueOnce(mockResponse);

    renderWithRouter(<FleetSize />);
    const monthSelect = screen.getByRole("combobox");
    fireEvent.change(monthSelect, { target: { value: "May" } });
    const viewButton = screen.getByText("View Recommendation");
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByText("Dublin Bus")).toBeInTheDocument();
      expect(screen.getByText("Current Fleet Size: 501")).toBeInTheDocument();
      expect(screen.getByText("Recommended Fleet Size: 550")).toBeInTheDocument();
      expect(screen.getByText("Cork city")).toBeInTheDocument();
      expect(screen.getByText("Current Fleet Size: 115")).toBeInTheDocument();
      expect(screen.getByText("Recommended Fleet Size: 120")).toBeInTheDocument();
      expect(screen.getByText("Based on projected demand, adjust fleet sizes accordingly.")).toBeInTheDocument();
      expect(authenticatedPost).toHaveBeenCalledWith(
        "/recommend/fleetsize",
        { month: 5 },
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  // Test 5: Handles fetch error gracefully
  it("handles fetch error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    window.alert = jest.fn();
    (authenticatedPost as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    renderWithRouter(<FleetSize />);
    const monthSelect = screen.getByRole("combobox");
    fireEvent.change(monthSelect, { target: { value: "May" } });
    const viewButton = screen.getByText("View Recommendation");
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching recommendations:", expect.any(Error));
      expect(window.alert).toHaveBeenCalledWith("Failed to fetch recommendations. Please try again.");
      expect(screen.queryByText("Dublin Bus")).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });
});