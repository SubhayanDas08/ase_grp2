import { authenticate } from '../middleware/authenticate';
import redisClient from '../utils/redis';
import { getUserById } from '../services/databaseService';
import { Request, Response, NextFunction } from 'express';

// Mocking redisClient and databaseService
jest.mock('../utils/redis');
jest.mock('../services/databaseService');

describe('authenticate middleware', () => {
  let req: Partial<Request> & { user?: any; headers: { [key: string]: string } }; // Added user and headers properties
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {}, // Explicitly initializing headers to avoid undefined error
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', async () => {
    req.headers = {}; // Simulating no token

    const authMiddleware = authenticate();
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if session is expired or invalid', async () => {
    // Simulating an invalid token session
    (redisClient.get as jest.Mock).mockResolvedValue(null);

    const authMiddleware = authenticate();
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Session expired or invalid' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not found in the database', async () => {
    // Simulating an expired session token but Redis returns userId
    (redisClient.get as jest.Mock).mockResolvedValue('user123');
    (getUserById as jest.Mock).mockResolvedValue(null); // No user found

    const authMiddleware = authenticate();
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have required permissions', async () => {
    const mockUser = { id: 'user123', permissions: ['read'] };
    (redisClient.get as jest.Mock).mockResolvedValue('user123');
    (redisClient.sMembers as jest.Mock).mockResolvedValue(['read']); // Permissions from Redis
    (getUserById as jest.Mock).mockResolvedValue(mockUser);

    req.headers = { authorization: 'Bearer mockToken' }; // Simulating valid token

    const authMiddleware = authenticate('write'); // Checking for 'write' permission
    await authMiddleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'No permission to perform this action: write' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should attach user and permissions to the request', async () => {
    const mockUser = { id: 'user123', permissions: ['read', 'write'] };
    const mockPermissions = ['read', 'write'];

    (redisClient.get as jest.Mock).mockResolvedValue('user123');
    (redisClient.sMembers as jest.Mock).mockResolvedValue(mockPermissions);
    (getUserById as jest.Mock).mockResolvedValue(mockUser);

    req.headers = { authorization: 'Bearer mockToken' }; // Simulating valid token

    const authMiddleware = authenticate();
    await authMiddleware(req as Request, res as Response, next);

    // Explicitly check user and permissions attached to the request
    expect(req.user).toEqual({
      ...mockUser,
      permissions: mockPermissions,
    });
    expect(next).toHaveBeenCalled();
  });

  it('should call next() if user is authenticated and has required permission', async () => {
    const mockUser = { id: 'user123', permissions: ['read', 'write'] };
    const mockPermissions = ['read', 'write'];

    (redisClient.get as jest.Mock).mockResolvedValue('user123');
    (redisClient.sMembers as jest.Mock).mockResolvedValue(mockPermissions);
    (getUserById as jest.Mock).mockResolvedValue(mockUser);

    req.headers = { authorization: 'Bearer mockToken' }; // Simulating valid token

    const authMiddleware = authenticate('write'); // Checking for 'write' permission
    await authMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should extend session TTL after successful authentication', async () => {
    const mockUser = { id: 'user123', permissions: ['read', 'write'] };
    const mockPermissions = ['read', 'write'];

    (redisClient.get as jest.Mock).mockResolvedValue('user123');
    (redisClient.sMembers as jest.Mock).mockResolvedValue(mockPermissions);
    (getUserById as jest.Mock).mockResolvedValue(mockUser);

    req.headers = { authorization: 'Bearer mockToken' }; // Simulating valid token

    const authMiddleware = authenticate();
    await authMiddleware(req as Request, res as Response, next);

    // Verify redisClient.expire is called with correct parameters
    expect(redisClient.expire).toHaveBeenCalledWith('session:mockToken', 3600);
    expect(next).toHaveBeenCalled();
  });
});
