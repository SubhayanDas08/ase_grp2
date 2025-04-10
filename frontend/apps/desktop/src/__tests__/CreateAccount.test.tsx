import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateAccount from "../pages/CreateAccount";
import { BrowserRouter } from "react-router-dom";
import { register } from "../utils/auth";

// Mock the register function from auth utils
jest.mock("../utils/auth", () => ({
  register: jest.fn(),
}));

// Helper to wrap components with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("CreateAccount Page", () => {
  const setUserAuthenticatedMock = jest.fn();

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithRouter(<CreateAccount setUserAuthenticated={setUserAuthenticatedMock} />);
  });

  // Test 1: Check if all input fields and elements render correctly
  it("renders all required input fields and UI elements", () => {
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });

  // Test 2: Alert when submitting with empty fields
  it("shows an alert when trying to submit with empty fields", () => {
    window.alert = jest.fn(); // Mock alert
    fireEvent.click(screen.getByText("Sign up"));

    expect(window.alert).toHaveBeenCalledWith(
      "All fields are required. Please fill in all information."
    );
    expect(register).not.toHaveBeenCalled(); // Ensure register isn't called
  });

  // Test 3: Successful registration with all fields filled
  it("submits the form successfully when all fields are filled", async () => {
    // Mock a successful register response
    (register as jest.Mock).mockResolvedValueOnce({
      success: true,
      message: "Registration successful",
    });

    // Fill in all fields
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Sign up"));

    // Wait for async operations
    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        phone_number: "1234567890",
        password: "password123",
      });
      expect(setUserAuthenticatedMock).toHaveBeenCalledWith(true);
    });
  });

  // Test 4: Failed registration with error message
  it("shows an alert when registration fails", async () => {
    // Mock a failed register response
    (register as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: "Email already exists",
    });
    window.alert = jest.fn();

    // Fill in all fields
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Sign up"));

    // Wait for async operations
    await waitFor(() => {
      expect(register).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Email already exists");
      expect(setUserAuthenticatedMock).not.toHaveBeenCalled();
    });
  });

  // Test 5: Unexpected error handling
  it("handles unexpected errors during registration", async () => {
    // Mock an error thrown by register
    (register as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
    window.alert = jest.fn();

    // Fill in all fields
    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Sign up"));

    // Wait for async operations
    await waitFor(() => {
      expect(register).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        "Something went wrong! Please try again."
      );
      expect(setUserAuthenticatedMock).not.toHaveBeenCalled();
    });
  });

  // Test 6: Toggle password visibility
  it("toggles password visibility when eye icon is clicked", () => {
    const passwordInput = screen.getByPlaceholderText("Password");
    const eyeButton = screen.getByRole("button"); // Assuming the Eye/EyeOff button is the only button initially

    // Initially password is hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click to show password
    fireEvent.click(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click to hide password again
    fireEvent.click(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});

// Remove misplaced describe block for getStations
// It was likely a leftover from another test file