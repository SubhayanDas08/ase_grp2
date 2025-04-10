/**
 * weatherController.test.ts
 */
import { Request, Response } from "express";
import { getStationAqi, getStations, getWeatherDetails } from "../controllers/weatherController";

// Increase timeout if needed (e.g., for external API calls)
jest.setTimeout(10000);

/**
 * Create a mock Request object.
 * Accepts optional body, params, query and user properties.
 */
const mockRequest = (
  body: object = {},
  params: object = {},
  query: object = {},
  user: object = {}
) => {
  return {
    body,
    params,
    query,
    user,
  } as unknown as Request;
};

/**
 * Create a mock Response object.
 * Mocks status() and json() methods.
 */
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("Weather Controller", () => {

  // ----- Tests for getStationAqi -----
  describe("getStationAqi", () => {
    it("should return AQI data for a valid station id", async () => {
      const req = mockRequest({}, { stationId: "123" }, {}, { id: 1 });
      const res = mockResponse();
      await getStationAqi(req, res);

      // Expect a 200 status with an object containing "aqi" and "city"
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          aqi: expect.any(Number),
          city: expect.any(String),
        })
      );
    });

    it("should return error for an invalid station id", async () => {
      const req = mockRequest({}, { stationId: "invalid" }, {}, { id: 1 });
      const res = mockResponse();
      await getStationAqi(req, res);

      // Expect status 500 with an error message indicating failure in fetching AQI
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("Failed to fetch AQI"),
        })
      );
    });

    it("should return error for missing or invalid access token", async () => {
      // Simulate missing authentication by not providing req.user
      const req = mockRequest({}, { stationId: "123" }, {}, {});
      const res = mockResponse();
      await getStationAqi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing access token" });
    });
  });

  // ----- Tests for getStations -----
  describe("getStations", () => {
    it("should return a list of stations when bounds are provided", async () => {
      const req = mockRequest({}, {}, { bounds: "10,10,20,20" }, { id: 1 });
      const res = mockResponse();
      await getStations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stations: expect.any(Array),
        })
      );
    });

    it("should return error if bounds parameter is missing", async () => {
      const req = mockRequest({}, {}, {}, { id: 1 });
      const res = mockResponse();
      await getStations(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Bounds parameter is required" });
    });

    it("should return error for missing or invalid access token on stations endpoint", async () => {
      const req = mockRequest({}, {}, { bounds: "10,10,20,20" }, {});
      const res = mockResponse();
      await getStations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing access token" });
    });
  });

  // ----- Tests for getWeatherDetails -----
  describe("getWeatherDetails", () => {
    it("should return weather details for valid coordinates", async () => {
      const req = mockRequest({}, {}, { latitude: "28.6139", longitude: "77.2090" }, { id: 1 });
      const res = mockResponse();
      await getWeatherDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          location: expect.any(String),
          temperature: expect.any(Number),
        })
      );
    });

    it("should return error when latitude and longitude are missing", async () => {
      const req = mockRequest({}, {}, {}, { id: 1 });
      const res = mockResponse();
      await getWeatherDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Latitude and Longitude parameters are required" });
    });

    it("should return error for missing or invalid access token on weather endpoint", async () => {
      const req = mockRequest({}, {}, { latitude: "28.6139", longitude: "77.2090" }, {});
      const res = mockResponse();
      await getWeatherDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing access token" });
    });

    it("should return error for invalid coordinates", async () => {
      const req = mockRequest({}, {}, { latitude: "invalid", longitude: "invalid" }, { id: 1 });
      const res = mockResponse();
      await getWeatherDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("Invalid response structure for coordinates"),
        })
      );
    });
  });
});