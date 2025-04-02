import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import locationRoutes from './routes/locationRoutes';
import eventsRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';
import weatherRoutes from "./routes/weatherRoutes";
import dotenv from 'dotenv';
import path from 'path';

// 1. Import prom-client
import {
  collectDefaultMetrics,
  register,
  Histogram
} from 'prom-client';

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
// console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Start collecting default metrics
collectDefaultMetrics();

// 3. Create a custom histogram to track HTTP request durations
const httpRequestDurationMs = new Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  // "method", "route", "status_code" can be used as labels in Grafana queries
  labelNames: ['method', 'route', 'status_code'],
  // Buckets for response time in milliseconds
  buckets: [50, 100, 200, 300, 400, 500]
});

// 4. Middleware to measure each request's duration
app.use((req, res, next) => {
  // Start the timer
  const end = httpRequestDurationMs.startTimer();

  res.on('finish', () => {
    // Stop the timer, record labels
    end({
      method: req.method,
      // route might be undefined if no matching route; fallback to req.path
      route: req.route?.path || req.path,
      status_code: res.statusCode
    });
  });

  next();
});

// Routes
app.use('/locations', locationRoutes);
app.use('/events', eventsRoutes);
app.use('/user', userRoutes);
app.use('/weather', weatherRoutes);

// 5. Expose /metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'postgres',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
});

// Test PostgreSQL connection
pool.connect()
  .then(() => console.log('PostgreSQL Connected Successfully'))
  .catch((error) => console.error('PostgreSQL Connection Error:', error.message));

// Start the server
const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('Checking Environment Variables:');
console.log('PG_HOST:', process.env.PG_HOST);
console.log('PG_USER:', process.env.PG_USER);
console.log('PG_DATABASE:', process.env.PG_DATABASE);
console.log('PG_PASSWORD:', process.env.PG_PASSWORD ? '****' : 'Not Set');
console.log('REDIS_HOST:', process.env.REDIS_HOST);
