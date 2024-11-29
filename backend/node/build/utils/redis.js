"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const redis_1 = require("redis");
// Create Redis client
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
});
// Handle connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});
// Connect to Redis
redisClient.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
});
// Export the client
exports.default = redisClient;
// Placeholder for future implementation of the `get` function
const get = (key) => {
    throw new Error('Function not implemented.');
};
exports.get = get;
