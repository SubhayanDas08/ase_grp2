import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsProfile from "../pages/SettingsChangePassword";
import { BrowserRouter as Router } from "react-router-dom";
import * as authUtils from "../utils/auth"; // Mocking the authenticatedPost function

jest.mock("../utils/auth", () => ({
  authenticatedPost: jest.fn(),
}));

describe("SettingsProfile Component", () => {
  const mockSetUserAuthenticated = jest.fn();

  beforeEach(() => {
    render(
      <Router>
        <SettingsProfile setUserAuthenticated={mockSetUserAuthenticated} />
      </Router>
    );
  });

  it("renders form elements correctly", () => {
    expect(screen.getByLabelText("Old Password")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm New Password")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });

  it("shows and hides password input correctly", () => {
    const oldPasswordVisibilityButton = screen.getByLabelText("Old Password").nextElementSibling;
    const newPasswordVisibilityButton = screen.getByLabelText("New Password").nextElementSibling;
    const confirmNewPasswordVisibilityButton = screen.getByLabelText("Confirm New Password").nextElementSibling;

    fireEvent.click(oldPasswordVisibilityButton!); // Toggle visibility
    fireEvent.click(newPasswordVisibilityButton!); // Toggle visibility
    fireEvent.click(confirmNewPasswordVisibilityButton!); // Toggle visibility

    expect(screen.getByLabelText("Old Password")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("New Password")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Confirm New Password")).toHaveAttribute("type", "text");

    fireEvent.click(oldPasswordVisibilityButton!); // Toggle back
    fireEvent.click(newPasswordVisibilityButton!); // Toggle back
    fireEvent.click(confirmNewPasswordVisibilityButton!); // Toggle back

    expect(screen.getByLabelText("Old Password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("New Password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Confirm New Password")).toHaveAttribute("type", "password");
  });

  it("displays validation error when new passwords do not match", async () => {
    fireEvent.change(screen.getByLabelText("Old Password"), { target: { value: "oldpassword" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newpassword1" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "newpassword2" } });

    fireEvent.click(screen.getByText("Change Password"));

    await waitFor(() => {
      expect(screen.getByText("New Password doesn't match")).toBeInTheDocument();
    });
  });

  it("displays validation error when new password is too short", async () => {
    fireEvent.change(screen.getByLabelText("Old Password"), { target: { value: "oldpassword" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "short" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "short" } });

    fireEvent.click(screen.getByText("Change Password"));

    await waitFor(() => {
      expect(screen.getByText("New Password must be at least 7 characters long!")).toBeInTheDocument();
    });
  });

  it("submits form and calls authenticatedPost when valid", async () => {
    const response = {
      message: "Password updated",
      token: "newToken",
      refreshToken: "newRefreshToken",
    };
    
    authUtils.authenticatedPost.mockResolvedValue(response); // Mock successful response

    fireEvent.change(screen.getByLabelText("Old Password"), { target: { value: "oldpassword" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newpassword123" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "newpassword123" } });

    fireEvent.click(screen.getByText("Change Password"));

    await waitFor(() => {
      expect(authUtils.authenticatedPost).toHaveBeenCalledWith("/user/changePassword", {
        oldPassword: "oldpassword",
        newPassword: "newpassword123",
      });

      expect(localStorage.setItem).toHaveBeenCalledWith("token", "newToken");
      expect(localStorage.setItem).toHaveBeenCalledWith("refreshToken", "newRefreshToken");
      expect(mockSetUserAuthenticated).toHaveBeenCalledWith(false);
    });
  });
});
