import { Request, Response } from "express";
import {
  saveRegistrationData,
  verifyUserCredentials,
  saveLocationToDatabase,
  getLocationData,
} from "../services/databaseService";
import bcrypt from "bcrypt";

export const FEregistrationData = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { first_name, last_name, email, password, phone_number } =
      req.body.userData;

    if (!first_name || !last_name || !email || !password || !phone_number) {
      console.error("Error: Missing required user data fields");
      return res
        .status(400)
        .json({ error: "Missing required user data fields" });
    }

    console.log("Registering User:", {
      first_name,
      last_name,
      email,
      phone_number,
    });

    // Save user data with role assignment
    const savedUser = await saveRegistrationData(
      first_name,
      last_name,
      email,
      password,
      phone_number,
    );

    res.status(200).json({
      message: "User registered successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const FElogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body.userData;

    if (!email || !password) {
      console.error("Error: Missing required credentials");
      return res.status(400).json({ error: "Missing required credentials" });
    }

    const userData = await verifyUserCredentials(email);
    if (!userData) {
      console.error("Error: User not found");
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    console.log("Retrieved User Data:", userData);

    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (passwordMatch) {
      console.log("Login Successful for:", email);

      // Don't send password back to client
      const { password, ...userDataWithoutPassword } = userData;

      // Return direct response (no encryption)
      res.status(200).json({
        message: "Login Successful",
        user: userDataWithoutPassword,
      });
    } else {
      console.error("Error: Password Mismatch");
      return res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getLocationByIp = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Retrieve user's IP address
    const userIp = req.headers["x-real-ip"] || req.socket.remoteAddress;
    res.status(200).json({ data: userIp });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
