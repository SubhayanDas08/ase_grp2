import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes'; // Adjust path if needed

const app = express();
app.use(express.json());
app.use('/user', userRoutes);  // Mount the user routes

describe('User Routes', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/user/getRegistrationData')
      .send({ /* mock registration data */ });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Registration data');
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should log out a user', async () => {
    const response = await request(app)
      .post('/user/logout')
      .set('Authorization', 'Bearer <valid_token>');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Logged out successfully');
  });

  it('should refresh token', async () => {
    const response = await request(app)
      .post('/user/refresh')
      .set('Authorization', 'Bearer <valid_refresh_token>');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('newToken');
  });

  it('should get user location by IP', async () => {
    const response = await request(app)
      .get('/user/locationByIp')
      .set('Authorization', 'Bearer <valid_token>');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('location');
  });

  it('should get current user', async () => {
    const response = await request(app)
      .get('/user/get')
      .set('Authorization', 'Bearer <valid_token>');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username');
  });

  it('should change user password', async () => {
    const response = await request(app)
      .post('/user/changePassword')
      .set('Authorization', 'Bearer <valid_token>')
      .send({ oldPassword: 'oldPass', newPassword: 'newPass123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Password changed');
  });

  it('should update user name', async () => {
    const response = await request(app)
      .post('/user/updateName')
      .set('Authorization', 'Bearer <valid_token>')
      .send({ firstName: 'John', lastName: 'Doe' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Name updated');
  });

  it('should report an issue', async () => {
    const response = await request(app)
      .post('/user/reportIssue')
      .set('Authorization', 'Bearer <valid_token>')
      .send({ issue: 'Some issue' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Issue reported');
  });
});
