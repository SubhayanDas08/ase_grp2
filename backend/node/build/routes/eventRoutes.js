"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventsController_1 = require("../controllers/eventsController");
const router = express_1.default.Router();
// Define routes
router.post('/', eventsController_1.createEvent); // Route to create an event
router.get('/:id', eventsController_1.getEventById); // Route to get an event by ID
router.get('/', eventsController_1.getAllEvents); // Route to get all events
exports.default = router;
