import { Request, Response } from 'express';
import * as userController from '../controllers/userController';
import * as databaseService from '../services/databaseService';
import redisClient from '../utils/redis';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../server';

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

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

      it('should return 200 on successful registration', async () => {
        (databaseService.verifyUserCredentials as jest.Mock).mockRejectedValue(new Error('not found'));
        (databaseService.saveRegistrationData as jest.Mock).mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          phone_number: '1234567890',
          domain: 'generalpublic',
        });
        (jwt.sign as jest.Mock).mockReturnValue('mockedToken');
        (redisClient.setEx as jest.Mock).mockResolvedValue(true);
        (redisClient.sAdd as jest.Mock).mockResolvedValue(true);
        (redisClient.sMembers as jest.Mock).mockResolvedValue(['read']);
      
        const req = {
          body: {
            userData: {
              first_name: 'Test',
              last_name: 'User',
              email: 'test@example.com',
              password: 'securepassword',
              phone_number: '1234567890',
            },
          },
        } as Request;
        const res = mockRes();
      
        await userController.FEregistrationData(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should return 500 if DB throws unexpected error during registration', async () => {
        (databaseService.verifyUserCredentials as jest.Mock).mockRejectedValue(new Error('database error'));
      
        const req = {
          body: {
            userData: {
              first_name: 'Test',
              last_name: 'User',
              email: 'fail@example.com',
              password: 'securepassword',
              phone_number: '1234567890',
            },
          },
        } as Request;
        const res = mockRes();
      
        await userController.FEregistrationData(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
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

      it('should return 200 when password is successfully changed', async () => {
        (databaseService.getUserById as jest.Mock).mockResolvedValue({ id: 1, password: 'oldhash' });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');
        (databaseService.updateUserPasswordInDB as jest.Mock).mockResolvedValue(true);
        (redisClient.sMembers as jest.Mock).mockResolvedValue(['session1']);
        (redisClient.del as jest.Mock).mockResolvedValue(1);
        (jwt.sign as jest.Mock).mockReturnValue('newToken');
        (redisClient.setEx as jest.Mock).mockResolvedValue(true);
        (redisClient.sAdd as jest.Mock).mockResolvedValue(true);
      
        const req = {
          user: { id: 1 },
          body: { oldPassword: 'oldpass', newPassword: 'newsecurepass' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.changeUserPassword(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should return 200 with new token if refresh token is valid', async () => {
        (redisClient.sIsMember as jest.Mock).mockResolvedValue(false);
        (redisClient.get as jest.Mock).mockResolvedValue('1');
        (jwt.verify as jest.Mock).mockReturnValue({ userId: '1' });
        (jwt.sign as jest.Mock).mockReturnValue('newToken');
        (redisClient.setEx as jest.Mock).mockResolvedValue(true);
        (redisClient.sAdd as jest.Mock).mockResolvedValue(true);
        (redisClient.sMembers as jest.Mock).mockResolvedValue(['read']);
      
        const req = {
          body: { refreshToken: 'validToken' },
          user: { domain: 'generalpublic' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.FErefreshToken(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          token: 'newToken',
          permissions: ['read'],
        });
      });

      it('should return 401 if no userId is found in getCurrentUser', async () => {
        const req = { user: undefined } as unknown as Request;
        const res = mockRes();
        await userController.getCurrentUser(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it('should return 401 if updateFirstAndLastName is called without auth', async () => {
        const req = {
          body: { firstName: 'Test', lastName: 'User' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.updateFirstAndLastName(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(401);
      });

      it('should return 404 if user is not found during password change', async () => {
        (databaseService.getUserById as jest.Mock).mockResolvedValue(null);
        const req = {
          user: { id: 1 },
          body: { oldPassword: 'oldpass', newPassword: 'newpassword' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.changeUserPassword(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(404);
      });

      it('should return 500 if DB fails during name update', async () => {
        (databaseService.updateUserFirstAndLastNameInDB as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = {
          user: { id: 1 },
          body: { firstName: 'John', lastName: 'Doe' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.updateFirstAndLastName(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
      });

      it('should return 400 if old or new password is missing', async () => {
        const req = {
          user: { id: 1 },
          body: { oldPassword: '', newPassword: '' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.changeUserPassword(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it('should return 400 if new password is too short', async () => {
        const req = {
          user: { id: 1 },
          body: { oldPassword: 'oldpass', newPassword: '123' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.changeUserPassword(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it('should return 500 if user.password is undefined', async () => {
        (databaseService.getUserById as jest.Mock).mockResolvedValue({ password: undefined });
      
        const req = {
          user: { id: 1 },
          body: { oldPassword: 'old', newPassword: 'newpassword123' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.changeUserPassword(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
      });

      it('should return 500 if DB update fails when changing password', async () => {
        (databaseService.getUserById as jest.Mock).mockResolvedValue({ password: 'hash' });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');
        (databaseService.updateUserPasswordInDB as jest.Mock).mockRejectedValue(new Error('fail'));
      
        const req = {
          user: { id: 1 },
          body: { oldPassword: 'old', newPassword: 'newpassword123' },
        } as unknown as Request;
        const res = mockRes();
      
        await userController.changeUserPassword(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
      });

      it('should return 500 if getUserById throws error', async () => {
        (databaseService.getUserById as jest.Mock).mockRejectedValue(new Error('DB error'));
        const req = { user: { id: 1 } } as unknown as Request;
        const res = mockRes();
        await userController.getCurrentUser(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
      });

      it('should return 500 if updateUserFirstAndLastNameInDB throws error', async () => {
        (databaseService.updateUserFirstAndLastNameInDB as jest.Mock).mockRejectedValue(new Error('fail'));
        const req = {
          user: { id: 1 },
          body: { firstName: 'John', lastName: 'Doe' },
        } as unknown as Request;
        const res = mockRes();
        await userController.updateFirstAndLastName(req, res as Response);
        expect(res.status).toHaveBeenCalledWith(500);
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
