import express, { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
} from "../controllers/eventsController";
import { authenticate } from "../middleware/authenticate";
const router: Router = express.Router();

// Define routes
router.post("/create", authenticate, createEvent); // Route to create an event, requires authentication
router.get("/:id", getEventById); // Route to get an event by ID
router.get("/", getAllEvents); // Route to get all events

export default router;
