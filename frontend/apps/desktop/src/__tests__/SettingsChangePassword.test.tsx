import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsChangePassword from "../pages/SettingsChangePassword";
import { BrowserRouter as Router } from "react-router-dom";
import * as authUtils from "../utils/auth";

// Mock lucide-react icons to avoid rendering issues
jest.mock("lucide-react", () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
}));

jest.mock("../utils/auth", () => ({
  authenticatedPost: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock console.warn and console.log to suppress output
const mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});

describe("SettingsChangePassword Component", () => {
  const mockSetUserAuthenticated = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();

    render(
      <Router>
        <SettingsChangePassword setUserAuthenticated={mockSetUserAuthenticated} />
      </Router>
    );
  });

  afterAll(() => {
    // Restore console mocks after all tests
    mockConsoleWarn.mockRestore();
    mockConsoleLog.mockRestore();
  });

  it("renders form elements correctly", async () => {
    // Wait for the DOM to fully render
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter Old Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter New Password")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter the New Password Again")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Change Password/i })).toBeInTheDocument();
    });
  });

  it("shows and hides password input correctly", async () => {
    const oldPasswordInput = screen.getByPlaceholderText("Enter Old Password");
    const newPasswordInput = screen.getByPlaceholderText("Enter New Password");
    const confirmNewPasswordInput = screen.getByPlaceholderText("Enter the New Password Again");

    // Initially, inputs should be of type "password"
    expect(oldPasswordInput).toHaveAttribute("type", "password");
    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(confirmNewPasswordInput).toHaveAttribute("type", "password");

    // Find the visibility toggle buttons using the mocked icons
    const visibilityButtons = screen.getAllByTestId(/eye-off-icon/);
    expect(visibilityButtons).toHaveLength(3); // One for each input

    // Toggle visibility for each input
    await user.click(visibilityButtons[0]); // Old Password
    await user.click(visibilityButtons[1]); // New Password
    await user.click(visibilityButtons[2]); // Confirm New Password

    expect(oldPasswordInput).toHaveAttribute("type", "text");
    expect(newPasswordInput).toHaveAttribute("type", "text");
    expect(confirmNewPasswordInput).toHaveAttribute("type", "text");

    // Toggle back
    const visibilityButtonsAfterToggle = screen.getAllByTestId(/eye-icon/);
    await user.click(visibilityButtonsAfterToggle[0]); // Old Password
    await user.click(visibilityButtonsAfterToggle[1]); // New Password
    await user.click(visibilityButtonsAfterToggle[2]); // Confirm New Password

    expect(oldPasswordInput).toHaveAttribute("type", "password");
    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(confirmNewPasswordInput).toHaveAttribute("type", "password");
  });

  it("displays validation error when new passwords do not match", async () => {
    const oldPasswordInput = screen.getByPlaceholderText("Enter Old Password");
    const newPasswordInput = screen.getByPlaceholderText("Enter New Password");
    const confirmNewPasswordInput = screen.getByPlaceholderText("Enter the New Password Again");

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword1");
    await user.type(confirmNewPasswordInput, "newpassword2");

    const changePasswordButton = screen.getByRole("button", { name: /Change Password/i });
    await user.click(changePasswordButton);

    // Check console.warn for the error message
    await waitFor(() => {
      expect(mockConsoleWarn).toHaveBeenCalledWith("Validation Error:", "New Password doesn't match");
    });
  });

  it("displays validation error when new password is too short", async () => {
    const oldPasswordInput = screen.getByPlaceholderText("Enter Old Password");
    const newPasswordInput = screen.getByPlaceholderText("Enter New Password");
    const confirmNewPasswordInput = screen.getByPlaceholderText("Enter the New Password Again");

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "short");
    await user.type(confirmNewPasswordInput, "short");

    const changePasswordButton = screen.getByRole("button", { name: /Change Password/i });
    await user.click(changePasswordButton);

    // Check console.warn for the error message
    await waitFor(() => {
      expect(mockConsoleWarn).toHaveBeenCalledWith("Validation Error:", "New Password must be at least 7 characters long!");
    });
  });

  it("submits form and calls authenticatedPost when valid", async () => {
    const response = {
      message: "Password updated",
      token: "newToken",
      refreshToken: "newRefreshToken",
    };

    authUtils.authenticatedPost.mockResolvedValue(response); // Mock successful response

    const oldPasswordInput = screen.getByPlaceholderText("Enter Old Password");
    const newPasswordInput = screen.getByPlaceholderText("Enter New Password");
    const confirmNewPasswordInput = screen.getByPlaceholderText("Enter the New Password Again");

    await user.type(oldPasswordInput, "oldpassword");
    await user.type(newPasswordInput, "newpassword123");
    await user.type(confirmNewPasswordInput, "newpassword123");

    const changePasswordButton = screen.getByRole("button", { name: /Change Password/i });
    await user.click(changePasswordButton);

    await waitFor(
      () => {
        expect(authUtils.authenticatedPost).toHaveBeenCalledWith("/user/changePassword", {
          oldPassword: "oldpassword",
          newPassword: "newpassword123",
        });

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith("token", "newToken");
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith("refreshToken", "newRefreshToken");
        expect(mockAlert).toHaveBeenCalledWith("Password successfully updated!");
        expect(mockSetUserAuthenticated).toHaveBeenCalledWith(false);
      },
      { timeout: 2000 } // Increase timeout to ensure async operation completes
    );

    // Check that inputs are cleared
    expect(oldPasswordInput).toHaveValue("");
    expect(newPasswordInput).toHaveValue("");
    expect(confirmNewPasswordInput).toHaveValue("");
  });
});