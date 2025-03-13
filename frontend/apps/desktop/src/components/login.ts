import axios from "axios";
import  {aesEncrypt, aesDecrypt} from './aesInterceptor'

const API_BASE_URL = "http://localhost:5000"; // Change to your backend URL

export const registerUser = async (userData:any) => {
    try {
        const encryptedData = aesEncrypt(userData);

        const response = await axios.post(`${API_BASE_URL}/register`, { encryptedData });

        const decryptedResponse = aesDecrypt(response.data.encryptedData);
        return decryptedResponse;
    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Registration failed" };
    }
};

export const loginUser = async (credentials:any) => {
    try {
        const encryptedData = aesEncrypt(credentials);

        const response = await axios.post(`${API_BASE_URL}/users/login`, { encryptedData });

        const decryptedResponse = aesDecrypt(response.data.encryptedData);
        return decryptedResponse;
    } catch (error) {
        console.error("Login Error:", error);
        return { error: "Login failed" };
    }
};