import * as db from '../services/databaseService';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

const mockQuery = jest.fn();
const mockRelease = jest.fn();
const mockConnect = jest.fn().mockResolvedValue({
  query: mockQuery,
  release: mockRelease,
});

jest.mock('../server', () => ({
  pool: { connect: () => mockConnect() },
}));

describe('Database Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('verifyUserCredentials - returns user', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 1 }] });
    const result = await db.verifyUserCredentials('test@example.com');
    expect(result).toEqual({ id: 1 });
  });

  test('verifyUserCredentials - returns null if not found', async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const result = await db.verifyUserCredentials('test@example.com');
    expect(result).toBeNull();
  });

  test('getUserById - returns user', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: '123' }] });
    const result = await db.getUserById('123');
    expect(result).toEqual({ id: '123' });
  });

  test('getUserById - returns null if not found', async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const result = await db.getUserById('123');
    expect(result).toBeNull();
  });

  test('saveLocationToDatabase - inserts location', async () => {
    mockQuery.mockResolvedValueOnce({}); // BEGIN
    mockQuery.mockResolvedValueOnce({}); // INSERT
    mockQuery.mockResolvedValueOnce({}); // COMMIT
    await db.saveLocationToDatabase('Park', '12.34', '56.78');
    expect(mockQuery).toHaveBeenCalledTimes(3);
  });

  test('getLocationData - returns latest location', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 1 }] });
    const result = await db.getLocationData();
    expect(result).toEqual({ id: 1 });
  });

  test('getLocationData - returns empty result', async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const result = await db.getLocationData();
    expect(result).toEqual({ rows: [] });
  });

  test('saveRegistrationData - saves user and returns data', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com' }] });

    const result = await db.saveRegistrationData(
      'John',
      'Doe',
      'john@tcd.ie',
      'password123',
      1234567890
    );

    expect(result).toEqual({ id: 1, email: 'test@example.com' });
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
  });

  test('updateUserPasswordInDB - updates password', async () => {
    mockQuery.mockResolvedValue({});
    await db.updateUserPasswordInDB('1', 'hashedPassword');
    expect(mockQuery).toHaveBeenCalledWith(
      'UPDATE users SET password = $1 WHERE id = $2',
      ['hashedPassword', '1']
    );
  });

  test('fetchRouteDetails - returns data', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 5 }] });
    const result = await db.fetchRouteDetails('Dublin', 'Monday');
    expect(result).toEqual([{ id: 5 }]);
  });

  test('fetchRouteDetails - returns null if not found', async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const result = await db.fetchRouteDetails('Dublin', 'Monday');
    expect(result).toBeNull();
  });

  test('updateUserFirstAndLastNameInDB - updates name', async () => {
    mockQuery.mockResolvedValue({});
    await db.updateUserFirstAndLastNameInDB('1', 'Alice', 'Smith');
    expect(mockQuery).toHaveBeenCalledWith(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3',
      ['Alice', 'Smith', '1']
    );
  });

 
  test('verifyUserCredentials - throws error on DB fail', async () => {
    mockQuery.mockRejectedValueOnce(new Error('DB Error'));
    await expect(db.verifyUserCredentials('fail@test.com')).rejects.toThrow('DB Error');
  });

  test('saveLocationToDatabase - rolls back on error', async () => {
    mockQuery.mockImplementationOnce(() => {}) // BEGIN
      .mockImplementationOnce(() => { throw new Error('Insert fail') }); // INSERT fails

    await expect(
      db.saveLocationToDatabase('Test', '12', '34')
    ).rejects.toThrow('Insert fail');
  });

  test('getLocationData - returns entire result if no rows', async () => {
    mockQuery.mockResolvedValue({ rows: [], info: 'meta' });
    const result = await db.getLocationData();
    expect(result).toEqual({ rows: [], info: 'meta' });
  });

  test('saveLocationToDatabase - rolls back on DB error', async () => {
    mockQuery
      .mockResolvedValueOnce({}) // BEGIN
      .mockRejectedValueOnce(new Error('fail')); // INSERT fails
  
    await expect(
      db.saveLocationToDatabase('bad', '0', '0')
    ).rejects.toThrow('fail');
    expect(mockQuery).toHaveBeenCalledWith('ROLLBACK');
  });

  test('saveRegistrationData - handles full user save flow', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 42, email: 'john@tcd.ie' }] });
    const result = await db.saveRegistrationData(
      'John',
      'Doe',
      'john@tcd.ie',
      'pass1234',
      9999999999
    );
    expect(result).toEqual({ id: 42, email: 'john@tcd.ie' });
  });

  test('updateUserPasswordInDB - throws error on DB failure', async () => {
    mockQuery.mockRejectedValueOnce(new Error('update fail'));
    await expect(db.updateUserPasswordInDB('123', 'hashed')).rejects.toThrow('update fail');
  });

  test('fetchRouteDetails - returns results', async () => {
    mockQuery.mockResolvedValue({ rows: [{ id: 1 }] });
    const result = await db.fetchRouteDetails('Cork', 'Friday');
    expect(result).toEqual([{ id: 1 }]);
  });
  
  test('fetchRouteDetails - returns null when empty', async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const result = await db.fetchRouteDetails('Cork', 'Friday');
    expect(result).toBeNull();
  });

  test('updateUserFirstAndLastNameInDB - throws on DB failure', async () => {
    mockQuery.mockRejectedValue(new Error('name update failed'));
    await expect(
      db.updateUserFirstAndLastNameInDB('1', 'A', 'B')
    ).rejects.toThrow('name update failed');
  });
});