import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsProfile from "../pages/SettingsProfile";
import { BrowserRouter as Router } from "react-router-dom";
import * as authUtils from "../utils/auth"; 

jest.mock("../utils/auth", () => ({
  authenticatedGet: jest.fn(),
  authenticatedPost: jest.fn(),
}));

describe("SettingsProfile Component", () => {
  const mockSetUserAuthenticated = jest.fn();

  beforeEach(() => {
    // Mocking the response from authenticatedGet
    authUtils.authenticatedGet.mockResolvedValue({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      phone_number: "+353 899739832",
    });

    render(
      <Router>
        <SettingsProfile setUserAuthenticated={mockSetUserAuthenticated} />
      </Router>
    );
  });

  it("renders form with user data", async () => {
    // Check if the user data from the API is displayed in the form
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("jane.doe@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("+353 899739832")).toBeInTheDocument();
    });
  });

  it("allows changing the first and last name", async () => {
    const firstNameInput = screen.getByLabelText(/Firstname/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Smith");
  });

  it("alerts if required fields (first name, last name) are missing on submit", async () => {
    const saveButton = screen.getByText(/Save/i);

    // Set first name and last name to empty strings
    fireEvent.change(screen.getByLabelText(/Firstname/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "" } });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please fill in all fields");
    });
  });

  it("submits form and updates user details successfully", async () => {
    // Mocking the response for the authenticatedPost function
    authUtils.authenticatedPost.mockResolvedValue({
      message: "User details updated successfully!",
    });

    fireEvent.change(screen.getByLabelText(/Firstname/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });

    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(authUtils.authenticatedPost).toHaveBeenCalledWith("/user/updateName", {
        firstName: "John",
        lastName: "Smith",
      });

      expect(window.alert).toHaveBeenCalledWith("User details updated successfully!");
    });
  });

  it("handles API errors gracefully", async () => {
    // Simulating an error from the API
    authUtils.authenticatedPost.mockRejectedValue(new Error("Failed to update user details"));

    fireEvent.change(screen.getByLabelText(/Firstname/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });

    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to update user details!");
    });
  });
});
