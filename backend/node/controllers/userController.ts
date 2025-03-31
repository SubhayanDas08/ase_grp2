import { Request, Response } from "express";
import {
  saveRegistrationData,
  verifyUserCredentials,
  saveLocationToDatabase,
  getLocationData,
  getUserById,
  updateUserPasswordInDB
} from "../services/databaseService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../utils/redis";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret";

export const FEregistrationData = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { first_name, last_name, email, password, phone_number } =
      req.body.userData;

    // Check for required fields
    if (!first_name || !last_name || !email || !password || !phone_number) {
      console.error("Error: Missing required user data fields");
      return res
        .status(400)
        .json({ error: "Missing required user data fields" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if email is already in use
    try {
      const existingUser = await verifyUserCredentials(email);
      if (existingUser) {
        return res.status(409).json({ error: "Email already in use" });
      }
    } catch (error) {
      // If error is not because of duplicate email, rethrow it
      if (!(error instanceof Error && error.message.includes("not found"))) {
        throw error;
      }
    }

    // Password strength validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    // Phone number validation (just checking for digits for now)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    console.log("Registering User:", {
      first_name,
      last_name,
      email,
      phone_number,
    });

    const savedUser = await saveRegistrationData(
      first_name,
      last_name,
      email,
      password,
      phone_number,
    );

    const sessionToken = jwt.sign({ userId: savedUser.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { userId: savedUser.id },
      JWT_REFRESH_SECRET,
      { expiresIn: "180d" },
    );

    // Store session and refresh tokens as a pair
    await redisClient.setEx(
      `session:${sessionToken}`,
      3600,
      String(savedUser.id),
    );
    await redisClient.setEx(
      `refresh:${refreshToken}`,
      15552000,
      String(savedUser.id),
    );
    // Link session to user for tracking
    await redisClient.sAdd(`user:${savedUser.id}:sessions`, sessionToken);

    const { password: _, ...userDataWithoutPassword } = savedUser;

    res.status(200).json({
      message: "User registered and logged in successfully",
      user: userDataWithoutPassword,
      token: sessionToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const FElogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body.userData;

    // Check for required fields
    if (!email || !password) {
      console.error("Error: Missing required credentials");
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user exists
    const userData = await verifyUserCredentials(email);
    if (!userData) {
      console.error("Error: User not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      console.error("Error: Password Mismatch");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate tokens
    const sessionToken = jwt.sign({ userId: userData.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ userId: userData.id }, JWT_REFRESH_SECRET, {
      expiresIn: "180d",
    });

    // Store tokens in Redis
    await redisClient.setEx(
      `session:${sessionToken}`,
      3600,
      String(userData.id),
    );
    await redisClient.setEx(
      `refresh:${refreshToken}`,
      15552000,
      String(userData.id),
    );
    await redisClient.sAdd(`user:${userData.id}:sessions`, sessionToken);

    // Remove password from user data
    const { password: userPassword, ...userDataWithoutPassword } = userData;

    res.status(200).json({
      message: "Login successful",
      user: userDataWithoutPassword,
      token: sessionToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
};

export const FElogout = async (req: Request, res: Response): Promise<any> => {
  try {
    const sessionToken = req.headers.authorization?.split(" ")[1];
    const { refreshToken } = req.body; // Client sends refresh token

    if (!sessionToken) {
      return res.status(400).json({ error: "No session token provided" });
    }

    // Delete session token (validated by authenticate)
    await redisClient.del(`session:${sessionToken}`);

    // Get userId from req.user (set by authenticate)
    const userId = (req as any).user!.id;

    // Remove session token from user's session set
    await redisClient.sRem(`user:${userId}:sessions`, sessionToken);

    // Delete and blacklist refresh token if provided
    if (refreshToken) {
      await redisClient.del(`refresh:${refreshToken}`);
      await redisClient.sAdd("blacklisted_refresh_tokens", refreshToken);
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const FErefreshToken = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token provided" });
    }

    const isBlacklisted = await redisClient.sIsMember(
      "blacklisted_refresh_tokens",
      refreshToken,
    );
    if (isBlacklisted) {
      return res.status(401).json({ error: "Refresh token revoked" });
    }

    const userId = await redisClient.get(`refresh:${refreshToken}`);
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      userId: string;
    };
    if (decoded.userId != userId) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newSessionToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: "1h",
    });
    await redisClient.setEx(`session:${newSessionToken}`, 3600, userId);
    await redisClient.sAdd(`user:${userId}:sessions`, newSessionToken);

    res.status(200).json({ token: newSessionToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
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

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {

  try {
    const userId = (req as any).user?.id;
    console.log(userId);
    

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
    }

    const userData = await getUserById(userId);

    if (!userData) {
      res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = userData;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const changeUserPassword = async (
  req: Request,
  res: Response,): Promise<any> => {
    try {
      const userId = (req as any).user?.id;
      const { oldPassword, newPassword } = req.body;
  
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ error: "Old and new passwords are required" });
      }
  
      if (newPassword.length < 8) {
        return res
          .status(400)
          .json({ error: "New password must be at least 8 characters long" });
      }
  
      const user = await getUserById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Old password is incorrect" });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updateUserPasswordInDB(userId, hashedPassword);
  
      const userSessionsKey = `user:${userId}:sessions`;
      const sessionTokens = await redisClient.sMembers(userSessionsKey);
      for (const token of sessionTokens) {
        await redisClient.del(`session:${token}`);
      }
      await redisClient.del(userSessionsKey);
  
      const sessionToken = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
        expiresIn: "180d",
      });
  
      await redisClient.setEx(`session:${sessionToken}`, 3600, String(userId));
      await redisClient.setEx(`refresh:${refreshToken}`, 15552000, String(userId));
      await redisClient.sAdd(`user:${userId}:sessions`, sessionToken);
  
      return res.status(200).json({
        message: "Password changed successfully",
        token: sessionToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };