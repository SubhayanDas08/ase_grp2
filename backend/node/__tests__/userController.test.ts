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

    it('should return 409 if email already in use', async () => {
        (databaseService.verifyUserCredentials as jest.Mock).mockResolvedValue(true);
        const req = {
          body: {
            userData: {
              first_name: 'Test',
              last_name: 'User',
              email: 'existing@example.com',
              password: 'securepass123',
              phone_number: '1234567890',
            },
          },
        } as Partial<Request>;
        const res = mockRes();
        await userController.FEregistrationData(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(409);
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

    it('should return 401 if password mismatch', async () => {
        (databaseService.verifyUserCredentials as jest.Mock).mockResolvedValue({ password: 'hashedpass' });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
        const req = {
          body: { userData: { email: 'test@example.com', password: 'wrong' } },
        } as Partial<Request>;
        const res = mockRes();
      
        await userController.FElogin(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it('should return 401 if refresh token is blacklisted', async () => {
        (redisClient.sIsMember as jest.Mock).mockResolvedValue(true);
        const req = { body: { refreshToken: 'blacklisted' } } as Partial<Request>;
        const res = mockRes();
      
        await userController.FErefreshToken(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it('should return 400 if old password does not match', async () => {
        (databaseService.getUserById as jest.Mock).mockResolvedValue({ password: 'hashed' });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
        const req = {
          user: { id: 1 },
          body: { oldPassword: 'wrong', newPassword: 'newpassword123' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.changeUserPassword(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it('should return 400 if first or last name is missing', async () => {
        const req = {
          user: { id: 1 },
          body: { firstName: '', lastName: '' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.updateFirstAndLastName(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it('should return 404 if user not found', async () => {
        (databaseService.getUserById as jest.Mock).mockResolvedValue(null);
        const req = { user: { id: 123 } } as unknown as Request;
        const res = mockRes();
      
        await userController.getCurrentUser(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(404);
      });

      it('should return IP address from headers or socket', async () => {
        const req = {
          headers: { 'x-real-ip': '192.168.1.1' },
          socket: { remoteAddress: '127.0.0.1' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.getLocationByIp(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: '192.168.1.1' });
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
