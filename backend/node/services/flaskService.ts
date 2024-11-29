import instance from '../utils/axiosConfig' 
import axios from 'axios'

// Function to send data to Flask
export const sendToFlask = async (locationData: Record<string, any>): Promise<any> => {
  try {
    const response = await instance.post('', locationData)
    return response.data
  } catch (error: any) {
    console.error('Error sending data to Flask:', error.message)
    throw new Error(error.response?.data || 'Failed to send data to Flask')
  }
}

// Function to fetch data from Flask
export const fetchFromFlask = async (): Promise<any> => {
  try {
    const response = await instance.post('')
    return response.data
  } catch (error: any) {
    console.error('Error fetching data from Flask:', error.message)
    throw new Error(error.response?.data || 'Failed to fetch data from Flask')
  }
}
