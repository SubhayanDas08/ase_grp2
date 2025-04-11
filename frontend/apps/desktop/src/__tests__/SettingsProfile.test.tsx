import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsProfile from "../pages/SettingsProfile";
import { BrowserRouter as Router } from "react-router-dom";
import * as authUtils from "../utils/auth";

jest.mock("../utils/auth", () => ({
  authenticatedGet: jest.fn(),
  authenticatedPost: jest.fn(),
}));

// Mock window.alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock console.log and console.error to suppress output
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {});

describe("SettingsProfile Component", () => {
  const mockSetUserAuthenticated = jest.fn();
  const user = userEvent.setup();

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with user data", async () => {
    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("jane.doe@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("+353 899739832")).toBeInTheDocument();
    });
  });

  it("allows changing the first and last name", async () => {
    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    });

    const firstNameInput = screen.getByPlaceholderText(/Enter your First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your Last Name/i);

    // Use userEvent to simulate user input
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "John");
    await user.clear(lastNameInput);
    await user.type(lastNameInput, "Smith");

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Smith");
  });

  it("alerts if required fields (first name, last name) are missing on submit", async () => {
    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    });

    const saveButton = screen.getByText(/Save/i);

    // Set first name and last name to empty strings
    const firstNameInput = screen.getByPlaceholderText(/Enter your First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your Last Name/i);
    await user.clear(firstNameInput);
    await user.clear(lastNameInput);

    await user.click(saveButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Please fill in all fields");
    });
  });

  it("submits form and updates user details successfully", async () => {
    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    });

    // Mocking the response for the authenticatedPost function
    authUtils.authenticatedPost.mockResolvedValue({
      message: "User details updated successfully!",
    });

    const firstNameInput = screen.getByPlaceholderText(/Enter your First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your Last Name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "John");
    await user.clear(lastNameInput);
    await user.type(lastNameInput, "Smith");

    const saveButton = screen.getByText(/Save/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(authUtils.authenticatedPost).toHaveBeenCalledWith("/user/updateName", {
        firstName: "John",
        lastName: "Smith",
      });

      expect(mockAlert).toHaveBeenCalledWith("User details updated successfully!");
    });
  });

  it("handles API errors gracefully", async () => {
    // Wait for the initial data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
    });

    // Simulating an error from the API
    authUtils.authenticatedPost.mockRejectedValue(new Error("Failed to update user details"));

    const firstNameInput = screen.getByPlaceholderText(/Enter your First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your Last Name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "John");
    await user.clear(lastNameInput);
    await user.type(lastNameInput, "Smith");

    const saveButton = screen.getByText(/Save/i);
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith("Failed to update user details!");
    });
  });
});

// Clean up mocks after all tests
afterAll(() => {
  mockConsoleLog.mockRestore();
  mockConsoleError.mockRestore();
});