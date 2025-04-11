import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Weather from "../pages/Weather";

// Mock leaflet.css to avoid CSS import error
jest.mock("leaflet/dist/leaflet.css", () => ({}));

// Mock react-leaflet components
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker">
      {/* You can render MarkerIcon here if needed */}
      {children}
    </div>
  ),
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>,
}));

// Mock weather utility functions
jest.mock("../../../../shared/utils/weather-map/getStations.ts", () => ({
  getStations: jest.fn(),
}));
jest.mock("../../../../shared/utils/weather-map/getStationAqi.ts", () => ({
  getStationAqi: jest.fn(),
}));
jest.mock("../../../../shared/utils/weather-map/getWeatherDetails.ts", () => ({
  getWeatherDetails: jest.fn(),
}));

// Mock MarkerIcon (not currently rendered in this test, but available)
jest.mock("../../../../shared/components/weather-map/MarkerIcon.tsx", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="marker-icon">Mock MarkerIcon</div>),
}));

// Mock dropdown component
jest.mock("../components/dropdown.tsx", () => ({
  __esModule: true,
  default: jest.fn(({ menuItemTitles, menuItemFunctions }) => (
    <div data-testid="dropdown">
      {menuItemTitles.map((title: string, index: number) => (
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
    // Setup resolved values
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
      dewpoint_c: 10,
      precip_mm: 1.5,
      uv: 5,
    });
  });

  it("renders the Weather component and fetches stations", async () => {
    render(<Weather />);

    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
      expect(screen.getByTestId("map")).toBeInTheDocument();
      expect(screen.getAllByTestId("marker")).toHaveLength(2);
      expect(screen.getAllByTestId("popup")).toHaveLength(2);
    });

    await waitFor(() => {
      expect(screen.getByText("Weather Station ID: 1")).toBeInTheDocument();
      expect(screen.getByText("Weather Station ID: 2")).toBeInTheDocument();
      const aqiElements = screen.getAllByText("AQI: 50");
      expect(aqiElements).toHaveLength(2);
    });
  });

  it("displays weather data for selected data type", async () => {
    render(<Weather />);

    await waitFor(() => {
      expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText("AQI: 50")).toHaveLength(2);
    });

    const temperatureButton = screen.getByTestId("menu-item-Temperature");
    await userEvent.click(temperatureButton);

    await waitFor(() => {
      const tempElements = screen.getAllByText("Temperature: 22°C");
      expect(tempElements).toHaveLength(2);
      const feelsLikeElements = screen.getAllByText("Feels Like: 20°C");
      expect(feelsLikeElements).toHaveLength(2);
    });
  });
});