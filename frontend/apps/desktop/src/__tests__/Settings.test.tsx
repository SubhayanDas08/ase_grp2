import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "../pages/Settings";
import { BrowserRouter as Router } from "react-router-dom";
import * as authUtils from "../utils/auth"; // Importing the logout function to mock it

// Mock the necessary functions
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../utils/auth", () => ({
  logout: jest.fn(),
}));

describe("Settings Component", () => {
  const mockSetUserAuthenticated = jest.fn();
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    render(
      <Router>
        <Settings
          setUserAuthenticated={mockSetUserAuthenticated}
          onLogout={mockOnLogout}
        />
      </Router>
    );
  });

  it("renders correctly", () => {
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByText("Report an Issue")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  it("navigates to profile page when 'Profile' is clicked", () => {
    const navigate = require("react-router-dom").useNavigate();
    const profileButton = screen.getByText("Profile").closest("div");
    fireEvent.click(profileButton!);
    expect(navigate).toHaveBeenCalledWith("/settings/profile");
  });

  it("navigates to change password page when 'Change Password' is clicked", () => {
    const navigate = require("react-router-dom").useNavigate();
    const changePasswordButton = screen.getByText("Change Password").closest("div");
    fireEvent.click(changePasswordButton!);
    expect(navigate).toHaveBeenCalledWith("/settings/changepassword");
  });

  it("navigates to report an issue page when 'Report an Issue' is clicked", () => {
    const navigate = require("react-router-dom").useNavigate();
    const reportButton = screen.getByText("Report an Issue").closest("div");
    fireEvent.click(reportButton!);
    expect(navigate).toHaveBeenCalledWith("/settings/report");
  });

  it("navigates to about page when 'About' is clicked", () => {
    const navigate = require("react-router-dom").useNavigate();
    const aboutButton = screen.getByText("About").closest("div");
    fireEvent.click(aboutButton!);
    expect(navigate).toHaveBeenCalledWith("/settings/about");
  });

  it("logs out and navigates to login page when 'Log Out' is clicked", () => {
    const navigate = require("react-router-dom").useNavigate();
    const logoutButton = screen.getByText("Log Out").closest("div");
    fireEvent.click(logoutButton!);

    expect(authUtils.logout).toHaveBeenCalled();
    expect(mockSetUserAuthenticated).toHaveBeenCalledWith(false);
    expect(mockOnLogout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login");
  });
});
