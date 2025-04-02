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
  permissions?: string[];
}

export const authenticate = (requiredPermission?: string) => {
  return async (
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
      let permissions = await redisClient.sMembers(
        `permissions:${user.domain}`,
      );

      // If permissions is empty, fetch the "general public" permissions
      if (permissions.length === 0) {
        permissions = await redisClient.sMembers("permissions:generalpublic");
      }

      // Attach user and permissions to request
      req.user = {
        ...user,
        permissions: permissions || [],
      };

      // print permissions
      console.log("permissions: ", permissions);

      // Check permission if required
      if (
        requiredPermission &&
        !req.user!.permissions!.includes(requiredPermission)
      ) {
        res.status(403).json({
          error: `No permission to perform this action: ${requiredPermission}`,
        });
        return;
      }

      // Extend session TTL
      await redisClient.expire(`session:${token}`, 3600);
      next(); // Proceed to next middleware/handler
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ error: "Invalid token" });
      return;
    }
  };
};
