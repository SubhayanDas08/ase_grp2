import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Settings from "../pages/Settings";
import { BrowserRouter as Router } from "react-router-dom";
import * as authUtils from "../utils/auth";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Use the real react-router-dom except for useNavigate
  useNavigate: () => mockNavigate,
}));

jest.mock("../utils/auth", () => ({
  logout: jest.fn(),
}));

describe("Settings Component", () => {
  const mockSetUserAuthenticated = jest.fn();
  const mockOnLogout = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();

    render(
      <Router>
        <Settings
          setUserAuthenticated={mockSetUserAuthenticated}
          onLogout={mockOnLogout}
        />
      </Router>
    );
  });

  it("renders correctly", async () => {
    await waitFor(() => {
      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Change Password")).toBeInTheDocument();
      expect(screen.getByText("Report an Issue")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });
  });

  it("navigates to profile page when 'Profile' is clicked", async () => {
    const profileButton = screen.getByText("Profile").closest("div");
    await user.click(profileButton!);
    expect(mockNavigate).toHaveBeenCalledWith("/settings/profile");
  });

  it("navigates to change password page when 'Change Password' is clicked", async () => {
    const changePasswordButton = screen.getByText("Change Password").closest("div");
    await user.click(changePasswordButton!);
    expect(mockNavigate).toHaveBeenCalledWith("/settings/changepassword");
  });

  it("navigates to report an issue page when 'Report an Issue' is clicked", async () => {
    const reportButton = screen.getByText("Report an Issue").closest("div");
    await user.click(reportButton!);
    expect(mockNavigate).toHaveBeenCalledWith("/settings/report");
  });

  it("navigates to about page when 'About' is clicked", async () => {
    const aboutButton = screen.getByText("About").closest("div");
    await user.click(aboutButton!);
    expect(mockNavigate).toHaveBeenCalledWith("/settings/about");
  });

  it("logs out and navigates to login page when 'Log Out' is clicked", async () => {
    const logoutButton = screen.getByText("Log Out").closest("div");
    await user.click(logoutButton!);

    expect(authUtils.logout).toHaveBeenCalled();
    expect(mockSetUserAuthenticated).toHaveBeenCalledWith(false);
    expect(mockOnLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});