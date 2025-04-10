// import { getStations } from "../getStations";

// // declare const global: typeof globalThis & {
// //     fetch: jest.Mock;
// // };

// //Mocking fetch globally
// global.fetch = jest.fn();
// // (global.fetch as jest.Mock) = jest.fn();

// describe("getStations", () => {
//   const mockBounds = "53.2000,-6.4000,53.4100,-6.0500";
//   const mockAccessToken = "test-access-token";
//   const mockResponse = {
//     status: "ok",
//     data: [
//       { uid: 1, lat: 12.34, lon: 56.78 },
//       { uid: 1, lat: 90.12, lon: 34.56 },
//     ],
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//     import.meta.env.VITE_WAQI_ACCESS_TOKEN = mockAccessToken;
//   });

//   // Test 1 : Successful API Response
//   test("Fetch Stations List Data Successfully", async () => {
//     // Mock fetch implementation
//     (window.fetch as jest.Mock).mockResolvedValue({
//       ok: true,
//       json: jest.fn().mockResolvedValue(mockResponse),
//     });

//     const stations = await getStations(mockBounds);

//     expect(global.fetch).toHaveBeenCalledTimes(1);
//     expect(global.fetch).toHaveBeenCalledWith(
//       `https://api.waqi.info/map/bounds?token=${mockAccessToken}&latlng=${mockBounds}`,
//     );
//     expect(stations).toEqual([
//       { id: 1, lat: 12.34, lon: 56.78 },
//       { id: 2, lat: 90.12, lon: 34.56 },
//     ]);
//   });

//   // Test 2: Missing Access Token
//   // test("should throw error when access token is missing", async () => {
//   //     import.meta.env.VITE_WAQI_ACCESS_TOKEN = undefined; // Simulate missing token

//   //     await expect(getStations(mockBounds)).rejects.toThrow("Missing access token");
//   // });

//   // // Test 3: API Response is not OK
//   // test("should throw error on failed API response", async () => {
//   //     (global.fetch as jest.Mock).mockResolvedValue({
//   //         ok: false,
//   //         statusText: "Bad Request",
//   //     });

//   //     await expect(getStations(mockBounds)).rejects.toThrow("Failed to fetch stations: Bad Request");
//   // });

//   // //Test 4: Network Failure
//   // test("should throw error if fetch fails (network error)", async () => {
//   //     (global.fetch as jest.Mock).mockRejectedValue(new Error("Network Error"));

//   //     await expect(getStations(mockBounds)).rejects.toThrow("Error in fetching stations of the bound coordinates");
//   // });

//   // //Test 5: Filtering out invalud data
//   // test("should filter out invalid stations from the API response", async () => {
//   //     const invalidResponse = {
//   //         status: "ok",
//   //         data: [
//   //             { lat: 12.34, lon: 56.78, uid: 1 },
//   //             { lat: null, lon: 34.56, uid: 2 }, // Invalid lat
//   //             { lat: 90.12, lon: null, uid: 3 }, // Invalid lon
//   //             { lat: 45.67, lon: 89.01, uid: 0 }, // Invalid uid
//   //         ],
//   //     };

//   //     (global.fetch as jest.Mock).mockResolvedValue({
//   //         ok: true,
//   //         json: jest.fn().mockResolvedValue(invalidResponse),
//   //     });

//   //     const stations = await getStations(mockBounds);

//   //     expect(stations).toEqual([{ id: 1, lat: 12.34, lon: 56.78 }]);
//   // });
// });
