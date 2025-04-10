import {authenticate} from "../middleware/authenticate"; // default import now
import jwt from "jsonwebtoken";

// Mock jwt.verify so we can simulate token verification behavior.
jest.mock("jsonwebtoken");

describe("Authenticate Middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    // Set up a fresh request, response, and next function before each test.
    req = { headers: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };
    next = jest.fn();
    (jwt.verify as jest.Mock).mockClear();
  });

  it("should return 401 if no authorization header is provided", () => {
    // Call the factory function with a dummy role to obtain the middleware.
    const middleware = authenticate("test_role");
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header is malformed (not enough parts)", () => {
    // Case: header exists but does not contain two parts.
    req.headers.authorization = "Bearer"; // Only one part
    const middleware = authenticate("test_role");
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token error" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header is malformed (wrong format)", () => {
    // Case: header has two parts but the scheme is not 'Bearer'
    req.headers.authorization = "Token sometoken";
    const middleware = authenticate("test_role");
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token malformatted" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token verification fails", () => {
    req.headers.authorization = "Bearer invalid-token";
    // Simulate jwt.verify callback returning an error.
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error("invalid token"), null);
    });
    const middleware = authenticate("test_role");
    middleware(req, res, next);
    expect(jwt.verify).toHaveBeenCalledWith("invalid-token", expect.any(String), expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to authenticate token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and attach decoded user if token is valid", () => {
    req.headers.authorization = "Bearer valid-token";
    const fakeDecoded = { id: 42, name: "Test User" };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, fakeDecoded);
    });
    const middleware = authenticate("test_role");
    middleware(req, res, next);
    expect(jwt.verify).toHaveBeenCalled();
    expect(req.user).toEqual(fakeDecoded);
    expect(next).toHaveBeenCalled();
    // Ensure no error response was sent.
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});