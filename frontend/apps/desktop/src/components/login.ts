import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/user/getRegistrationData`,
      { userData },
    );
    return JSON.stringify(response.data);
  } catch (err) {
    console.error("Registration Error:", err);
    return { error: "Registration failed" };
  }
};

export const loginUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
      userData,
    });

    return JSON.stringify(response.data);
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Login failed" };
  }
};
