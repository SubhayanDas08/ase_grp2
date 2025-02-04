import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { Pool } from 'pg'
import locationRoutes from './routes/locationRoutes'
import eventsRoutes from './routes/eventRoutes'
import userRoutes from './routes/userRoutes'

const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/locations', locationRoutes)
app.use('/events', eventsRoutes)
app.use('/user', userRoutes)

// PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
})

// Test PostgreSQL connection
pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL')
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL:', error)
  })

// Start the server
const PORT: number = parseInt(process.env.PORT || '3000', 10)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

console.log('PostgreSQL Host:', process.env.PG_HOST)
