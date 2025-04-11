import express, { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEvent
} from "../controllers/eventsController";
import { authenticate } from "../middleware/authenticate";
const router: Router = express.Router();

// Define routes
router.post("/create", authenticate("manage_events"), createEvent); // Route to create an event, requires authentication
router.get("/:id", getEventById); // Route to get an event by ID
router.get("/", getAllEvents); // Route to get all events
router.delete("/delete/:id", authenticate("manage_events"), deleteEvent); // Route to delete an event

export default router;
