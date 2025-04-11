import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Weather from "../pages/Weather";

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
      expect(screen.getByTestId("marker-icon")).toBeInTheDocument();
      expect(screen.getByTestId("popup")).toBeInTheDocument();
    });

    // Check that the weather data is displayed in the marker popup
    await waitFor(() => {
      expect(screen.getByText("Weather Station ID: 1")).toBeInTheDocument();
      expect(screen.getByText("AQI: 50")).toBeInTheDocument();
    });
  });

  it("displays weather data for selected data type", async () => {
    render(<Weather />);

    // Wait for the dropdown to load
    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    });

    // Simulate clicking the "Temperature" menu item
    const temperatureButton = screen.getByTestId("menu-item-Temperature");
    await userEvent.click(temperatureButton);

    // Check if the temperature data is displayed
    await waitFor(() => {
      expect(screen.getByText("Temperature: 22°C")).toBeInTheDocument();
      expect(screen.getByText("Feels Like: 20°C")).toBeInTheDocument();
    });
  });
});
