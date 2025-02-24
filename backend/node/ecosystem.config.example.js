module.exports = {
  apps: [
    {
      name: "backend",
      script: "./build/server.js",
      env: {
        NODE_ENV: "development",
        // Redis credentials
        REDIS_HOST: "your-redis-host",
        REDIS_PORT: "your-redis-port",
        // PostgreSQL credentials
        PG_HOST: "your-pg-host",
        PG_PORT: "your-pg-port",
        PG_DATABASE: "your-database",
        PG_USER: "your-username",
        PG_PASSWORD: "your-password",
      },
    },
  ],
};
