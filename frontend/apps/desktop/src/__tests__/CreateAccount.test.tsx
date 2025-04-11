import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Mock SVG imports at the very top
jest.mock("../assets/Logo.svg", () => "div");
jest.mock("../assets/GoogleLogo.svg", () => "div");
jest.mock("../assets/FullLogo.svg", () => "div");

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  Eye: () => <span>EyeIcon</span>,
  EyeOff: () => <span>EyeOffIcon</span>,
}));

// Mock environment variables
beforeAll(() => {
  process.env.VITE_API_BASE_URL = "http://localhost:3000";
});

// Mock the register function
jest.mock("../utils/auth", () => ({
  register: jest.fn(),
}));

// Now import the component after all mocks are set up
import CreateAccount from "../pages/CreateAccount";
import { register } from "../utils/auth";

// Helper function to render with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("CreateAccount Component", () => {
  const mockSetUserAuthenticated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    renderWithRouter(<CreateAccount setUserAuthenticated={mockSetUserAuthenticated} />);
  });

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

  it("shows an alert when trying to submit with empty fields", () => {
    fireEvent.click(screen.getByText("Sign up"));
    expect(window.alert).toHaveBeenCalledWith(
      "All fields are required. Please fill in all information."
    );
    expect(register).not.toHaveBeenCalled();
  });

  it("submits the form successfully when all fields are filled", async () => {
    (register as jest.Mock).mockResolvedValueOnce({
      success: true,
      message: "Registration successful",
    });

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

    fireEvent.click(screen.getByText("Sign up"));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        phone_number: "1234567890",
        password: "password123",
      });
      expect(mockSetUserAuthenticated).toHaveBeenCalledWith(true);
    });
  });
});