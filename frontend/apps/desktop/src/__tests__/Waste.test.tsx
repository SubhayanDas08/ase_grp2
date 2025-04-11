import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Waste from "../pages/Waste";
import { authenticatedPost } from "../utils/auth";
import { BrowserRouter } from "react-router-dom";

// Mock the authenticatedPost function
jest.mock("../utils/auth", () => ({
  authenticatedPost: jest.fn(),
}));

// Helper to wrap in Router for <Link> support
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Waste Component", () => {
  const mockRoutes = [
    {
      route_id: "1",
      route_name: "North Route",
      county: "Dublin",
      pickup_day: "Monday",
      place_pickup_times: [
        { place: "Phoenix Park", pickup_time: "10:00" },
        { place: "Temple Bar", pickup_time: "11:30" },
      ],
      num_stops: 2,
    },
  ];

  it("renders day and county dropdowns and search button", () => {
    renderWithRouter(<Waste />);
    expect(screen.getByText("Select day")).toBeInTheDocument();
    expect(screen.getByText("Select county")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("updates selected day and county when changed", () => {
    renderWithRouter(<Waste />);

    const selects = screen.getAllByRole("combobox");
    const daySelect = selects[0];
    const countySelect = selects[1];

    fireEvent.change(daySelect, { target: { value: "Monday" } });
    fireEvent.change(countySelect, { target: { value: "Dublin" } });

    expect((daySelect as HTMLSelectElement).value).toBe("Monday");
    expect((countySelect as HTMLSelectElement).value).toBe("Dublin");
  });

  it("fetches and displays routes after clicking search", async () => {
    (authenticatedPost as jest.Mock).mockResolvedValue(mockRoutes);
  
    renderWithRouter(<Waste />);
  
    const selects = screen.getAllByRole("combobox");
    const daySelect = selects[0];
    const countySelect = selects[1];
  
    fireEvent.change(daySelect, { target: { value: "Monday" } });
    fireEvent.change(countySelect, { target: { value: "Dublin" } });
  
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
  
    await waitFor(() => {
      expect(authenticatedPost).toHaveBeenCalledWith("/trashPickup/getRouteDetails", {
        county: "Dublin",
        pickup_day: "Monday",
      });
  
      expect(screen.getByText("North Route")).toBeInTheDocument();
      expect(screen.getByText("Dublin")).toBeInTheDocument();
      expect(screen.getByText(/Phoenix Park at 10:00/)).toBeInTheDocument();
      expect(screen.getByText(/Temple Bar at 11:30/)).toBeInTheDocument();
      expect(screen.getByText(/2 stops/)).toBeInTheDocument();
    });
  });  
});