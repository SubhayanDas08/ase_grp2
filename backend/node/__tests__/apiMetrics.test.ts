// Assuming you have a mock apiCallCounter that tracks API call metrics
const apiCallCounter = {
    inc: jest.fn(),
  };
  
  // Mocked middleware function
  const trackApiMetrics = (req: any, res: any, next: any) => {
    apiCallCounter.inc({
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode.toString(), // Ensure status is a string
    });
    next();
  };
  
  // Test suite
  describe('API Metrics Middleware', () => {
  
    it('should track API call metrics for GET requests', async () => {
      const req = { method: 'GET', originalUrl: '/api/test' };
      const res = { statusCode: 200 }; // Mocked response object with statusCode
      const next = jest.fn(); // Mocked next function
  
      // Call the middleware
      await trackApiMetrics(req, res, next);
  
      // Ensure apiCallCounter.inc was called with the correct values
      expect(apiCallCounter.inc).toHaveBeenCalledWith({
        method: 'GET',
        route: '/api/test',
        status: '200', // status should be a string
      });
  
      // Ensure next() was called to pass control to the next middleware
      expect(next).toHaveBeenCalled();
    });
  
    it('should track API call metrics for POST requests', async () => {
      const req = { method: 'POST', originalUrl: '/api/test' };
      const res = { statusCode: 201 }; // Mocked statusCode for POST request
      const next = jest.fn();
  
      // Call the middleware
      await trackApiMetrics(req, res, next);
  
      // Ensure apiCallCounter.inc was called with the correct values for POST
      expect(apiCallCounter.inc).toHaveBeenCalledWith({
        method: 'POST',
        route: '/api/test',
        status: '201',
      });
  
      // Ensure next() was called
      expect(next).toHaveBeenCalled();
    });
  
    it('should track API call metrics for PUT requests', async () => {
      const req = { method: 'PUT', originalUrl: '/api/test' };
      const res = { statusCode: 200 };
      const next = jest.fn();
  
      // Call the middleware
      await trackApiMetrics(req, res, next);
  
      // Ensure apiCallCounter.inc was called with the correct values for PUT
      expect(apiCallCounter.inc).toHaveBeenCalledWith({
        method: 'PUT',
        route: '/api/test',
        status: '200',
      });
  
      // Ensure next() was called
      expect(next).toHaveBeenCalled();
    });
  
    it('should track API call metrics for DELETE requests', async () => {
      const req = { method: 'DELETE', originalUrl: '/api/test' };
      const res = { statusCode: 204 }; // No content status code for DELETE
      const next = jest.fn();
  
      // Call the middleware
      await trackApiMetrics(req, res, next);
  
      // Ensure apiCallCounter.inc was called with the correct values for DELETE
      expect(apiCallCounter.inc).toHaveBeenCalledWith({
        method: 'DELETE',
        route: '/api/test',
        status: '204',
      });
  
      // Ensure next() was called
      expect(next).toHaveBeenCalled();
    });
  
    it('should handle errors gracefully and call next()', async () => {
      const req = { method: 'GET', originalUrl: '/api/error' };
      const res = { statusCode: 500 }; // Simulating an error status code
      const next = jest.fn();
  
      // Simulate an error in the API call tracking
      await trackApiMetrics(req, res, next);
  
      // Ensure apiCallCounter.inc was called with error status
      expect(apiCallCounter.inc).toHaveBeenCalledWith({
        method: 'GET',
        route: '/api/error',
        status: '500',
      });
  
      // Ensure next() was called
      expect(next).toHaveBeenCalled();
    });
  
  });
  