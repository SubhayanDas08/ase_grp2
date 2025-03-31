// middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import redisClient from "../utils/redis";
import { getUserById } from "../services/databaseService";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  domain: string;
}

export const authenticate = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    // Check Redis for the session token
    const userId = await redisClient.get(`session:${token}`);
    if (!userId) {
      res.status(401).json({ error: "Session expired or invalid" });
      return; // No fallback to JWT
    }

    // Fetch user from database
    const user = await getUserById(userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Fetch user permissions from Redis

    // const permissions = await redisClient.lRange(
    //   `permissions:${user.domain}`,
    //   0,
    //   -1,
    // );
    
    let permissions: string[] = [];
    try {
      permissions = await redisClient.lRange(`permissions:${user.domain}`, 0, -1);
    } catch (error) {
      console.error(`Error fetching permissions for domain ${user.domain}:`, error);
    }

    // Attach user and permissions to request
    req.user = {
      ...user,
      permissions: permissions || [],
    };

    // Extend session TTL
    await redisClient.expire(`session:${token}`, 3600);
    next(); // Proceed to next middleware/handler
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
