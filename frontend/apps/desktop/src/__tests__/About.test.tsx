import { render, screen, fireEvent } from "@testing-library/react";
import About from "../pages/About"; // Adjust path as needed
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("About Page", () => {
  const mockSetUserAuthenticated = jest.fn();

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <About setUserAuthenticated={mockSetUserAuthenticated} />
      </MemoryRouter>
    );
  };

  it("renders the About page with title and description", () => {
    renderComponent();

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText(">")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();

    expect(
      screen.getByText(/This application has been developed by Team 2/i)
    ).toBeInTheDocument();
  });

  it("displays all team members", () => {
    renderComponent();

    const teamMembers = [
      "Abhigyan Khaund",
      "Adrieja Bhowmick",
      "Agathe Mignot",
      "Akshit Saini",
      "Boris Stavisky",
      "Kartik Tola",
      "Sibin George",
      "Simon Walter",
      "Subhayan Das",
    ];

    teamMembers.forEach((member) => {
      expect(screen.getByText(member)).toBeInTheDocument();
    });
  });

  it("navigates to settings when 'Settings' is clicked", () => {
    renderComponent();

    const settingsLink = screen.getByText("Settings");
    fireEvent.click(settingsLink);

    expect(mockNavigate).toHaveBeenCalledWith("/settings/");
  });
});