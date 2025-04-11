import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Weather from "../pages/Weather";

// Ensure mocks are set up before any imports that might trigger module resolution
beforeAll(() => {
  // Mock CSS import to prevent Jest from failing on leaflet.css
  jest.mock("leaflet/dist/leaflet.css", () => ({}));
});

// Mock react-leaflet components to avoid ESM parsing issues
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));

// Mock the utility functions with implementations
jest.mock("../../../../shared/utils/weather-map/getStations.ts", () => ({
  getStations: jest.fn(),
}));
jest.mock("../../../../shared/utils/weather-map/getStationAqi.ts", () => ({
  getStationAqi: jest.fn(),
}));
jest.mock("../../../../shared/utils/weather-map/getWeatherDetails.ts", () => ({
  getWeatherDetails: jest.fn(),
}));

// Mock the MarkerIcon component
jest.mock("../../../../shared/components/weather-map/MarkerIcon.tsx", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="marker-icon">Mock MarkerIcon</div>),
}));

// Mock the Dropdown component to simulate menu item clicks
jest.mock("../components/dropdown.tsx", () => ({
  __esModule: true,
  default: jest.fn(({ menuItemTitles, menuItemFunctions }) => (
    <div data-testid="dropdown">
      {menuItemTitles.map((title, index) => (
        <button
          key={title}
          data-testid={`menu-item-${title}`}
          onClick={menuItemFunctions[index]}
        >
          {title}
        </button>
      ))}
    </div>
  )),
}));

describe("Weather Component", () => {
  beforeEach(() => {
    // Mock the return values of the utility functions
    const getStations = require("../../../../shared/utils/weather-map/getStations.ts").getStations;
    const getStationAqi = require("../../../../shared/utils/weather-map/getStationAqi.ts").getStationAqi;
    const getWeatherDetails = require("../../../../shared/utils/weather-map/getWeatherDetails.ts").getWeatherDetails;

    getStations.mockResolvedValue([
      { id: 1, lat: 53.338252, lon: -6.280805 },
      { id: 2, lat: 53.350000, lon: -6.300000 },
    ]);
    getStationAqi.mockResolvedValue("50");
    getWeatherDetails.mockResolvedValue({
      temp_c: 22,
      feelslike_c: 20,
      wind_kph: 15,
      humidity: 60,
      dewpoint_c: 10, // Added to match humidity case in markerDataDisplay
      precip_mm: 1.5,
      uv: 5,
    });
  });

  it("renders the Weather component and fetches stations", async () => {
    render(<Weather />);

    // Wait for the data to load and for the components to be displayed
    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
      expect(screen.getByTestId("map")).toBeInTheDocument();
      expect(screen.getAllByTestId("marker-icon")).toHaveLength(2); // Two stations
      expect(screen.getAllByTestId("popup")).toHaveLength(2); // Two popups
    });

    // Check that the weather data is displayed in the marker popups
    await waitFor(() => {
      expect(screen.getByText("Weather Station ID: 1")).toBeInTheDocument();
      expect(screen.getByText("Weather Station ID: 2")).toBeInTheDocument();
      const aqiElements = screen.getAllByText("AQI: 50");
      expect(aqiElements).toHaveLength(2); // One per station
    });
  });

  it("displays weather data for selected data type", async () => {
    render(<Weather />);

    // Wait for the dropdown to load
    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    });

    // Initially, AQI should be displayed
    await waitFor(() => {
      expect(screen.getAllByText("AQI: 50")).toHaveLength(2);
    });

    // Simulate clicking the "Temperature" menu item
    const temperatureButton = screen.getByTestId("menu-item-Temperature");
    await userEvent.click(temperatureButton);

    // Check if the temperature data is displayed for both stations
    await waitFor(() => {
      const tempElements = screen.getAllByText("Temperature: 22°C");
      expect(tempElements).toHaveLength(2); // One per station
      const feelsLikeElements = screen.getAllByText("Feels Like: 20°C");
      expect(feelsLikeElements).toHaveLength(2); // One per station
    });
  });
});