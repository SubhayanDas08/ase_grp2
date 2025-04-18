import { render, screen, waitFor } from "@testing-library/react";
import HeatmapPage from "../pages/BusCongestionHeatmap"; 
import { authenticatedGet } from "../utils/auth";
import { ReactNode } from "react";

// Mock external dependencies
jest.mock("../utils/auth", () => ({
  authenticatedGet: jest.fn(),
}));

interface MapContainerProps {
  children: ReactNode;
}

interface HeatmapLayerProps {
  points: { lat: number; lng: number }[];
}

jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }: MapContainerProps) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
}));

jest.mock("react-leaflet-heatmap-layer", () => {
  return function MockHeatmapLayer({ points }: HeatmapLayerProps) {
    return <div data-testid="heatmap-layer" data-points={JSON.stringify(points)} />;
  };
});

describe("HeatmapPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all map components", () => {
    render(<HeatmapPage />);
    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
    expect(screen.getByTestId("heatmap-layer")).toBeInTheDocument();
  });

  it("fetches and displays bus positions successfully", async () => {
    const mockBusData = {
      buses: {
        Vehicles: [
          { latitude: 53.35, longitude: -6.26 },
          { latitude: 53.36, longitude: -6.27 },
        ]
      }
    };

    (authenticatedGet as jest.Mock).mockResolvedValueOnce(mockBusData);

    render(<HeatmapPage />);

    await waitFor(async () => {
      const layers = screen.getAllByTestId("heatmap-layer");
      const heatmapLayer = layers[layers.length - 1];
      const points = JSON.parse(heatmapLayer.getAttribute("data-points") || '[]');
      expect(points).toHaveLength(2);
      expect(points[0]).toEqual({ lat: 53.35, lng: -6.26 });
      expect(points[1]).toEqual({ lat: 53.36, lng: -6.27 });
      expect(authenticatedGet).toHaveBeenCalledWith("/heatmap");
    });
  });

  it("handles fetch error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    (authenticatedGet as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(<HeatmapPage />);

    await waitFor(async () => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to load heatmap data",
        expect.any(Error)
      );
      const layers = screen.getAllByTestId("heatmap-layer");
      const heatmapLayer = layers[layers.length - 1];
      const points = JSON.parse(heatmapLayer.getAttribute("data-points") || '[]');
      expect(points).toHaveLength(0);
    });

    consoleErrorSpy.mockRestore();
  });
});