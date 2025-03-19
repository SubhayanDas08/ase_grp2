import express, { Router } from 'express'
import { createEvent, getAllEvents , getEventById } from '../controllers/eventsController'
const router: Router = express.Router()

// Define routes
router.post('/create', createEvent) // Route to create an event
router.get('/:id', getEventById) // Route to get an event by ID
router.get('/', getAllEvents) // Route to get all events

export default router
