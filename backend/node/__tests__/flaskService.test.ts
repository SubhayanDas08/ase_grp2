// import { sendToFlask, fetchFromFlask } from '../services/flaskService';
// import axios from 'axios';

// // Mock the axios instance
// jest.mock('axios');

// describe('flaskService', () => {
  
//   describe('sendToFlask', () => {
//     it('should send data to Flask and return response data on success', async () => {
//       // Arrange
//       const locationData = { lat: 12.34, lon: 56.78 };
//       const mockResponse = { data: { success: true } };
//       (axios.post as jest.Mock).mockResolvedValue(mockResponse);

//       // Act
//       const result = await sendToFlask(locationData);

//       // Assert
//       expect(result).toEqual(mockResponse.data);
//       expect(axios.post).toHaveBeenCalledWith('', locationData);
//     });

//     it('should throw error when sending data to Flask fails', async () => {
//       // Arrange
//       const locationData = { lat: 12.34, lon: 56.78 };
//       const mockError = { response: { data: 'Error sending data' }, message: 'Request failed' };
//       (axios.post as jest.Mock).mockRejectedValue(mockError);

//       // Act & Assert
//       await expect(sendToFlask(locationData)).rejects.toThrow('Error sending data to Flask');
//     });
//   });

//   describe('fetchFromFlask', () => {
//     it('should fetch data from Flask and return response data on success', async () => {
//       // Arrange
//       const mockResponse = { data: { success: true } };
//       (axios.post as jest.Mock).mockResolvedValue(mockResponse);

//       // Act
//       const result = await fetchFromFlask();

//       // Assert
//       expect(result).toEqual(mockResponse.data);
//       expect(axios.post).toHaveBeenCalledWith('');
//     });

//     it('should throw error when fetching data from Flask fails', async () => {
//       // Arrange
//       const mockError = { response: { data: 'Error fetching data' }, message: 'Request failed' };
//       (axios.post as jest.Mock).mockRejectedValue(mockError);

//       // Act & Assert
//       await expect(fetchFromFlask()).rejects.toThrow('Error fetching data from Flask');
//     });
//   });

// });
import { sendToFlask, fetchFromFlask } from '../services/flaskService';
import axios from 'axios';

// Mock the axios instance and console.error
jest.mock('axios');
jest.spyOn(console, 'error').mockImplementation(() => {});  // Mock console.error to suppress output

describe('flaskService', () => {
  
  describe('sendToFlask', () => {
    it('should send data to Flask and return response data on success', async () => {
      // Arrange
      const locationData = { lat: 12.34, lon: 56.78 };
      const mockResponse = { data: { success: true } };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await sendToFlask(locationData);

      // Assert
      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith('', locationData);
    });

    it('should throw error when sending data to Flask fails', async () => {
      // Arrange
      const locationData = { lat: 12.34, lon: 56.78 };
      const mockError = { response: { data: 'Error sending data' }, message: 'Request failed' };
      (axios.post as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(sendToFlask(locationData)).rejects.toThrow('Error sending data to Flask');
      expect(console.error).toHaveBeenCalledWith('Error sending data to Flask:', mockError.message);
    });
  });

  describe('fetchFromFlask', () => {
    it('should fetch data from Flask and return response data on success', async () => {
      // Arrange
      const mockResponse = { data: { success: true } };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await fetchFromFlask();

      // Assert
      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith('');
    });

    it('should throw error when fetching data from Flask fails', async () => {
      // Arrange
      const mockError = { response: { data: 'Error fetching data' }, message: 'Request failed' };
      (axios.post as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(fetchFromFlask()).rejects.toThrow('Error fetching data from Flask');
      expect(console.error).toHaveBeenCalledWith('Error fetching data from Flask:', mockError.message);
    });
  });

});
