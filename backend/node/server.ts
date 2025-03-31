import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import locationRoutes from './routes/locationRoutes';
import eventsRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';
import weatherRoutes from "./routes/weatherRoutes";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
// console.log("Loading .env from:", envPath);

dotenv.config({ path: envPath });


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/locations', locationRoutes);
app.use('/events', eventsRoutes);
app.use('/user', userRoutes);
app.use('/weather', weatherRoutes);

// PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE || 'postgres',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  // idleTimeoutMillis: 30000, // Closes idle clients after 30 sec
  // connectionTimeoutMillis: 5000, // Timeout for new connections (5 sec)
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

