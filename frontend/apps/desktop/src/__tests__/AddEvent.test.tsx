// Mock dependencies
const mockAuthenticatedPost = jest.fn();
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock authenticatedPost
jest.mock("../utils/auth", () => ({
  authenticatedPost: mockAuthenticatedPost,
}));

// Replicate handleAddEvent logic
const handleAddEvent = async (state, alert, navigate, authenticatedPost) => {
  if (
    !state.eventname ||
    !state.selectedDate ||
    !state.selectedTime ||
    !state.selectedLocation ||
    !state.area ||
    !state.description
  ) {
    alert("Fill all the details!");
    return;
  }

  const newEvent = {
    name: state.eventname,
    event_date: state.selectedDate,
    event_time: state.selectedTime,
    location: state.selectedLocation,
    area: state.area,
    description: state.description,
  };

  try {
    await authenticatedPost("/events/create", newEvent);
    navigate("/events");
  } catch (error) {
    console.error("Error adding event:", error);
    alert("Something went wrong while saving the event.");
  }
};

// Replicate handlePlaceSelect logic
const handlePlaceSelect = (autocomplete, setSelectedLocation, setArea) => {
  if (autocomplete) {
    const place = autocomplete.getPlace();

    if (place && place.formatted_address) {
      setSelectedLocation(place.formatted_address);
    }
    const addressComponents = place.address_components || [];
    const neighborhoodComponent = addressComponents.find((component) =>
      component.types.includes("sublocality") || component.types.includes("neighborhood")
    );

    if (neighborhoodComponent) {
      setArea(neighborhoodComponent.long_name);
    } else {
      setArea("");
    }
  }
};

describe("AddEvent Component Logic", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock authenticatedPost to resolve by default
    mockAuthenticatedPost.mockResolvedValue({});
  });

  test("handleAddEvent prevents submission with incomplete form", () => {
    // Mock state with incomplete data
    const state = {
      eventname: "",
      selectedDate: null,
      selectedTime: "10:00",
      selectedLocation: "",
      area: "",
      description: "",
    };

    // Mock alert
    const mockAlert = jest.fn();

    // Call handleAddEvent
    handleAddEvent(state, mockAlert, mockNavigate, mockAuthenticatedPost);

    expect(mockAlert).toHaveBeenCalledWith("Fill all the details!");
    expect(mockAuthenticatedPost).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("handleAddEvent submits form with complete data and navigates", async () => {
    // Mock state with complete data
    const state = {
      eventname: "Test Event",
      selectedDate: new Date("2025-05-01"),
      selectedTime: "14:30",
      selectedLocation: "Mocked Address, Dublin, Ireland",
      area: "Mocked Area",
      description: "This is a test event.",
    };

    // Mock alert
    const mockAlert = jest.fn();

    // Call handleAddEvent
    await handleAddEvent(state, mockAlert, mockNavigate, mockAuthenticatedPost);

    expect(mockAuthenticatedPost).toHaveBeenCalledWith("/events/create", {
      name: "Test Event",
      event_date: expect.any(Date),
      event_time: "14:30",
      location: "Mocked Address, Dublin, Ireland",
      area: "Mocked Area",
      description: "This is a test event.",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/events");
    expect(mockAlert).not.toHaveBeenCalled();
  });

  test("handleAddEvent handles submission error", async () => {
    // Mock state with complete data
    const state = {
      eventname: "Test Event",
      selectedDate: new Date("2025-05-01"),
      selectedTime: "14:30",
      selectedLocation: "Mocked Address, Dublin, Ireland",
      area: "Mocked Area",
      description: "This is a test event.",
    };

    // Mock alert
    const mockAlert = jest.fn();

    // Mock authenticatedPost to fail
    mockAuthenticatedPost.mockRejectedValue(new Error("API error"));

    // Call handleAddEvent
    await handleAddEvent(state, mockAlert, mockNavigate, mockAuthenticatedPost);

    expect(mockAuthenticatedPost).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith("Something went wrong while saving the event.");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("handlePlaceSelect updates location and area", () => {
    // Mock autocomplete
    const mockAutocomplete = {
      getPlace: () => ({
        formatted_address: "Mocked Address, Dublin, Ireland",
        address_components: [
          { types: ["neighborhood"], long_name: "Mocked Area" },
        ],
      }),
    };

    // Mock state setters
    let selectedLocation = "";
    let area = "";
    const setSelectedLocation = jest.fn((value) => (selectedLocation = value));
    const setArea = jest.fn((value) => (area = value));

    // Call handlePlaceSelect
    handlePlaceSelect(mockAutocomplete, setSelectedLocation, setArea);

    expect(setSelectedLocation).toHaveBeenCalledWith("Mocked Address, Dublin, Ireland");
    expect(setArea).toHaveBeenCalledWith("Mocked Area");
    expect(selectedLocation).toBe("Mocked Address, Dublin, Ireland");
    expect(area).toBe("Mocked Area");
  });

  test("handlePlaceSelect sets empty area when no neighborhood found", () => {
    // Mock autocomplete with no neighborhood
    const mockAutocomplete = {
      getPlace: () => ({
        formatted_address: "Mocked Address, Dublin, Ireland",
        address_components: [],
      }),
    };

    // Mock state setters
    let selectedLocation = "";
    let area = "";
    const setSelectedLocation = jest.fn((value) => (selectedLocation = value));
    const setArea = jest.fn((value) => (area = value));

    // Call handlePlaceSelect
    handlePlaceSelect(mockAutocomplete, setSelectedLocation, setArea);

    expect(setSelectedLocation).toHaveBeenCalledWith("Mocked Address, Dublin, Ireland");
    expect(setArea).toHaveBeenCalledWith("");
    expect(selectedLocation).toBe("Mocked Address, Dublin, Ireland");
    expect(area).toBe("");
  });
});