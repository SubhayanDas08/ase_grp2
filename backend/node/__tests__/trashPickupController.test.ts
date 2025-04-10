import { getRouteDetails } from '../controllers/trashPickupController'; 
import { fetchRouteDetails } from '../services/databaseService';
import { Request, Response } from 'express';

// Mock the database service
jest.mock('../services/databaseService', () => ({
  fetchRouteDetails: jest.fn(),
}));

describe('getRouteDetails', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  
  beforeEach(() => {
    req = {
      body: {
        county: 'SomeCounty',
        pickup_day: 'Monday',
      },
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 200 and the route details when data is found', async () => {
    // Arrange
    const mockRouteDetails = {
      routeId: '1',
      county: 'SomeCounty',
      pickup_day: 'Monday',
      details: 'Some route details',
    };
    
    (fetchRouteDetails as jest.Mock).mockResolvedValue(mockRouteDetails);
    
    // Act
    await getRouteDetails(req as Request, res as Response);
    
    // Assert
    expect(fetchRouteDetails).toHaveBeenCalledWith('SomeCounty', 'Monday');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRouteDetails);
  });

  it('should return 404 if no route details are found', async () => {
    // Arrange
    (fetchRouteDetails as jest.Mock).mockResolvedValue(null);
    
    // Act
    await getRouteDetails(req as Request, res as Response);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' });
  });

  it('should return 500 if there is an error', async () => {
    const mockError = new Error('Database connection failed');
    (fetchRouteDetails as jest.Mock).mockRejectedValue(mockError);
  
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    await getRouteDetails(req as Request, res as Response);
  
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching route details:', 
      mockError
    );
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  
    consoleSpy.mockRestore(); // Clean up the spy
  });
});
