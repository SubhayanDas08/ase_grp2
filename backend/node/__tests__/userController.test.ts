import { Request, Response } from 'express';
import * as userController from '../controllers/userController';
import * as databaseService from '../services/databaseService';
import redisClient from '../utils/redis';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../server';

jest.mock('../services/databaseService');
jest.mock('../utils/redis', () => ({
  setEx: jest.fn(),
  sAdd: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  sIsMember: jest.fn(),
  sMembers: jest.fn(),
  sRem: jest.fn(),
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockRes = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res;
};

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('FEregistrationData', () => {
    it('should return 400 if required fields are missing', async () => {
      const req = { body: { userData: {} } } as Partial<Request>;
      const res = mockRes();
      await userController.FEregistrationData(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('FElogin', () => {
    it('should return 400 if credentials are missing', async () => {
      const req = { body: { userData: {} } } as Partial<Request>;
      const res = mockRes();
      await userController.FElogin(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 if user not found', async () => {
      (databaseService.verifyUserCredentials as jest.Mock).mockResolvedValue(null);
      const req = { body: { userData: { email: 'test@example.com', password: 'password123' } } } as Partial<Request>;
      const res = mockRes();
      await userController.FElogin(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('FElogout', () => {
    it('should return 400 if no session token provided', async () => {
      const req = { headers: {}, body: {} } as Partial<Request>;
      const res = mockRes();
      await userController.FElogout(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 200 on successful logout', async () => {
      (redisClient.del as jest.Mock).mockResolvedValue(1);
      (redisClient.sRem as jest.Mock).mockResolvedValue(1);
      (redisClient.sAdd as jest.Mock).mockResolvedValue(1);

      const req = {
        headers: { authorization: 'Bearer dummyToken' },
        body: { refreshToken: 'refreshDummy' },
        user: { id: 1 },
      } as unknown as Request;
      const res = mockRes();

      await userController.FElogout(req, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });
});

afterAll(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks(); 
});
