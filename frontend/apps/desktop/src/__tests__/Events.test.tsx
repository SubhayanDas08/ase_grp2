import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Events from "../pages/Events"; // Matches your import
import { authenticatedGet } from "../utils/auth";

// Mock external dependencies
jest.mock("../utils/auth", () => ({
  authenticatedGet: jest.fn(),
}));

jest.mock("react-icons/fa", () => ({
  FaBolt: () => <span data-testid="bolt-icon" />,
  FaMapMarkerAlt: () => <span data-testid="marker-icon" />,
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

describe("Events Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title and no events initially", () => {
    renderWithRouter(<Events permissions={[]} />);
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.queryByText("Test Event")).not.toBeInTheDocument();
  });

  it("shows 'Add Event' button when user has manage_events permission", () => {
    renderWithRouter(<Events permissions={["manage_events"]} />);
    expect(screen.getByText("Add Event")).toBeInTheDocument();
  });

  it("hides 'Add Event' button when user lacks manage_events permission", () => {
    renderWithRouter(<Events permissions={[]} />);
    expect(screen.queryByText("Add Event")).not.toBeInTheDocument();
  });

  it("fetches and displays upcoming events", async () => {
    const mockEvents = [
      {
        id: 1,
        name: "Test Event",
        event_date: "2025-04-15",
        event_time: "14:00",
        location: "123 Main St",
        area: "Downtown",
        description: "A test event",
      },
      {
        id: 2,
        name: "Past Event",
        event_date: "2024-01-01",
        event_time: "10:00",
        location: "456 Elm St",
        area: "Uptown",
        description: "A past event",
      },
    ];

    (authenticatedGet as jest.Mock).mockResolvedValueOnce(mockEvents);

    renderWithRouter(<Events permissions={[]} />);

    await waitFor(() => {
      expect(screen.getByText("Test Event")).toBeInTheDocument();
      expect(screen.queryByText("Past Event")).not.toBeInTheDocument(); // Filtered out
      expect(screen.getByText("A test event")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("Apr 15, 2025")).toBeInTheDocument(); // Date format may vary
      expect(screen.getByText("14:00")).toBeInTheDocument();
      expect(authenticatedGet).toHaveBeenCalledWith("/events/");
    });
  });

  it("handles fetch error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (authenticatedGet as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    renderWithRouter(<Events permissions={[]} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching events",
        expect.any(Error)
      );
      expect(screen.queryByText("Test Event")).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("navigates to event details when clicking an event card", async () => {
    const mockEvents = [
      {
        id: 1,
        name: "Test Event",
        event_date: "2025-04-15",
        event_time: "14:00",
        location: "123 Main St",
        area: "Downtown",
        description: "A test event",
      },
    ];

    (authenticatedGet as jest.Mock).mockResolvedValueOnce(mockEvents);

    renderWithRouter(<Events permissions={[]} />);

    await waitFor(() => {
      const eventCard = screen.getByText("Test Event");
      fireEvent.click(eventCard);
      expect(mockNavigate).toHaveBeenCalledWith("/events/view/1");
    });
  });

  it("navigates to add event page when clicking 'Add Event'", () => {
    renderWithRouter(<Events permissions={["manage_events"]} />);
    const addEventButton = screen.getByText("Add Event");
    fireEvent.click(addEventButton);
    expect(mockNavigate).toHaveBeenCalledWith("/events/add");
  });
});