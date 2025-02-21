"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEvents = exports.getEventById = exports.createEvent = void 0;
const redis_1 = __importDefault(require("../utils/redis"));
const server_1 = require("../server");
// Create a new event
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, start_date, end_date } = req.body;
    const client = yield server_1.pool.connect();
    try {
        yield client.query('BEGIN');
        const insertEventQuery = `
      INSERT INTO public.events (name, start_date, end_date)
      VALUES ($1, $2, $3)
      RETURNING id, name, start_date, end_date
    `;
        const result = yield client.query(insertEventQuery, [name, start_date, end_date]);
        const newEvent = result.rows[0];
        // Cache the new event in Redis
        const key = `event:${newEvent.id}`;
        yield redis_1.default.setEx(key, 3600, JSON.stringify(newEvent));
        yield client.query('COMMIT');
        res.status(201).json(newEvent);
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
    finally {
        client.release();
    }
});
exports.createEvent = createEvent;
// Fetch an event by ID
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.id;
    const key = `event:${eventId}`;
    try {
        // Check if the event is cached in Redis
        const cachedEvent = yield redis_1.default.get(key);
        if (cachedEvent) {
            res.json(JSON.parse(cachedEvent));
            return;
        }
        const result = yield server_1.pool.query('SELECT id, name, start_date, end_date FROM public.events WHERE id = $1', [eventId]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Event not found.' });
            return;
        }
        const event = result.rows[0];
        // Cache the fetched event in Redis
        yield redis_1.default.setEx(key, 3600, JSON.stringify(event));
        res.json(event);
    }
    catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.getEventById = getEventById;
// Fetch all events
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield server_1.pool.query('SELECT id, name, start_date, end_date FROM public.events ORDER BY start_date');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching all events:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.getAllEvents = getAllEvents;
