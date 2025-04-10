import request from 'supertest';
import express from 'express';
import * as locationController from '../controllers/locationController';
import * as databaseService from '../services/databaseService';
import * as flaskService from '../services/flaskService';
import { aesEncrypt, aesDecrypt } from '../interceptors/aesEncryption';

jest.setTimeout(10000); // Increase test timeout in case of async delays

jest.mock('../utils/redis', () => ({
  quit: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../server', () => ({
  pool: {
    end: jest.fn().mockResolvedValue(undefined),
  },
  app: {},
}));

jest.mock('../services/databaseService');
jest.mock('../services/flaskService');
jest.mock('../interceptors/aesEncryption');

const app = express();
app.use(express.json());
app.post('/receive', locationController.receiveLocationData);
app.get('/send-to-flask', locationController.sendDataToFlask);
app.get('/fetch-from-flask', locationController.fetchDataFromFlask);
app.get('/weather', locationController.getWeatherData);

describe('Location Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('receiveLocationData - success', async () => {
    (databaseService.saveLocationToDatabase as jest.Mock).mockResolvedValue(true);
    (aesDecrypt as jest.Mock).mockReturnValue(JSON.stringify({
      label: 'A',
      latitude: 12.34,
      longitude: 56.78
    }));
    (aesEncrypt as jest.Mock).mockImplementation(() => ({
      message: 'Location data received successfully.'
    }));

    const response = await request(app)
      .post('/receive')
      .send({ encryptedData: 'dummy' });

    expect(response.status).toBe(201);
    expect(response.body.encryptedData.message).toContain('Location data received successfully.');
  });

  test('receiveLocationData - missing fields', async () => {
    (aesDecrypt as jest.Mock).mockReturnValue(JSON.stringify({}));
    (aesEncrypt as jest.Mock).mockImplementation(() => ({
      error: 'All fields are required.'
    }));

    const response = await request(app)
      .post('/receive')
      .send({ encryptedData: 'dummy' });

    expect(response.status).toBe(400);
    expect(response.body.encryptedData.error).toContain('All fields are required.');
  });

  test('sendDataToFlask - success', async () => {
    (databaseService.getLocationData as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (flaskService.sendToFlask as jest.Mock).mockResolvedValue({ flask: 'ok' });
    (aesEncrypt as jest.Mock).mockImplementation(() => ({
      message: 'Data sent to Flask successfully.'
    }));

    const response = await request(app).get('/send-to-flask');
    expect(response.status).toBe(200);
    expect(response.body.encryptedData.message).toContain('Data sent to Flask successfully.');
  });

  test('fetchDataFromFlask - success', async () => {
    (flaskService.fetchFromFlask as jest.Mock).mockResolvedValue({ data: 123 });
    (aesEncrypt as jest.Mock).mockImplementation(() => ({
      data: 123
    }));

    const response = await request(app).get('/fetch-from-flask');
    expect(response.status).toBe(200);
    expect(response.body.encryptedData.data).toBe(123);
  });

  test('getWeatherData - success', async () => {
    (aesEncrypt as jest.Mock).mockImplementation(() => ({
      temperature: 25
    }));

    const response = await request(app).get('/weather');
    expect(response.status).toBe(200);
    expect(response.body.encryptedData.temperature).toBe(25);
  });
});

afterAll(() => {
  jest.resetAllMocks();
});