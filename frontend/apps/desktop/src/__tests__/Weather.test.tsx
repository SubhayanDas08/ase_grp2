import { render, screen, waitFor } from "@testing-library/react";
import Weather from "../pages/Weather";
import { getStations } from "../../../../shared/utils/weather-map/getStations.ts";
import { getStationAqi } from "../../../../shared/utils/weather-map/getStationAqi.ts";
import { getWeatherDetails } from "../../../../shared/utils/weather-map/getWeatherDetails.ts";

// Mock the functions
jest.mock("../../../../shared/utils/weather-map/getStations.ts");
jest.mock("../../../../shared/utils/weather-map/getStationAqi.ts");
jest.mock("../../../../shared/utils/weather-map/getWeatherDetails.ts");

// Mock the MarkerIcon and Dropdown components
jest.mock("../../../../shared/components/weather-map/MarkerIcon.tsx", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mock MarkerIcon</div>),
}));

jest.mock("../components/dropdown.tsx", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mock Dropdown</div>),
}));

describe("Weather Component", () => {
  beforeEach(() => {
    // Mock the return values of the functions
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

    // Wait for the data to load and for the markers to be displayed
    await waitFor(() => screen.getByText("Mock Dropdown"));

    // Check if the dropdown and markers are rendered
    expect(screen.getByText("Mock Dropdown")).toBeInTheDocument();
    expect(screen.getByText("Mock MarkerIcon")).toBeInTheDocument();

    // Check that the weather data is displayed in the marker popup
    await waitFor(() => screen.getByText("Weather Station ID: 1"));
    expect(screen.getByText("Weather Station ID: 1")).toBeInTheDocument();
    expect(screen.getByText("Temperature: 22°C")).toBeInTheDocument();
    expect(screen.getByText("Wind Speed: 15 km/h")).toBeInTheDocument();
  });

  it("displays weather data for selected data type", async () => {
    render(<Weather />);

    // Wait for the data to load
    await waitFor(() => screen.getByText("Mock Dropdown"));

    // Simulate a change in weather data type to "temp"
    const menuItem = screen.getByText("Temperature");
    menuItem.click();

    // Check if the correct weather data is displayed
    expect(screen.getByText("Temperature: 22°C")).toBeInTheDocument();
    expect(screen.getByText("Feels Like: 20°C")).toBeInTheDocument();
  });
});
