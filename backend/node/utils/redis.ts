import { createClient, RedisClientType } from "redis";
import * as path from "path";

// dotenv configuration
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Create Redis client
const redisClient: RedisClientType = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  password: process.env.REDIS_PASSWORD || '1234',
});

// Handle connection events
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect to Redis
redisClient.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
});

// Export the client
export default redisClient;

// Placeholder for future implementation of the `get` function
export const get = (key: string): never => {
  throw new Error("Function not implemented.");
};
