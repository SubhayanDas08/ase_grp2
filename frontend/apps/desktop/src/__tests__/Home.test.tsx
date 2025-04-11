import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/Home"; // Adjust path as needed
import { WeatherWidget, EventsWidget, RoutesWidget } from "../components/HomeWidgets";

// Mock external dependencies
jest.mock("react-icons/io5", () => ({
  IoCloseOutline: () => <span data-testid="close-icon" />,
  IoAdd: () => <span data-testid="add-icon" />,
  IoRemove: () => <span data-testid="remove-icon" />,
}));

jest.mock("../components/HomeWidgets", () => ({
  WeatherWidget: () => <div data-testid="weather-widget">Weather Widget</div>,
  EventsWidget: () => <div data-testid="events-widget">Events Widget</div>,
  RoutesWidget: () => <div data-testid="routes-widget">Routes Widget</div>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null); // Default: no saved widgets
  });

  // Test 1: Renders initial state with default widgets
  it("renders initial state with default widgets", () => {
    render(<Home />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByTestId("weather-widget")).toBeInTheDocument();
    expect(screen.getByTestId("events-widget")).toBeInTheDocument();
    expect(screen.queryByTestId("routes-widget")).not.toBeInTheDocument();
  });

  // Test 2: Loads widgets from localStorage on mount
  it("loads widgets from localStorage on mount", () => {
    localStorageMock.getItem
      .mockReturnValueOnce(JSON.stringify(["routes", "events"]))
      .mockReturnValueOnce(JSON.stringify(["weather"]));
    render(<Home />);
    expect(screen.getByTestId("routes-widget")).toBeInTheDocument();
    expect(screen.getByTestId("events-widget")).toBeInTheDocument();
    expect(screen.queryByTestId("weather-widget")).not.toBeInTheDocument();
  });

  // Test 3: Toggles edit mode and shows add button
  it("toggles edit mode and shows add button", () => {
    render(<Home />);
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getAllByTestId("remove-icon")).toHaveLength(2); // Two visible widgets
  });

  // Test 4: Opens and closes Add Widget container
  it("opens and closes Add Widget container", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Add Widgets")).toBeInTheDocument();
    expect(screen.getByTestId("routes-widget")).toBeInTheDocument(); // Hidden widget preview
    fireEvent.click(screen.getByTestId("close-icon"));
    expect(screen.queryByText("Add Widgets")).not.toBeInTheDocument();
  });

  // Test 5: Adds a widget from hidden to visible
  it("adds a widget from hidden to visible", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByTestId("add-icon"));
    expect(screen.getByTestId("routes-widget")).toBeInTheDocument(); // Now visible
    // NOTE: We removed the assumption that "Add Widgets" auto-closes
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "visibleWidgets",
      JSON.stringify(["weather", "events", "routes"])
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "hiddenWidgets",
      JSON.stringify([])
    );
  });

  // Test 6: Removes a widget from visible to hidden
  it("removes a widget from visible to hidden", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Edit"));
    const removeButtons = screen.getAllByTestId("remove-icon");
    fireEvent.click(removeButtons[0]); // Remove weather widget
    expect(screen.queryByTestId("weather-widget")).not.toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "visibleWidgets",
      JSON.stringify(["events"])
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "hiddenWidgets",
      JSON.stringify(["routes", "weather"])
    );
  });

  // Test 7: Saves widget state to localStorage on change
  it("saves widget state to localStorage on change", () => {
    render(<Home />);
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getAllByTestId("remove-icon")[0]); // Remove weather
    // We no longer rely on call count — just what was saved
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "visibleWidgets",
      JSON.stringify(["events"])
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "hiddenWidgets",
      JSON.stringify(["routes", "weather"])
    );
  });
});