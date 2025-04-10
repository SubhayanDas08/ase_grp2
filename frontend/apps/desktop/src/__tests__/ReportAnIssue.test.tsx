import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SettingsProfile from "../pages/SettingsProfile"; // Adjust path as needed

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("SettingsProfile Component", () => {
  const mockSetUserAuthenticated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial state", () => {
    renderWithRouter(<SettingsProfile setUserAuthenticated={mockSetUserAuthenticated} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Report an Issue")).toBeInTheDocument();
    expect(screen.getByText("Subject")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add Subject of the Issue")).toBeInTheDocument();
    expect(screen.getByText("Issue Description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add Description")).toBeInTheDocument();
    expect(screen.getByText("Report")).toBeInTheDocument();
  });

  it("updates form fields on input change", () => {
    renderWithRouter(<SettingsProfile setUserAuthenticated={mockSetUserAuthenticated} />);
    const subjectInput = screen.getByPlaceholderText("Add Subject of the Issue");
    const descriptionTextarea = screen.getByPlaceholderText("Add Description");

    fireEvent.change(subjectInput, { target: { value: "App Crash" } });
    fireEvent.change(descriptionTextarea, { target: { value: "The app crashed unexpectedly." } });

    expect(subjectInput).toHaveValue("App Crash");
    expect(descriptionTextarea).toHaveValue("The app crashed unexpectedly.");
  });

  it("shows error message when submitting empty form", () => {
    renderWithRouter(<SettingsProfile setUserAuthenticated={mockSetUserAuthenticated} />);
    const reportButton = screen.getByText("Report");

    fireEvent.click(reportButton);
    expect(screen.getByText("Subject and Description cannot be empty.")).toBeInTheDocument();
  });

  it("submits form successfully and clears fields", () => {
    window.alert = jest.fn();
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    renderWithRouter(<SettingsProfile setUserAuthenticated={mockSetUserAuthenticated} />);
    const subjectInput = screen.getByPlaceholderText("Add Subject of the Issue");
    const descriptionTextarea = screen.getByPlaceholderText("Add Description");
    const reportButton = screen.getByText("Report");

    fireEvent.change(subjectInput, { target: { value: "App Crash" } });
    fireEvent.change(descriptionTextarea, { target: { value: "The app crashed unexpectedly." } });
    fireEvent.click(reportButton);

    expect(consoleLogSpy).toHaveBeenCalledWith("Issue succesfully reported!");
    expect(window.alert).toHaveBeenCalledWith("Issue succesfully reported!");
    expect(subjectInput).toHaveValue("");
    expect(descriptionTextarea).toHaveValue("");
    expect(screen.queryByText("Subject and Description cannot be empty.")).not.toBeInTheDocument();
  });

  it("navigates to settings page on breadcrumb click", () => {
    renderWithRouter(<SettingsProfile setUserAuthenticated={mockSetUserAuthenticated} />);
    const settingsLink = screen.getByText("Settings");

    fireEvent.click(settingsLink);
    expect(mockNavigate).toHaveBeenCalledWith("/settings/");
  });
});