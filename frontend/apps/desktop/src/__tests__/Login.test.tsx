import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login"; 
import { login } from "../utils/auth";

// Mock external dependencies
jest.mock("../utils/auth", () => ({
  login: jest.fn(),
}));

jest.mock("lucide-react", () => ({
  Eye: () => <span data-testid="eye-icon" />,
  EyeOff: () => <span data-testid="eye-off-icon" />,
}));

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to} data-testid="link">{children}</a>
  ),
}));

// Mock images
jest.mock("../assets/Logo.svg", () => "mocked-logo-path");
jest.mock("../assets/FullLogo.svg", () => "mocked-full-logo-path");

// Helper to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {
  const mockSetUserAuthenticated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Renders initial state
  it("renders initial state", () => {
    renderWithRouter(<Login setUserAuthenticated={mockSetUserAuthenticated} />);
    expect(screen.getByText("Log In to your account")).toBeInTheDocument();
    expect(screen.getByText("Welcome back! Please enter your details.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument(); // Eye icon visible initially
  });

  // Test 2: Toggles password visibility
  it("toggles password visibility", () => {
    renderWithRouter(<Login setUserAuthenticated={mockSetUserAuthenticated} />);
    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByTestId("eye-icon");

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("eye-off-icon")).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByTestId("eye-off-icon"));
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  // Test 3: Updates form data on input change
  it("updates form data on input change", () => {
    renderWithRouter(<Login setUserAuthenticated={mockSetUserAuthenticated} />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  // Test 4: Shows alert when fields are empty
  it("shows alert when fields are empty", () => {
    window.alert = jest.fn();
    renderWithRouter(<Login setUserAuthenticated={mockSetUserAuthenticated} />);
    const loginButton = screen.getByText("Log In");

    fireEvent.click(loginButton);
    expect(window.alert).toHaveBeenCalledWith("Email and password are required");
    expect(login).not.toHaveBeenCalled();
  });

  // Test 5: Handles successful login
  it("handles successful login", async () => {
    (login as jest.Mock).mockResolvedValueOnce({ success: true });
    renderWithRouter(<Login setUserAuthenticated={mockSetUserAuthenticated} />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Log In");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockSetUserAuthenticated).toHaveBeenCalledWith(true);
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  // Test 6: Handles login failure with message
  it("handles login failure with message", async () => {
    window.alert = jest.fn();
    (login as jest.Mock).mockResolvedValueOnce({ success: false, message: "Invalid credentials" });
    renderWithRouter(<Login setUserAuthenticated={mockSetUserAuthenticated} />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Log In");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "wrongpassword",
      });
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
      expect(mockSetUserAuthenticated).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // Test 7: Handles unexpected error during login
  it("handles unexpected error during login", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    window.alert = jest.fn();
    (login as jest.Mock).mockRejectedValueOnce(new Error("API Error"));
    renderWithRouter(<Login setUserAuthenticated={mockSetUserAuthenticated} />);
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Log In");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith("Unexpected Error:", expect.any(Error));
      expect(window.alert).toHaveBeenCalledWith("Something went wrong! Please try again.");
      expect(mockSetUserAuthenticated).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  // Test 8: Navigates to create account page
  it("navigates to create account page via link", () => {
    renderWithRouter(<Login setUserAuthenticated={mockSetUserAuthenticated} />);
    const signUpLink = screen.getByText("Sign up");
    expect(signUpLink).toHaveAttribute("href", "/create_account");
  });
});