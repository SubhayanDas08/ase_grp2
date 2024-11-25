const express = require("express");
const { createEvent, getEventById, getAllEvents } = require("../controllers/events");

const router = express.Router();

// Define routes
router.post("/", createEvent);
router.get("/:id", getEventById);
router.get("/", getAllEvents);

module.exports = router;