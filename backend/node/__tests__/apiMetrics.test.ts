import { trackApiMetrics } from '../middleware/apiMetrics';
import { Request, Response, NextFunction } from 'express';
import { Counter } from 'prom-client';

// Mock the prom-client Counter
jest.mock('prom-client', () => ({
  Counter: jest.fn().mockImplementation(() => ({
    inc: jest.fn(),
  })),
}));

describe('API Metrics Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let apiCallCounter: Counter;

  beforeEach(() => {
    // Reset mocks before each test
    apiCallCounter = new Counter({
      name: 'api_calls_total',
      help: 'Total number of API calls',
      labelNames: ['route', 'method', 'status'],
    });

    req = {
      originalUrl: '/api/test', // Simulated URL for the request
      method: 'GET', // Simulated HTTP method
    };

    res = {
      statusCode: 200, // Simulated successful response status code
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') {
          callback(); // Trigger the finish event immediately
        }
      }),
    };

    next = jest.fn();
  });

  it('should track API call metrics', async () => {
    const middleware = trackApiMetrics;

    await middleware(req as Request, res as Response, next);

    // Ensure the finish event triggers the counter increment
    expect(apiCallCounter.inc).toHaveBeenCalledWith({
      route: req.originalUrl,
      method: req.method,
      status: String(res.statusCode),
    });
  });

  it('should call next() to pass control to the next middleware', async () => {
    const middleware = trackApiMetrics;

    await middleware(req as Request, res as Response, next);

    // Ensure next() is called to continue to the next middleware/handler
    expect(next).toHaveBeenCalled();
  });

  it('should handle different status codes correctly', async () => {
    res.statusCode = 500; // Simulate a failed request with status code 500

    const middleware = trackApiMetrics;
    await middleware(req as Request, res as Response, next);

    // Ensure the counter increments with the correct status code (500)
    expect(apiCallCounter.inc).toHaveBeenCalledWith({
      route: req.originalUrl,
      method: req.method,
      status: '500',
    });
  });

  it('should handle POST method correctly', async () => {
    req.method = 'POST'; // Simulating a POST request

    const middleware = trackApiMetrics;
    await middleware(req as Request, res as Response, next);

    // Ensure the counter increments with the correct method (POST)
    expect(apiCallCounter.inc).toHaveBeenCalledWith({
      route: req.originalUrl,
      method: 'POST',
      status: String(res.statusCode),
    });
  });

  it('should handle PUT method correctly', async () => {
    req.method = 'PUT'; // Simulating a PUT request

    const middleware = trackApiMetrics;
    await middleware(req as Request, res as Response, next);

    // Ensure the counter increments with the correct method (PUT)
    expect(apiCallCounter.inc).toHaveBeenCalledWith({
      route: req.originalUrl,
      method: 'PUT',
      status: String(res.statusCode),
    });
  });

  it('should handle DELETE method correctly', async () => {
    req.method = 'DELETE'; // Simulating a DELETE request

    const middleware = trackApiMetrics;
    await middleware(req as Request, res as Response, next);

    // Ensure the counter increments with the correct method (DELETE)
    expect(apiCallCounter.inc).toHaveBeenCalledWith({
      route: req.originalUrl,
      method: 'DELETE',
      status: String(res.statusCode),
    });
  });
});
