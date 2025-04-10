// import axios from "axios";
// import * as auth from "../utils/auth"; // adjust path if needed
// jest.mock("axios");

// const mockedAxios = axios as jest.Mocked<typeof axios>;

// describe("Auth Module", () => {
  
//   beforeAll(() => {
//     globalThis.window = { location: { href: '' } } as Window;
//   });
  
//   afterAll(() => {
//     globalThis.window = undefined;
//   });
  



//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("saves and gets auth tokens correctly", async () => {
//     const tokens: auth.AuthTokens = {
//       accessToken: "access123",
//       refreshToken: "refresh456",
//       accessTokenExpiresAt: Date.now() + 10000,
//       refreshTokenExpiresAt: Date.now() + 20000,
//     };

//     await auth.saveAuthTokens(tokens);
//     const storedTokens = await auth.getAuthTokens();
//     expect(storedTokens).toEqual(tokens);
//   });

//   it("clears auth tokens correctly", async () => {
//     await auth.clearAuthTokens();
//     const storedTokens = await auth.getAuthTokens();
//     expect(storedTokens).toBeNull();
//   });

//   it("saves and gets permissions correctly", async () => {
//     const permissions = ["read", "write"];
//     await auth["savePermissions"](permissions);
//     const result = await auth.getPermissions();
//     expect(result).toEqual(permissions);
//   });

//   it("checks permission correctly", async () => {
//     const permissions = ["admin"];
//     await auth["savePermissions"](permissions);
//     const hasPermission = await auth.checkPermission("admin");
//     expect(hasPermission).toBe(true);
//     const hasOther = await auth.checkPermission("user");
//     expect(hasOther).toBe(false);
//   });

//   it("logs in and saves tokens/permissions", async () => {
//     const responseMock = {
//       data: {
//         token: "accessTokenHere",
//         refreshToken: "refreshTokenHere",
//         permissions: ["admin", "editor"],
//       },
//     };
//     mockedAxios.post.mockResolvedValueOnce(responseMock);

//     const result = await auth.login({ email: "test@test.com", password: "1234" });

//     expect(result.success).toBe(true);
//     expect(mockedAxios.post).toHaveBeenCalledWith(
//       expect.stringContaining("/user/login"),
//       { userData: { email: "test@test.com", password: "1234" } },
//     );

//     const tokens = await auth.getAuthTokens();
//     expect(tokens?.accessToken).toBe("accessTokenHere");
//   });

//   it("returns error on login with 401", async () => {
//     mockedAxios.post.mockRejectedValueOnce({
//       response: { status: 401, data: { error: "Invalid credentials" } },
//       isAxiosError: true,
//     });

//     const result = await auth.login({ email: "wrong@test.com", password: "badpass" });

//     expect(result.success).toBe(false);
//     expect(result.message).toContain("Invalid email or password");
//   });
// });
